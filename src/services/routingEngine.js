// Multi-Modal Door-to-Door Routing and Proactive Decision Support Engine
// Compact, direct step instructions with Proper Title Case and no redundant descriptions.

import {
  MRT_STATIONS,
  LINE_STATION_ORDERS,
  getStationById,
  getNearestStation,
  getStationCodeForLine,
} from '../data/mrtStations.js';
import { CANONICAL_LINES } from '../data/canonicalLines.js';
import {
  BUS_STOPS,
  MAJOR_BUS_SERVICES,
  getNearestBusStops,
  getBusStopByCode,
} from '../data/busData.js';
import {
  findDirectBusOptions,
  getBusServiceInfo,
  getOfficialTerminus,
  getNearbyStopsFromNetwork,
} from './busRoutingService.js';
import { generateCurvedTransitPath } from '../utils/geometry.js';
import { SCENARIOS } from '../data/scenarios.js';

// ============================================================================
// [WALKING ROUTE - START] (Comment out this block to disable walking routes)
import {
  ENABLE_WALKING_ROUTES,
  calculateWalkingRoute,
  generatePedestrianPath,
} from './walkingRoutingService.js';
// [WALKING ROUTE - END]
// ============================================================================

// Haversine distance in kilometers
function haversineDistKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

// Time formatting helpers (Singapore SGT timezone)
function getSingaporeNow() {
  return new Date();
}

function formatClockTime(date) {
  try {
    return date.toLocaleTimeString('en-SG', {
      timeZone: 'Asia/Singapore',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });
  } catch (e) {
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${hours}:${mins}`;
  }
}

function addMinutes(date, mins) {
  return new Date(date.getTime() + mins * 60000);
}

// Convert any string to Proper Title Case
export function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Find a feeder bus from origin to the nearest MRT station.
 * Returns null if origin is within walking distance (<1km) or no bus is found.
 * Returns { serviceNo, services, boardStop, alightStop, rideDurationMin, waitMin,
 *           walkToStopMin, walkToStopM, coordinates, totalMin, subtitle } on success.
 */
function findFeederBusToStation(origin, stationObj) {
  if (!origin || !stationObj) return null;

  const distToStationKm = haversineDistKm(origin.lat, origin.lng, stationObj.lat, stationObj.lng);
  // Only suggest feeder bus if station is > 1km away
  if (distToStationKm < 1.0) return null;

  // Use findDirectBusOptions to find buses between origin and the station location
  const stationDest = {
    lat: stationObj.lat,
    lng: stationObj.lng,
    name: stationObj.name,
    shortName: stationObj.name,
  };
  const busOptions = findDirectBusOptions(origin, stationDest, 3);

  if (busOptions && busOptions.length > 0) {
    // Pick the best (fastest) feeder bus
    const best = busOptions[0];
    return {
      serviceNo: best.serviceNo || best.primaryServiceNo,
      services: best.services || [best.serviceNo],
      boardStop: best.boardStop,
      alightStop: best.alightStop,
      rideDurationMin: best.rideDurationMin,
      waitMin: best.waitMin || 5,
      walkToStopMin: best.walkOriginMin || 2,
      walkToStopM: best.boardStop?.distanceM || 200,
      walkFromStopMin: best.walkDestMin || 2,
      walkFromStopM: best.alightStop?.distanceM || 200,
      coordinates: best.coordinates || [],
      totalMin: best.totalDurationMin,
      stopsCount: best.stopsCount || 0,
      subtitle: `Bus ${best.serviceNo || best.primaryServiceNo} to ${stationObj.name}`,
      isMultiBus: best.isMultiBus || false,
    };
  }

  // Fallback: no direct bus found — try to find any bus near origin that passes near the station
  const originStops = getNearbyStopsFromNetwork(origin.lat, origin.lng, 4, 1.0);
  const stationStops = getNearbyStopsFromNetwork(stationObj.lat, stationObj.lng, 4, 0.5);

  if (originStops.length > 0 && stationStops.length > 0) {
    // Find common bus services between origin stops and station stops
    const stationSvcSet = new Set();
    stationStops.forEach(s => s.services.forEach(svc => stationSvcSet.add(svc)));

    for (const oStop of originStops) {
      const commonSvcs = oStop.services.filter(svc => stationSvcSet.has(svc));
      if (commonSvcs.length > 0) {
        const svcNo = commonSvcs[0];
        const estDistKm = haversineDistKm(oStop.lat, oStop.lng, stationObj.lat, stationObj.lng);
        const estRideMin = Math.max(5, Math.round((estDistKm / 17) * 60));
        const walkToMin = Math.max(2, Math.round(oStop.distanceM / 75));
        return {
          serviceNo: svcNo,
          services: commonSvcs.slice(0, 3),
          boardStop: oStop,
          alightStop: stationStops[0],
          rideDurationMin: estRideMin,
          waitMin: commonSvcs.length > 1 ? 4 : 6,
          walkToStopMin: walkToMin,
          walkToStopM: oStop.distanceM,
          walkFromStopMin: 2,
          walkFromStopM: stationStops[0].distanceM || 150,
          coordinates: [[oStop.lat, oStop.lng], [stationObj.lat, stationObj.lng]],
          totalMin: walkToMin + 5 + estRideMin + 2,
          stopsCount: Math.max(2, Math.round(estDistKm * 2.5)),
          subtitle: `Bus ${commonSvcs.length > 1 ? commonSvcs.slice(0, 2).join(', ') : svcNo} to ${stationObj.name}`,
          isMultiBus: commonSvcs.length > 1,
        };
      }
    }
  }

  return null;
}

/**
 * Find a feeder bus from an MRT station to a far-away destination.
 * Mirror of findFeederBusToStation but for the last-mile.
 */
function findFeederBusFromStation(stationObj, destination) {
  if (!stationObj || !destination) return null;

  const distFromStationKm = haversineDistKm(stationObj.lat, stationObj.lng, destination.lat, destination.lng);
  if (distFromStationKm < 1.0) return null;

  const stationOrig = {
    lat: stationObj.lat,
    lng: stationObj.lng,
    name: stationObj.name,
    shortName: stationObj.name,
  };
  const busOptions = findDirectBusOptions(stationOrig, destination, 3);

  if (busOptions && busOptions.length > 0) {
    const best = busOptions[0];
    return {
      serviceNo: best.serviceNo || best.primaryServiceNo,
      services: best.services || [best.serviceNo],
      boardStop: best.boardStop,
      alightStop: best.alightStop,
      rideDurationMin: best.rideDurationMin,
      waitMin: best.waitMin || 5,
      walkToStopMin: best.walkOriginMin || 2,
      walkToStopM: best.boardStop?.distanceM || 200,
      walkFromStopMin: best.walkDestMin || 2,
      walkFromStopM: best.alightStop?.distanceM || 200,
      coordinates: best.coordinates || [],
      totalMin: best.totalDurationMin,
      stopsCount: best.stopsCount || 0,
      subtitle: `Bus ${best.serviceNo || best.primaryServiceNo}`,
      isMultiBus: best.isMultiBus || false,
    };
  }

  return null;
}

/**
 * Plan door-to-door commute route between ANY origin and ANY destination
 */
export function planCommuteRoute(origin, destination, activeScenario, preference = 'fastest', departureTimeParam = null) {
  if (!origin || !destination) return null;

  let now = getSingaporeNow();
  if (departureTimeParam) {
    if (departureTimeParam instanceof Date) {
      now = departureTimeParam;
    } else if (typeof departureTimeParam === 'string' && departureTimeParam.includes(':')) {
      const parts = departureTimeParam.split(':');
      const d = new Date();
      d.setHours(parseInt(parts[0], 10), parseInt(parts[1], 10), 0, 0);
      now = d;
    }
  }

  // Normalize origin & destination if passed as string station IDs or custom objects
  let origObj = origin;
  if (typeof origin === 'string') {
    const stn = getStationById(origin);
    origObj = stn ? { ...stn, name: stn.name, shortName: stn.name } : { id: origin, name: origin, shortName: origin, lat: 1.3490, lng: 103.7496 };
  } else if (!origObj.lat && origObj.id) {
    const stn = getStationById(origObj.id);
    if (stn) origObj = { ...stn, ...origObj };
  }

  let destObj = destination;
  if (typeof destination === 'string') {
    const stn = getStationById(destination);
    destObj = stn ? { ...stn, name: stn.name, shortName: stn.name } : { id: destination, name: destination, shortName: destination, lat: 1.2830, lng: 103.8513 };
  } else if (!destObj.lat && destObj.id) {
    const stn = getStationById(destObj.id);
    if (stn) destObj = { ...stn, ...destObj };
  }

  // Normalize activeScenario if passed as string ID or object
  let scenarioObj = activeScenario;
  if (typeof activeScenario === 'string') {
    scenarioObj = SCENARIOS[activeScenario] || { id: activeScenario };
  }

  const isDisrupted =
    (scenarioObj?.id && DISRUPTION_CONFIGS[scenarioObj.id]) || scenarioObj?.trainServiceAlerts?.Status === 2;
  const isRaining = scenarioObj?.weather?.isRaining || preference === 'sheltered';
  const isAccessible = preference === 'accessible' || scenarioObj?.id === 'LIFT_MAINTENANCE_ACCESSIBLE';
  const isCrowdSurge = scenarioObj?.id === 'PCD_CROWD_SURGE_FORECAST';

  // Resolve nearest MRT stations
  const originStationObj = getNearestStation(origObj.lat, origObj.lng).station || getStationById('city_hall');
  const destStationObj =
    getStationById(destObj.nearestStationId) ||
    getNearestStation(destObj.lat, destObj.lng).station ||
    getStationById('raffles_place');

  const directDistKm = haversineDistKm(origObj.lat, origObj.lng, destObj.lat, destObj.lng);

  // Case 1: Direct walking distance (< 800m)
  if (directDistKm < 0.8) {
    // [WALKING ROUTE - START] (Comment out this block to revert to legacy walk)
    if (typeof calculateWalkingRoute === 'function' && typeof ENABLE_WALKING_ROUTES !== 'undefined' && ENABLE_WALKING_ROUTES) {
      const walkRoute = calculateWalkingRoute(origObj, destObj, now);
      if (walkRoute) {
        walkRoute.routes = [walkRoute];
        walkRoute.candidateRoutes = [walkRoute];
        return walkRoute;
      }
    }
    // [WALKING ROUTE - END]
    return buildDirectWalkingRoute(origObj, destObj, directDistKm, now);
  }

  // [WALKING ROUTE - START] (Comment out this block to disable walking priority)
  if (preference === 'walk' && typeof calculateWalkingRoute === 'function' && typeof ENABLE_WALKING_ROUTES !== 'undefined' && ENABLE_WALKING_ROUTES) {
    const walkPlan = calculateWalkingRoute(origObj, destObj, now, { force: true });
    if (walkPlan) {
      const transitRoutes = buildDynamicTransitRoute(
        origObj,
        destObj,
        originStationObj,
        destStationObj,
        scenarioObj,
        preference,
        now,
        isCrowdSurge,
        isAccessible
      );
      const allR = [walkPlan, ...(transitRoutes?.routes || []).filter(r => r.mode !== 'walk')];
      return {
        ...walkPlan,
        routes: allR,
        candidateRoutes: allR,
      };
    }
  }
  // [WALKING ROUTE - END]


  // Case 2.5: Bus Only Mode or Direct Bus Stop / Service Search
  if (preference === 'bus' || destObj.isBusStop || destObj.isBusService) {
    return buildBusRoutePlan(origObj, destObj, now, preference);
  }

  // Case 3: Sheltered routing under rain
  if (isRaining) {
    return buildShelteredRainPlan(
      origObj,
      destObj,
      originStationObj,
      destStationObj,
      scenarioObj,
      now
    );
  }

  // Case 4: General Dynamic Transit Routing
  return buildDynamicTransitRoute(
    origObj,
    destObj,
    originStationObj,
    destStationObj,
    scenarioObj,
    preference,
    now,
    isCrowdSurge,
    isAccessible
  );
}

/**
 * Direct Walking Route (< 800m) - Compact & Direct
 */
function buildDirectWalkingRoute(origin, destination, distKm, now) {
  const walkDistM = Math.max(80, Math.round(distKm * 1000));
  const walkMin = Math.max(2, Math.round(walkDistM / 75));
  const depTime = formatClockTime(now);
  const arrTime = formatClockTime(addMinutes(now, walkMin));
  const destName = toTitleCase(destination.shortName || destination.name);

  const leg = {
    id: 'leg_walk_direct',
    type: 'walk',
    title: `Go to ${destName}`,
    subtitle: `${walkDistM}m · Transit node / destination`,
    timeStart: depTime,
    timeEnd: arrTime,
    durationMin: walkMin,
    distanceM: walkDistM,
    isSheltered: true,
  };

  const polylineSegments = [
    {
      id: 'poly_direct_walk',
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4,
      coordinates: [
        [origin.lat, origin.lng],
        [destination.lat, destination.lng],
      ],
      tooltip: `Go to ${destName}`,
    },
  ];

  const walkRoute = {
    id: 'route_walk_direct',
    title: `Go to ${destName}`,
    badge: 'Transit Node',
    mode: 'walk',
    routeSummary: `Go to ${destName}`,
    transferCount: 0,
    isRerouted: false,
    originName: toTitleCase(origin.shortName || origin.name),
    destinationName: destName,
    totalDurationMin: walkMin,
    minDurationMin: Math.max(1, walkMin - 1),
    maxDurationMin: walkMin + 2,
    uncertaintyText: `${Math.max(1, walkMin - 1)} - ${walkMin + 2} min`,
    departureTime: depTime,
    arrivalTime: arrTime,
    delayDifferenceMin: 0,
    proactiveAction: null,
    proactiveReason: null,
    shelterCoverage: '88%',
    legs: [leg],
    polylineSegments,
  };
  walkRoute.routes = [walkRoute];
  return walkRoute;
}

export const DISRUPTION_CONFIGS = {
  NSL_UNPLANNED_FAULT: {
    lineId: 'NSL',
    name: 'NSL Signalling Fault',
    corridorName: 'Jurong East & Choa Chu Kang',
    stops: ['jurong_east', 'bukit_batok', 'bukit_gombak', 'choa_chu_kang'],
    disruptedHops: new Set([
      'jurong_east:bukit_batok', 'bukit_batok:jurong_east',
      'bukit_batok:bukit_gombak', 'bukit_gombak:bukit_batok',
      'bukit_gombak:choa_chu_kang', 'choa_chu_kang:bukit_gombak',
    ]),
    coords: {
      jurong_east: [1.3332, 103.7423],
      bukit_batok: [1.3490, 103.7496],
      bukit_gombak: [1.3586, 103.7519],
      choa_chu_kang: [1.3854, 103.7444],
    },
    hopTimes: {
      'jurong_east:bukit_batok': 6,
      'bukit_batok:jurong_east': 6,
      'bukit_batok:bukit_gombak': 4,
      'bukit_gombak:bukit_batok': 4,
      'bukit_gombak:choa_chu_kang': 7,
      'choa_chu_kang:bukit_gombak': 7,
    },
  },
  EWL_JURONG_QUEENSTOWN: {
    lineId: 'EWL',
    name: 'East-West Line Traction Power Fault',
    corridorName: 'Jurong East & Queenstown',
    stops: ['jurong_east', 'clementi', 'dover', 'buona_vista', 'commonwealth', 'queenstown'],
    disruptedHops: new Set([
      'jurong_east:clementi', 'clementi:jurong_east',
      'clementi:dover', 'dover:clementi',
      'dover:buona_vista', 'buona_vista:dover',
      'buona_vista:commonwealth', 'commonwealth:buona_vista',
      'commonwealth:queenstown', 'queenstown:commonwealth',
    ]),
    coords: {
      jurong_east: [1.3332, 103.7423],
      clementi: [1.3151, 103.7652],
      dover: [1.3114, 103.7786],
      buona_vista: [1.3073, 103.7900],
      commonwealth: [1.3024, 103.7983],
      queenstown: [1.2948, 103.8060],
    },
    hopTimes: {
      'jurong_east:clementi': 7,
      'clementi:jurong_east': 7,
      'clementi:dover': 4,
      'dover:clementi': 4,
      'dover:buona_vista': 4,
      'buona_vista:dover': 4,
      'buona_vista:commonwealth': 4,
      'commonwealth:buona_vista': 4,
      'commonwealth:queenstown': 4,
      'queenstown:commonwealth': 4,
    },
  },
  NEL_ENTIRE_LINE: {
    lineId: 'NEL',
    name: 'North East Line Power Tripping',
    corridorName: 'Entire North East Line',
    stops: [
      'harbourfront', 'outram_park', 'chinatown', 'clarke_quay', 'dhoby_ghaut',
      'little_india', 'farrer_park', 'boon_keng', 'potong_pasir', 'woodleigh',
      'serangoon', 'kovan', 'hougang', 'buangkok', 'sengkang', 'punggol'
    ],
    disruptedHops: new Set([
      'harbourfront:outram_park', 'outram_park:harbourfront',
      'outram_park:chinatown', 'chinatown:outram_park',
      'chinatown:clarke_quay', 'clarke_quay:chinatown',
      'clarke_quay:dhoby_ghaut', 'dhoby_ghaut:clarke_quay',
      'dhoby_ghaut:little_india', 'little_india:dhoby_ghaut',
      'little_india:farrer_park', 'farrer_park:little_india',
      'farrer_park:boon_keng', 'boon_keng:farrer_park',
      'boon_keng:potong_pasir', 'potong_pasir:boon_keng',
      'potong_pasir:woodleigh', 'woodleigh:potong_pasir',
      'woodleigh:serangoon', 'serangoon:woodleigh',
      'serangoon:kovan', 'kovan:serangoon',
      'kovan:hougang', 'hougang:kovan',
      'hougang:buangkok', 'buangkok:hougang',
      'buangkok:sengkang', 'sengkang:buangkok',
      'sengkang:punggol', 'punggol:sengkang',
    ]),
    coords: {
      harbourfront: [1.2653, 103.8224],
      outram_park: [1.2803, 103.8395],
      chinatown: [1.2846, 103.8433],
      clarke_quay: [1.2884, 103.8465],
      dhoby_ghaut: [1.2987, 103.8459],
      little_india: [1.3068, 103.8492],
      farrer_park: [1.3123, 103.8540],
      boon_keng: [1.3194, 103.8617],
      potong_pasir: [1.3313, 103.8691],
      woodleigh: [1.3392, 103.8708],
      serangoon: [1.3498, 103.8736],
      kovan: [1.3602, 103.8851],
      hougang: [1.3713, 103.8924],
      buangkok: [1.3829, 103.8931],
      sengkang: [1.3917, 103.8955],
      punggol: [1.4052, 103.9022],
    },
    hopTimes: {},
  },
  CCL_DHOBY_PROMENADE: {
    lineId: 'CCL',
    name: 'Circle Line Track Circuit Fault',
    corridorName: 'Dhoby Ghaut & Promenade',
    stops: ['dhoby_ghaut', 'bras_basah', 'esplanade', 'promenade'],
    disruptedHops: new Set([
      'dhoby_ghaut:bras_basah', 'bras_basah:dhoby_ghaut',
      'bras_basah:esplanade', 'esplanade:bras_basah',
      'esplanade:promenade', 'promenade:esplanade',
    ]),
    coords: {
      dhoby_ghaut: [1.2987, 103.8459],
      bras_basah: [1.2969, 103.8507],
      esplanade: [1.2935, 103.8554],
      promenade: [1.2932, 103.8604],
    },
    hopTimes: {
      'dhoby_ghaut:bras_basah': 3,
      'bras_basah:dhoby_ghaut': 3,
      'bras_basah:esplanade': 3,
      'esplanade:bras_basah': 3,
      'esplanade:promenade': 4,
      'promenade:esplanade': 4,
    },
  },
};

export const NSL_DISRUPTED_HOPS = DISRUPTION_CONFIGS.NSL_UNPLANNED_FAULT.disruptedHops;
export const NSL_SHUTTLE_STOPS = DISRUPTION_CONFIGS.NSL_UNPLANNED_FAULT.stops;
export const NSL_SHUTTLE_COORDS = DISRUPTION_CONFIGS.NSL_UNPLANNED_FAULT.coords;

export function getDisruptionConfig(activeScenarioId) {
  if (activeScenarioId && DISRUPTION_CONFIGS[activeScenarioId]) {
    return DISRUPTION_CONFIGS[activeScenarioId];
  }
  return null;
}

export function doesLegTraverseDisruption(leg, disruptionCfg) {
  if (!leg || leg.type !== 'mrt' || !disruptionCfg) return false;
  if (leg.lineId !== disruptionCfg.lineId) return false;

  const stopsData = getLineStops(disruptionCfg.lineId, leg.fromStationId, leg.toStationId);
  const stnIds = stopsData?.intermediateStations?.map(s => s.id) || [];
  for (let i = 0; i < stnIds.length - 1; i++) {
    const hop = `${stnIds[i]}:${stnIds[i + 1]}`;
    if (disruptionCfg.disruptedHops.has(hop)) return true;
  }
  return false;
}

export function doesOptionTraverseDisruption(opt, disruptionCfg) {
  if (!opt || !opt.legs || !disruptionCfg) return false;
  return opt.legs.some(l => doesLegTraverseDisruption(l, disruptionCfg));
}

export function doesLegTraverseNSLFault(leg) {
  return doesLegTraverseDisruption(leg, DISRUPTION_CONFIGS.NSL_UNPLANNED_FAULT);
}

export function doesOptionTraverseNSLFault(opt) {
  return doesOptionTraverseDisruption(opt, DISRUPTION_CONFIGS.NSL_UNPLANNED_FAULT);
}

export function getGenericShuttleDurationMin(fromId, toId, disruptionCfg) {
  const stops = disruptionCfg?.stops || [];
  const hopTimes = disruptionCfg?.hopTimes || {};
  const idx1 = stops.indexOf(fromId);
  const idx2 = stops.indexOf(toId);
  if (idx1 === -1 || idx2 === -1) return 15;
  const start = Math.min(idx1, idx2);
  const end = Math.max(idx1, idx2);
  let rideMin = 0;
  for (let i = start; i < end; i++) {
    const key = `${stops[i]}:${stops[i + 1]}`;
    rideMin += hopTimes[key] || 4.5;
  }
  return Math.max(5, Math.round(rideMin + 3));
}

export function getGenericShuttleStopsSlice(fromId, toId, disruptionCfg) {
  const stops = disruptionCfg?.stops || [];
  const idx1 = stops.indexOf(fromId);
  const idx2 = stops.indexOf(toId);
  if (idx1 === -1 || idx2 === -1) return [fromId, toId];
  if (idx1 <= idx2) {
    return stops.slice(idx1, idx2 + 1);
  } else {
    return stops.slice(idx2, idx1 + 1).reverse();
  }
}

export function getShuttleDurationMin(fromId, toId) {
  return getGenericShuttleDurationMin(fromId, toId, DISRUPTION_CONFIGS.NSL_UNPLANNED_FAULT);
}

export function getShuttleStopsSlice(fromId, toId) {
  return getGenericShuttleStopsSlice(fromId, toId, DISRUPTION_CONFIGS.NSL_UNPLANNED_FAULT);
}

/**
 * Builds a Free MRT Bridging Shuttle option by replacing the disrupted MRT segment
 * with an actual free shuttle bus leg between the affected stations.
 */
export function buildBridgingShuttleOption({
  id = 'route_shuttle_bridging',
  origin,
  destination,
  originStationObj,
  destStationObj,
  opt,
  now,
  isCrowdSurge,
  disruptionCfg = DISRUPTION_CONFIGS.NSL_UNPLANNED_FAULT,
}) {
  if (!opt || !opt.legs || !disruptionCfg) return null;

  const newSegments = [];
  let shuttleAdded = false;
  const lineId = disruptionCfg.lineId;

  opt.legs.forEach(segment => {
    if (segment.type === 'mrt' && segment.lineId === lineId && doesLegTraverseDisruption(segment, disruptionCfg)) {
      const stopsData = getLineStops(lineId, segment.fromStationId, segment.toStationId);
      const stnIds = stopsData?.intermediateStations?.map(s => s.id) || [segment.fromStationId, segment.toStationId];

      const faultIndices = [];
      stnIds.forEach((sId, idx) => {
        if (disruptionCfg.stops.includes(sId)) faultIndices.push(idx);
      });

      if (faultIndices.length >= 2) {
        const firstFaultIdx = faultIndices[0];
        const lastFaultIdx = faultIndices[faultIndices.length - 1];
        const entryStnId = stnIds[firstFaultIdx];
        const exitStnId = stnIds[lastFaultIdx];

        // 1. Pre-shuttle train leg if trip originated further before the fault
        if (firstFaultIdx > 0) {
          const preStnId = stnIds[0];
          newSegments.push({
            type: 'mrt',
            lineId,
            fromStationId: preStnId,
            toStationId: entryStnId,
            durationMin: Math.max(2, firstFaultIdx * 2.5),
          });
          newSegments.push({
            type: 'transfer',
            stationId: entryStnId,
            fromLine: lineId,
            toLine: 'Shuttle',
            instruction: `Transfer to Free ${lineId} Bridging Shuttle`,
            isCross: false,
            durationMin: 2,
          });
        }

        // 2. The Free MRT Bridging Shuttle Bus segment
        const shuttleStops = getGenericShuttleStopsSlice(entryStnId, exitStnId, disruptionCfg);
        const shuttleDuration = getGenericShuttleDurationMin(entryStnId, exitStnId, disruptionCfg);
        const shuttleCoords = shuttleStops.map(s => disruptionCfg.coords[s] || [1.34, 103.75]);
        const entryStn = getStationById(entryStnId);
        const exitStn = getStationById(exitStnId);

        newSegments.push({
          type: 'bus',
          serviceNumber: 'Shuttle',
          badge: 'Free Shuttle',
          title: `Free ${lineId} Shuttle Bus`,
          subtitle: `${entryStn?.name || entryStnId} ➔ ${exitStn?.name || exitStnId}`,
          fromName: entryStn?.name || entryStnId,
          toName: exitStn?.name || exitStnId,
          fromStationId: entryStnId,
          toStationId: exitStnId,
          durationMin: shuttleDuration,
          lineColor: '#DC2626',
          stops: shuttleStops.map(s => getStationById(s)?.name || s),
          coordinates: shuttleCoords,
          busDetails: {
            type: 'Free Bridging Shuttle',
            loadText: 'Free MRT Shuttle',
            freq: '3-5 min',
          },
        });
        shuttleAdded = true;

        // 3. Post-shuttle train leg if trip continues past the fault
        if (lastFaultIdx < stnIds.length - 1) {
          const postStnId = stnIds[stnIds.length - 1];
          newSegments.push({
            type: 'transfer',
            stationId: exitStnId,
            fromLine: 'Shuttle',
            toLine: lineId,
            instruction: `Transfer to ${lineId}`,
            isCross: false,
            durationMin: 2,
          });
          newSegments.push({
            type: 'mrt',
            lineId,
            fromStationId: exitStnId,
            toStationId: postStnId,
            durationMin: Math.max(2, (stnIds.length - 1 - lastFaultIdx) * 2.5),
          });
        }
      } else {
        newSegments.push(segment);
      }
    } else {
      if (shuttleAdded && segment.type === 'transfer' && segment.fromLine === lineId) {
        newSegments.push({
          ...segment,
          fromLine: 'Shuttle',
          instruction: segment.instruction ? segment.instruction.replace(lineId, 'Shuttle') : `Transfer to ${segment.toLine}`,
        });
      } else {
        newSegments.push(segment);
      }
    }
  });

  if (!shuttleAdded) return null;

  const route = assembleTransitDoorToDoorRoute({
    id,
    title: `Free ${lineId} Shuttle + Train`,
    badge: 'Free Shuttle',
    origin,
    destination,
    originStationObj,
    destStationObj,
    transitSegments: newSegments,
    now,
    isCrowdSurge,
  });

  if (route) {
    route.isRerouted = true;
    route.scenarioType = 'disrupted';
    route.proactiveAction = `Free ${lineId} Bridging Shuttle Active`;
    route.proactiveReason =
      `Trains suspended along ${disruptionCfg.corridorName}. Free bridging buses operating frequently.`;
    route.mitigationNotice = `Free MRT Shuttle active along ${disruptionCfg.corridorName}.`;
  }

  return route;
}

/**
 * Helper to find stations between two stations along a line
 */
export function getLineStops(lineId, stn1Id, stn2Id) {
  const lineOrder = LINE_STATION_ORDERS[lineId];
  if (!lineOrder) return null;

  const idx1 = lineOrder.indexOf(stn1Id);
  const idx2 = lineOrder.indexOf(stn2Id);
  if (idx1 === -1 || idx2 === -1) return null;

  const start = Math.min(idx1, idx2);
  const end = Math.max(idx1, idx2);
  const rawStops = lineOrder.slice(start, end + 1);
  const orderedStops = idx1 <= idx2 ? rawStops : rawStops.reverse();

  const stops = orderedStops.map(id => {
    const stn = getStationById(id);
    return stn ? stn.name : id;
  });

  const rawCoordinates = orderedStops.map(id => {
    const stn = getStationById(id);
    return stn ? [stn.lat, stn.lng] : [1.35, 103.8];
  });

  // Accurate real-life curvature: Catmull-Rom spline passing directly through all stations
  const coordinates = generateCurvedTransitPath(rawCoordinates, 5);

  // Detailed station metadata for interactive map rendering
  const intermediateStations = orderedStops.map((id, sIdx) => {
    const stn = getStationById(id);
    const code = stn ? getStationCodeForLine(stn, lineId) : '';
    const lineColor = CANONICAL_LINES[lineId]?.color || '#009645';
    return {
      id,
      name: stn ? stn.name : id,
      code,
      lat: stn ? stn.lat : 1.35,
      lng: stn ? stn.lng : 103.8,
      lineId,
      lineColor,
      isInterchange: stn ? (stn.lines && stn.lines.length > 1) : false,
      lines: stn ? stn.lines : [lineId],
      isBoarding: sIdx === 0,
      isAlighting: sIdx === orderedStops.length - 1,
    };
  });

  const terminus = idx1 <= idx2 ? lineOrder[lineOrder.length - 1] : lineOrder[0];
  const terminusStn = getStationById(terminus);
  const terminusCode = terminusStn ? getStationCodeForLine(terminusStn, lineId) : '';
  const directionText = terminusStn
    ? `towards ${terminusCode ? terminusCode + ' ' : ''}${terminusStn.name}`
    : '';

  return {
    lineId,
    stops,
    stopsCount: stops.length,
    coordinates,
    intermediateStations,
    directionText,
    terminusStn,
    terminusCode,
  };
}

// Real-world Singapore MRT interchange transfer walking profiles and navigation instructions
export const INTERCHANGE_TRANSFER_PROFILES = {
  // Cross-Platform Transfers (fast, same level or island platform)
  'city_hall:NSL:EWL': { walkMin: 1.0, isCross: true, instruction: 'Cross-platform transfer to opposite track' },
  'city_hall:EWL:NSL': { walkMin: 1.0, isCross: true, instruction: 'Cross-platform transfer to opposite track' },
  'raffles_place:NSL:EWL': { walkMin: 1.0, isCross: true, instruction: 'Cross-platform transfer to opposite track' },
  'raffles_place:EWL:NSL': { walkMin: 1.0, isCross: true, instruction: 'Cross-platform transfer to opposite track' },
  'jurong_east:NSL:EWL': { walkMin: 1.2, isCross: true, instruction: 'Cross-platform transfer to EWL island platform' },
  'jurong_east:EWL:NSL': { walkMin: 1.2, isCross: true, instruction: 'Cross-platform transfer to NSL island platform' },
  'bayfront:CEL:DTL': { walkMin: 1.0, isCross: true, instruction: 'Cross-platform transfer to Downtown Line' },
  'bayfront:DTL:CEL': { walkMin: 1.0, isCross: true, instruction: 'Cross-platform transfer to Circle Line' },
  'tanah_merah:EWL:CGL': { walkMin: 1.0, isCross: true, instruction: 'Cross-platform transfer to Changi Airport branch' },
  'tanah_merah:CGL:EWL': { walkMin: 1.0, isCross: true, instruction: 'Cross-platform transfer to East-West Line' },

  // Specific Concourse & Multi-Level Links
  'dhoby_ghaut:NSL:NEL': { walkMin: 4.5, isCross: false, instruction: 'Walk via North-East Line travelator linkway' },
  'dhoby_ghaut:NEL:NSL': { walkMin: 4.5, isCross: false, instruction: 'Walk via North-South Line travelator linkway' },
  'dhoby_ghaut:NSL:CCL': { walkMin: 3.5, isCross: false, instruction: 'Take escalator down to Circle Line concourse' },
  'dhoby_ghaut:CCL:NSL': { walkMin: 3.5, isCross: false, instruction: 'Take escalator up to North-South Line concourse' },
  'dhoby_ghaut:NEL:CCL': { walkMin: 2.5, isCross: false, instruction: 'Walk through Basement 2 interchange link' },
  'dhoby_ghaut:CCL:NEL': { walkMin: 2.5, isCross: false, instruction: 'Walk through Basement 2 interchange link' },

  'outram_park:EWL:NEL': { walkMin: 3.5, isCross: false, instruction: 'Take underpass linkway to North-East Line' },
  'outram_park:NEL:EWL': { walkMin: 3.5, isCross: false, instruction: 'Take underpass linkway to East-West Line' },
  'outram_park:EWL:TEL': { walkMin: 5.2, isCross: false, instruction: 'Walk through TEL underground pedestrian link (350m)' },
  'outram_park:TEL:EWL': { walkMin: 5.2, isCross: false, instruction: 'Walk through EWL underground pedestrian link (350m)' },
  'outram_park:NEL:TEL': { walkMin: 3.6, isCross: false, instruction: 'Walk via B3 concourse connector to TEL' },
  'outram_park:TEL:NEL': { walkMin: 3.6, isCross: false, instruction: 'Walk via B3 concourse connector to NEL' },

  'newton:NSL:DTL': { walkMin: 3.2, isCross: false, instruction: 'Walk through Newton 24-hr underground linkway' },
  'newton:DTL:NSL': { walkMin: 3.2, isCross: false, instruction: 'Walk through Newton 24-hr underground linkway' },

  'bugis:EWL:DTL': { walkMin: 3.2, isCross: false, instruction: 'Take escalator through Bugis underground link' },
  'bugis:DTL:EWL': { walkMin: 3.2, isCross: false, instruction: 'Take escalator through Bugis underground link' },

  'marina_bay:NSL:TEL': { walkMin: 3.8, isCross: false, instruction: 'Walk through TEL concourse connector' },
  'marina_bay:TEL:NSL': { walkMin: 3.8, isCross: false, instruction: 'Walk through NSL concourse connector' },
  'marina_bay:NSL:CEL': { walkMin: 3.0, isCross: false, instruction: 'Take escalator to Circle Line platform' },
  'marina_bay:CEL:NSL': { walkMin: 3.0, isCross: false, instruction: 'Take escalator to North-South Line platform' },

  'orchard:NSL:TEL': { walkMin: 3.5, isCross: false, instruction: 'Walk through Orchard ION / TEL concourse connector' },
  'orchard:TEL:NSL': { walkMin: 3.5, isCross: false, instruction: 'Walk through Orchard ION / TEL concourse connector' },

  'woodlands:NSL:TEL': { walkMin: 2.8, isCross: false, instruction: 'Walk through Causeway Point concourse connection' },
  'woodlands:TEL:NSL': { walkMin: 2.8, isCross: false, instruction: 'Walk through Causeway Point concourse connection' },

  'botanic_gardens:CCL:DTL': { walkMin: 2.5, isCross: false, instruction: 'Take escalator between CCL & DTL platforms' },
  'botanic_gardens:DTL:CCL': { walkMin: 2.5, isCross: false, instruction: 'Take escalator between CCL & DTL platforms' },

  'chinatown:NEL:DTL': { walkMin: 2.5, isCross: false, instruction: 'Walk through Pagoda Street concourse link' },
  'chinatown:DTL:NEL': { walkMin: 2.5, isCross: false, instruction: 'Walk through Pagoda Street concourse link' },

  'little_india:NEL:DTL': { walkMin: 2.8, isCross: false, instruction: 'Walk through Race Course Rd concourse link' },
  'little_india:DTL:NEL': { walkMin: 2.8, isCross: false, instruction: 'Walk through Race Course Rd concourse link' },

  'serangoon:NEL:CCL': { walkMin: 4.0, isCross: false, instruction: 'Walk through NEX 73m moving travelator linkway' },
  'serangoon:CCL:NEL': { walkMin: 4.0, isCross: false, instruction: 'Walk through NEX 73m moving travelator linkway' },

  'bishan:NSL:CCL': { walkMin: 2.8, isCross: false, instruction: 'Take underpass link between NSL & CCL platforms' },
  'bishan:CCL:NSL': { walkMin: 2.8, isCross: false, instruction: 'Take underpass link between NSL & CCL platforms' },

  'buona_vista:EWL:CCL': { walkMin: 3.5, isCross: false, instruction: 'Take escalator between elevated EWL and underground CCL' },
  'buona_vista:CCL:EWL': { walkMin: 3.5, isCross: false, instruction: 'Take escalator between underground CCL and elevated EWL' },

  'paya_lebar:EWL:CCL': { walkMin: 3.2, isCross: false, instruction: 'Take escalator between elevated EWL and underground CCL' },
  'paya_lebar:CCL:EWL': { walkMin: 3.2, isCross: false, instruction: 'Take escalator between underground CCL and elevated EWL' },

  'tampines:EWL:DTL': { walkMin: 4.2, isCross: false, instruction: 'Walk via Tampines Mall covered walkway link' },
  'tampines:DTL:EWL': { walkMin: 4.2, isCross: false, instruction: 'Walk via Tampines Mall covered walkway link' },

  'expo:DTL:CGL': { walkMin: 3.0, isCross: false, instruction: 'Take linkway between DTL and elevated CGL platform' },
  'expo:CGL:DTL': { walkMin: 3.0, isCross: false, instruction: 'Take linkway between elevated CGL and DTL platform' },

  'harbourfront:NEL:CCL': { walkMin: 3.2, isCross: false, instruction: 'Walk through VivoCity concourse transfer link' },
  'harbourfront:CCL:NEL': { walkMin: 3.2, isCross: false, instruction: 'Walk through VivoCity concourse transfer link' },

  'choa_chu_kang:NSL:BPL': { walkMin: 2.2, isCross: false, instruction: 'Take stairs/escalator to elevated LRT platform' },
  'choa_chu_kang:BPL:NSL': { walkMin: 2.2, isCross: false, instruction: 'Take stairs/escalator down to NSL platform' },

  'bukit_panjang:BPL:DTL': { walkMin: 3.0, isCross: false, instruction: 'Walk through Hillion Mall underpass link' },
  'bukit_panjang:DTL:BPL': { walkMin: 3.0, isCross: false, instruction: 'Walk through Hillion Mall underpass link' },

  'caldecott:CCL:TEL': { walkMin: 3.0, isCross: false, instruction: 'Take underpass link between CCL and TEL concourses' },
  'caldecott:TEL:CCL': { walkMin: 3.0, isCross: false, instruction: 'Take underpass link between TEL and CCL concourses' },

  'stevens:DTL:TEL': { walkMin: 2.8, isCross: false, instruction: 'Take escalator link between DTL and TEL platforms' },
  'stevens:TEL:DTL': { walkMin: 2.8, isCross: false, instruction: 'Take escalator link between TEL and DTL platforms' },

  'macpherson:CCL:DTL': { walkMin: 2.5, isCross: false, instruction: 'Walk through concourse connection between CCL and DTL' },
  'macpherson:DTL:CCL': { walkMin: 2.5, isCross: false, instruction: 'Walk through concourse connection between DTL and CCL' },
};

// Calculate real-time train headway in Singapore based on hour of day
export function getExpectedHeadwayMinutes(date = new Date()) {
  try {
    const hour = parseInt(
      date.toLocaleTimeString('en-SG', {
        timeZone: 'Asia/Singapore',
        hour: 'numeric',
        hour12: false,
      }),
      10
    );
    // Peak hours: 07:30 - 09:30, 17:30 - 19:30
    if ((hour >= 7 && hour < 10) || (hour >= 17 && hour < 20)) {
      return 2.0;
    }
    // Late night after 22:00 or early morning before 06:30
    if (hour >= 22 || hour < 7) {
      return 5.5;
    }
    // Standard daytime
    return 3.5;
  } catch (e) {
    return 3.0;
  }
}

// Cross-platform interchange pairs across Singapore MRT
const CROSS_PLATFORM_INTERCHANGES = new Set([
  'city_hall:NSL:EWL', 'city_hall:EWL:NSL',
  'raffles_place:NSL:EWL', 'raffles_place:EWL:NSL',
  'jurong_east:NSL:EWL', 'jurong_east:EWL:NSL',
  'bayfront:CEL:DTL', 'bayfront:DTL:CEL',
  'tanah_merah:EWL:CGL', 'tanah_merah:CGL:EWL',
]);

/**
 * A* Goal-Directed Graph Router across Singapore MRT
 * Uses admissible Euclidean/Haversine distance heuristic: h(n) = (distKm / 60) * 60
 * Incorporates real-world station-pair transfer matrices, headway wait times,
 * and generalized passenger friction penalties (~6.0 to 11.5 min) to prevent
 * unnatural multi-transfer detours and match commercial transit app recommendations.
 */
export function findAStarTransitPath(startStationId, endStationId, options = {}) {
  const {
    activeScenarioId = 'NORMAL_OPERATIONS',
    preference = 'fastest',
    bannedTransferStations = new Set(),
    avoidLines = new Set(),
    forceDirectLine = null,
    now = new Date(),
  } = options;

  if (!startStationId || !endStationId || startStationId === endStationId) return null;

  const startStn = getStationById(startStationId);
  const destStn = getStationById(endStationId);
  if (!startStn || !destStn) return null;

  const currentHeadway = getExpectedHeadwayMinutes(now);

  function addEdge(adj, u, v, realWeight, generalizedWeight, type, meta = {}) {
    if (!adj.has(u)) adj.set(u, []);
    adj.get(u).push({ to: v, realWeight, generalizedWeight, type, meta });
  }

  const openSet = [];
  const openSetIndex = new Map();

  function siftUp(index) {
    while (index > 0) {
      const parentIndex = Math.floor((index - 1) / 2);
      if (openSet[parentIndex].f <= openSet[index].f) break;
      [openSet[parentIndex], openSet[index]] = [openSet[index], openSet[parentIndex]];
      openSetIndex.set(openSet[parentIndex].node, parentIndex);
      openSetIndex.set(openSet[index].node, index);
      index = parentIndex;
    }
  }

  function siftDown(index) {
    while (true) {
      const left = index * 2 + 1;
      const right = left + 1;
      let smallest = index;

      if (left < openSet.length && openSet[left].f < openSet[smallest].f) smallest = left;
      if (right < openSet.length && openSet[right].f < openSet[smallest].f) smallest = right;
      if (smallest === index) break;

      [openSet[index], openSet[smallest]] = [openSet[smallest], openSet[index]];
      openSetIndex.set(openSet[index].node, index);
      openSetIndex.set(openSet[smallest].node, smallest);
      index = smallest;
    }
  }

  function pushOpenSet(node, priority) {
    const existingIndex = openSetIndex.get(node);
    if (existingIndex !== undefined) {
      if (openSet[existingIndex].f <= priority) return;
      openSet[existingIndex].f = priority;
      siftUp(existingIndex);
      return;
    }

    const item = { node, f: priority };
    openSet.push(item);
    openSetIndex.set(node, openSet.length - 1);
    siftUp(openSet.length - 1);
  }

  function popOpenSet() {
    if (openSet.length === 0) return null;

    const best = openSet[0];
    openSetIndex.delete(best.node);

    const last = openSet.pop();
    if (openSet.length === 0) return best;

    openSet[0] = last;
    openSetIndex.set(last.node, 0);
    siftDown(0);

    return best;
  }

  const adj = new Map();

  for (const [lineId, stations] of Object.entries(LINE_STATION_ORDERS)) {
    if (forceDirectLine && lineId !== forceDirectLine) continue;

    for (let i = 0; i < stations.length - 1; i++) {
      const u = stations[i];
      const v = stations[i + 1];

      const stnU = getStationById(u);
      const stnV = getStationById(v);
      const distKm = stnU && stnV ? haversineDistKm(stnU.lat, stnU.lng, stnV.lat, stnV.lng) : 1.5;

      const dwellMin = 0.67;
      const speedKmH = distKm > 3.0 ? 52 : distKm > 1.8 ? 40 : 32;
      const runMin = (distKm / speedKmH) * 60;
      let realWeight = Math.max(2.2, Math.round((dwellMin + runMin) * 10) / 10);
      let generalizedWeight = realWeight;

      const activeDisruptionCfg = getDisruptionConfig(activeScenarioId);
      if (activeDisruptionCfg && lineId === activeDisruptionCfg.lineId) {
        if (activeDisruptionCfg.disruptedHops.has(`${u}:${v}`) || activeDisruptionCfg.disruptedHops.has(`${v}:${u}`)) {
          generalizedWeight += 50;
          realWeight += 45;
        }
      }

      addEdge(adj, `${u}::${lineId}`, `${v}::${lineId}`, realWeight, generalizedWeight, 'transit', { lineId, from: u, to: v, distKm });
      addEdge(adj, `${v}::${lineId}`, `${u}::${lineId}`, realWeight, generalizedWeight, 'transit', { lineId, from: v, to: u, distKm });
    }
  }

  if (!forceDirectLine) {
    for (const stn of MRT_STATIONS) {
      const lines = stn.lines || [];
      if (lines.length <= 1) continue;

      for (let i = 0; i < lines.length; i++) {
        for (let j = i + 1; j < lines.length; j++) {
          const l1 = lines[i];
          const l2 = lines[j];

          if (!LINE_STATION_ORDERS[l1]?.includes(stn.id) || !LINE_STATION_ORDERS[l2]?.includes(stn.id)) {
            continue;
          }

          const pairKey1 = `${stn.id}:${l1}:${l2}`;
          const pairKey2 = `${stn.id}:${l2}:${l1}`;
          const profile = INTERCHANGE_TRANSFER_PROFILES[pairKey1] || INTERCHANGE_TRANSFER_PROFILES[pairKey2];

          const isCross = profile ? profile.isCross : CROSS_PLATFORM_INTERCHANGES.has(pairKey1);
          const walkMin = profile?.walkMin ?? (isCross ? 1.5 : 3.5);
          const waitMin = Math.round((isCross ? currentHeadway * 0.5 : currentHeadway * 0.75) * 10) / 10;
          const instruction = profile?.instruction || (isCross ? 'Cross-platform transfer to opposite track' : `Transfer to ${l2} platform`);

          let realWeight = Math.round((walkMin + waitMin) * 10) / 10;
          let generalizedWeight = Math.round((realWeight + (isCross ? 3.0 : 6.5)) * 10) / 10;

          if (preference === 'accessible') {
            realWeight += 2.0;
            generalizedWeight += 3.0;
          }

          addEdge(adj, `${stn.id}::${l1}`, `${stn.id}::${l2}`, realWeight, generalizedWeight, 'transfer', {
            stationId: stn.id,
            fromLine: l1,
            toLine: l2,
            isCross,
            walkMin,
            waitMin,
            instruction,
          });
          addEdge(adj, `${stn.id}::${l2}`, `${stn.id}::${l1}`, realWeight, generalizedWeight, 'transfer', {
            stationId: stn.id,
            fromLine: l2,
            toLine: l1,
            isCross,
            walkMin,
            waitMin,
            instruction,
          });
        }
      }
    }
  }

  function heuristic(node) {
    const [stnId] = node.split('::');
    const s = getStationById(stnId);
    if (!s) return 0;

    const distKm = haversineDistKm(s.lat, s.lng, destStn.lat, destStn.lng);
    const straightLineMin = (distKm / 60) * 60;
    return Math.max(1.5, straightLineMin);
  }

  const gScore = new Map();
  const realDuration = new Map();
  const previous = new Map();
  const closed = new Set();

  for (const l of startStn.lines || []) {
    if (forceDirectLine && l !== forceDirectLine) continue;
    if (LINE_STATION_ORDERS[l]?.includes(startStationId)) {
      const node = `${startStationId}::${l}`;
      gScore.set(node, 0);
      realDuration.set(node, 0);
      pushOpenSet(node, heuristic(node));
    }
  }

  let targetReachedNode = null;

  while (openSet.length > 0) {
    const entry = popOpenSet();
    if (!entry) break;
    const curr = entry.node;
    if (closed.has(curr)) continue;

    const [currStnId] = curr.split('::');
    if (currStnId === endStationId) {
      targetReachedNode = curr;
      break;
    }

    closed.add(curr);
    const currG = gScore.get(curr) ?? Infinity;
    const neighbors = adj.get(curr) || [];

    for (const edge of neighbors) {
      if (edge.type === 'transfer' && bannedTransferStations.has(edge.meta.stationId)) continue;
      if (closed.has(edge.to)) continue;

      let edgeCost = edge.generalizedWeight;
      if (edge.type === 'transit' && avoidLines.has(edge.meta.lineId)) edgeCost += 25;

      const tentativeG = currG + edgeCost;
      if (tentativeG < (gScore.get(edge.to) ?? Infinity)) {
        gScore.set(edge.to, tentativeG);
        realDuration.set(edge.to, (realDuration.get(curr) || 0) + edge.realWeight);
        previous.set(edge.to, { prevNode: curr, edge });
        pushOpenSet(edge.to, tentativeG + heuristic(edge.to));
      }
    }
  }

  if (!targetReachedNode) return null;

  const edges = [];
  let curr = targetReachedNode;
  while (previous.has(curr)) {
    const { prevNode, edge } = previous.get(curr);
    edges.unshift(edge);
    curr = prevNode;
  }

  const legs = [];
  let currentMrtLeg = null;
  let transferCount = 0;

  for (const edge of edges) {
    if (edge.type === 'transit') {
      const { lineId, from, to } = edge.meta;
      if (!currentMrtLeg || currentMrtLeg.lineId !== lineId) {
        if (currentMrtLeg) legs.push(currentMrtLeg);
        currentMrtLeg = {
          type: 'mrt',
          lineId,
          fromStationId: from,
          toStationId: to,
          stops: [from, to],
          durationMin: edge.realWeight,
        };
      } else {
        currentMrtLeg.toStationId = to;
        currentMrtLeg.stops.push(to);
        currentMrtLeg.durationMin += edge.realWeight;
      }
    } else if (edge.type === 'transfer') {
      transferCount++;
      if (currentMrtLeg) {
        legs.push(currentMrtLeg);
        currentMrtLeg = null;
      }
      legs.push({
        type: 'transfer',
        stationId: edge.meta.stationId,
        fromLine: edge.meta.fromLine,
        toLine: edge.meta.toLine,
        isCross: edge.meta.isCross,
        walkMin: edge.meta.walkMin,
        waitMin: edge.meta.waitMin,
        instruction: edge.meta.instruction,
        durationMin: edge.realWeight,
      });
    }
  }
  if (currentMrtLeg) legs.push(currentMrtLeg);

  return {
    legs,
    durationMin: Math.round((realDuration.get(targetReachedNode) || 0) * 10) / 10,
    transferCount,
    generalizedCost: Math.round((gScore.get(targetReachedNode) || 0) * 10) / 10,
  };
}

/**
 * Multi-route finder generating Primary and Alternative transit options
 */
export function findMultiRouteTransitPaths(startStationId, endStationId, options = {}) {
  const primary = findAStarTransitPath(startStationId, endStationId, options);
  if (!primary) return [];

  const routes = [
    {
      ...primary,
      id: 'route_primary',
      title: 'Recommended',
      badge: primary.transferCount === 0 ? 'Direct (0 Transfers)' : 'Fastest',
    },
  ];

  const startStn = getStationById(startStationId);
  const destStn = getStationById(endStationId);
  const sharedLines = (startStn?.lines || []).filter(l =>
    destStn?.lines?.includes(l) &&
    LINE_STATION_ORDERS[l]?.includes(startStationId) &&
    LINE_STATION_ORDERS[l]?.includes(endStationId)
  );

  // Check if a direct line exists that wasn't chosen as primary
  if (primary.transferCount > 0 && sharedLines.length > 0) {
    const directLine = sharedLines[0];
    const directPath = findAStarTransitPath(startStationId, endStationId, {
      ...options,
      forceDirectLine: directLine,
    });
    if (directPath && directPath.durationMin <= primary.durationMin * 1.5) {
      routes.push({
        ...directPath,
        id: 'route_direct',
        title: `Direct ${directLine}`,
        badge: '0 Transfers',
      });
    }
  }

  // If we only have 1 route so far and primary had transfers, try finding an alternative corridor
  if (routes.length < 2 && primary.transferCount > 0) {
    const transferStations = new Set(
      primary.legs.filter(l => l.type === 'transfer').map(l => l.stationId)
    );
    const altPath = findAStarTransitPath(startStationId, endStationId, {
      ...options,
      bannedTransferStations: transferStations,
    });
    if (altPath && altPath.durationMin <= primary.durationMin * 1.4) {
      const altLines = altPath.legs.filter(l => l.type === 'mrt').map(l => l.lineId).join(' ➔ ');
      routes.push({
        ...altPath,
        id: 'route_alt',
        title: `Via ${altLines}`,
        badge: 'Alternative',
      });
    }
  }

  return routes;
}

/**
 * Standard entrypoint returning optimal transit segments for backward compatibility
 */
export function findOptimalTransitPath(startStationId, endStationId, options = {}) {
  const result = findAStarTransitPath(startStationId, endStationId, options);
  return result?.legs || [];
}

/**
 * Sheltered Rain Plan (100% Covered Walkway & Underground)
 */
function buildShelteredRainPlan(
  origin,
  destination,
  originStationObj,
  destStationObj,
  scenario,
  now
) {
  let currentTime = new Date(now.getTime());
  const originName = toTitleCase(origin.shortName || origin.name);
  const destTitle = toTitleCase(destination.shortName || destination.name);

  const walk1Dist = Math.max(150, Math.round(haversineDistKm(origin.lat, origin.lng, originStationObj.lat, originStationObj.lng) * 1000));
  const walk1Min = Math.max(3, Math.round(walk1Dist / 75));
  const leg1Start = formatClockTime(currentTime);
  currentTime = addMinutes(currentTime, walk1Min);
  const leg1End = formatClockTime(currentTime);

  const legs = [
    {
      id: 'leg_1_sheltered_walk',
      type: 'walk',
      title: `Covered Walk to ${originStationObj.name} MRT`,
      subtitle: `${walk1Min} min · ${walk1Dist}m sheltered`,
      timeStart: leg1Start,
      timeEnd: leg1End,
      durationMin: walk1Min,
      distanceM: walk1Dist,
      isSheltered: true,
      tag: '100% Covered',
    },
  ];

  const polylineSegments = [
    {
      id: 'poly_walk_rain1',
      type: 'walk',
      color: '#00897B',
      dashArray: '4, 6',
      weight: 4,
      coordinates: [
        [origin.lat, origin.lng],
        [originStationObj.lat, originStationObj.lng],
      ],
      tooltip: 'Sheltered Walk',
    },
  ];

  let totalTransitMin = 0;
  const transitSegments = findOptimalTransitPath(originStationObj.id, destStationObj.id, {
    activeScenarioId: scenario?.id,
    preference: 'sheltered',
  });

  if (transitSegments && transitSegments.length > 0) {
    transitSegments.forEach((segment, idx) => {
      if (segment.type === 'mrt') {
        const lineObj = CANONICAL_LINES[segment.lineId] || CANONICAL_LINES.NSL;
        const fromStn = getStationById(segment.fromStationId);
        const toStn = getStationById(segment.toStationId);
        const stopsData = getLineStops(segment.lineId, segment.fromStationId, segment.toStationId);

        const tMin = Math.max(3, Math.round(segment.durationMin));
        totalTransitMin += tMin;

        const legStart = formatClockTime(currentTime);
        currentTime = addMinutes(currentTime, tMin);
        const legEnd = formatClockTime(currentTime);

        const fromCode = fromStn ? getStationCodeForLine(fromStn, segment.lineId) : '';
        const toCode = toStn ? getStationCodeForLine(toStn, segment.lineId) : '';
        const fromName = fromStn?.name || segment.fromStationId;
        const toName = toStn?.name || segment.toStationId;
        const fromDisplay = fromCode ? `${fromCode} ${fromName}` : fromName;
        const toDisplay = toCode ? `${toCode} ${toName}` : toName;
        const dirText = stopsData?.directionText || '';

        legs.push({
          id: `leg_rain_mrt_${idx}`,
          type: 'mrt',
          title: `${fromDisplay} -> ${toDisplay}`,
          subtitle: dirText,
          fromStation: fromName,
          fromStationCode: fromCode,
          toStation: toName,
          toStationCode: toCode,
          directionText: dirText,
          timeStart: legStart,
          timeEnd: legEnd,
          durationMin: tMin,
          lineId: segment.lineId,
          lineName: lineObj.name,
          lineColor: lineObj.color,
          crowdLevel: 'm',
          crowdBadge: 'Moderate Crowd',
          stops: stopsData?.stops || [fromName, toName],
        });

        if (stopsData?.coordinates && stopsData.coordinates.length > 0) {
          polylineSegments.push({
            id: `poly_rain_mrt_${idx}`,
            type: 'mrt',
            color: lineObj.color,
            weight: 6,
            coordinates: stopsData.coordinates,
            tooltip: `${lineObj.name}: ${tMin} min`,
          });
        }
      } else if (segment.type === 'transfer') {
        const transStn = getStationById(segment.stationId);
        const stnName = transStn?.name || segment.stationId;
        const nextLineObj = CANONICAL_LINES[segment.toLine] || { id: segment.toLine, name: segment.toLine };
        const transMin = Math.max(1, Math.round(segment.durationMin));
        totalTransitMin += transMin;

        const legTransStart = formatClockTime(currentTime);
        currentTime = addMinutes(currentTime, transMin);
        const legTransEnd = formatClockTime(currentTime);

        const crossText = segment.isCross ? ' (cross-platform)' : '';

        legs.push({
          id: `leg_rain_transfer_${idx}`,
          type: 'transfer',
          title: `Transfer at ${stnName}`,
          subtitle: `${transMin} min sheltered transfer${crossText} to ${nextLineObj.id}`,
          timeStart: legTransStart,
          timeEnd: legTransEnd,
          durationMin: transMin,
          isSheltered: true,
        });
      }
    });
  }

  const walk2Dist = Math.max(100, Math.round(haversineDistKm(destStationObj.lat, destStationObj.lng, destination.lat, destination.lng) * 1000));
  const walk2Min = Math.max(2, Math.round(walk2Dist / 75));
  const legLastStart = formatClockTime(currentTime);
  currentTime = addMinutes(currentTime, walk2Min);
  const legLastEnd = formatClockTime(currentTime);

  legs.push({
    id: 'leg_3_underground_exit',
    type: 'walk',
    title: `Underground Concourse to ${destTitle}`,
    subtitle: `${walk2Min} min · ${walk2Dist}m sheltered`,
    timeStart: legLastStart,
    timeEnd: legLastEnd,
    durationMin: walk2Min,
    distanceM: walk2Dist,
    isSheltered: true,
    tag: 'Dry Concourse',
  });

  polylineSegments.push({
    id: 'poly_walk_rain2',
    type: 'walk',
    color: '#00897B',
    dashArray: '4, 6',
    weight: 4,
    coordinates: [
      [destStationObj.lat, destStationObj.lng],
      [destination.lat, destination.lng],
    ],
    tooltip: 'Concourse Walk',
  });

  const totalMin = walk1Min + totalTransitMin + walk2Min;
  const proactiveAction = '100% Sheltered Route (+3 min)';
  const proactiveReason = 'Heavy downpour (45mm/hr). Routed via covered linkways and underpass concourses.';

  return {
    isRerouted: true,
    scenarioType: 'weather',
    originName,
    destinationName: destTitle,
    totalDurationMin: totalMin,
    minDurationMin: Math.max(3, totalMin - 2),
    maxDurationMin: totalMin + 3,
    uncertaintyText: `${Math.max(3, totalMin - 2)} - ${totalMin + 3} min`,
    departureTime: leg1Start,
    arrivalTime: legLastEnd,
    delayDifferenceMin: 3,
    proactiveAction,
    proactiveReason,
    shelterCoverage: '100%',
    legs,
    polylineSegments,
  };
}

/**
 * Bus Route Planner - Direct & Express Public Bus Journeys
 * Powered by full Singapore bus route database (602 services, 5,208 stops).
 */
export function buildBusRoutePlan(origin, destination, now, preference = 'bus') {
  let currentTime = new Date(now.getTime());
  const originName = toTitleCase(origin.shortName || origin.name);
  const destName = toTitleCase(destination.shortName || destination.name);

  // 1. Try finding direct bus options via the full Singapore bus network
  const directOptions = findDirectBusOptions(origin, destination, 4);

  if (directOptions && directOptions.length > 0) {
    const primary = directOptions[0];
    const departureTime = formatClockTime(currentTime);
    const arrTime = formatClockTime(addMinutes(currentTime, primary.totalDurationMin));

    const walk1Start = departureTime;
    const walk1End = formatClockTime(addMinutes(currentTime, primary.walkOriginMin));
    const busStart = formatClockTime(addMinutes(currentTime, primary.walkOriginMin + primary.waitMin));
    const busEnd = formatClockTime(addMinutes(currentTime, primary.walkOriginMin + primary.waitMin + primary.rideDurationMin));
    const walk2Start = busEnd;
    const walk2End = arrTime;

    const legs = [
      {
        id: 'leg_1_walk_bus_stop',
        type: 'walk',
        title: `Walk to ${primary.boardStop.name}`,
        subtitle: `${primary.walkOriginMin} min · ${primary.boardStop.distanceM}m`,
        timeStart: walk1Start,
        timeEnd: walk1End,
        durationMin: primary.walkOriginMin,
        distanceM: primary.boardStop.distanceM,
        isSheltered: true,
      },
      {
        id: `leg_2_bus_${primary.primaryServiceNo || primary.serviceNo}`,
        type: 'bus',
        title: primary.isMultiBus
          ? `Board any bus: ${primary.serviceNo}`
          : `Bus ${primary.serviceNo} (${primary.boardStop.name} -> ${primary.alightStop.name})`,
        subtitle: primary.isMultiBus
          ? `towards ${primary.destinationName} • ${primary.services.length} buses from this stop`
          : `towards ${primary.destinationName}`,
        fromStation: primary.boardStop.name,
        toStation: primary.alightStop.name,
        directionText: `towards ${primary.destinationName}`,
        timeStart: busStart,
        timeEnd: busEnd,
        durationMin: primary.rideDurationMin,
        lineColor: '#E91E63',
        serviceNumber: primary.serviceNo,
        services: primary.services || [primary.serviceNo],
        isMultiBus: primary.isMultiBus || false,
        badge: primary.badge || (primary.isExpress ? 'Express Bus' : 'Direct Bus'),
        busDetails: {
          load: 'SEA',
          loadText: 'Seats Available',
          feature: 'WAB',
          type: 'Double Decker',
          operator: primary.operator,
          freq: primary.isMultiBus ? `${primary.waitMin * 2} min combined` : primary.freq,
        },
        stops: primary.stopsList,
      },
      {
        id: 'leg_3_walk_from_bus',
        type: 'walk',
        title: `Walk to ${destName}`,
        subtitle: `${primary.walkDestMin} min · ${primary.alightStop.distanceM}m`,
        timeStart: walk2Start,
        timeEnd: walk2End,
        durationMin: primary.walkDestMin,
        distanceM: primary.alightStop.distanceM,
        isSheltered: true,
      },
    ];

    const polylineSegments = [
      {
        id: 'poly_walk_bus_1',
        type: 'walk',
        color: '#6366F1',
        dashArray: '5, 8',
        weight: 4,
        coordinates: [
          [origin.lat, origin.lng],
          [primary.boardStop.lat, primary.boardStop.lng],
        ],
        tooltip: `Walk to ${primary.boardStop.name}`,
      },
      {
        id: `poly_bus_${primary.primaryServiceNo || primary.serviceNo}`,
        type: 'bus',
        color: '#E91E63',
        weight: 6,
        coordinates: primary.coordinates && primary.coordinates.length > 1
          ? generateCurvedTransitPath(primary.coordinates, 3)
          : [
              [primary.boardStop.lat, primary.boardStop.lng],
              [primary.alightStop.lat, primary.alightStop.lng],
            ],
        tooltip: `Bus ${primary.serviceNo}: ${primary.rideDurationMin} min`,
      },
      {
        id: 'poly_walk_bus_2',
        type: 'walk',
        color: '#6366F1',
        dashArray: '5, 8',
        weight: 4,
        coordinates: [
          [primary.alightStop.lat, primary.alightStop.lng],
          [destination.lat, destination.lng],
        ],
        tooltip: `Walk to ${destName}`,
      },
    ];

    // Build multi-bus options carousel
    const routes = directOptions.map((opt, optIdx) => {
      const isFastest = optIdx === 0;
      return {
        id: `route_bus_${opt.primaryServiceNo || opt.serviceNo}`,
        title: opt.isMultiBus ? `Bus ${opt.serviceNo}` : `Bus ${opt.serviceNo}`,
        badge: opt.badge || (opt.isExpress ? 'Express Bus' : (isFastest ? 'Fastest Bus' : 'Direct Bus')),
        mode: 'bus',
        routeSummary: `Bus ${opt.serviceNo}`,
        services: opt.services || [opt.serviceNo],
        isMultiBus: opt.isMultiBus || false,
        totalDurationMin: opt.totalDurationMin,
        durationMin: opt.totalDurationMin,
        serviceNumber: opt.primaryServiceNo || opt.serviceNo,
        minDurationMin: Math.max(3, opt.totalDurationMin - 2),
        maxDurationMin: opt.totalDurationMin + 4,
        uncertaintyText: `${Math.max(3, opt.totalDurationMin - 2)} - ${opt.totalDurationMin + 4} min`,
        departureTime,
        arrivalTime: formatClockTime(addMinutes(currentTime, opt.totalDurationMin)),
        transferCount: 0,
        legs: [
          {
            id: `leg_1_walk_bus_${opt.primaryServiceNo || opt.serviceNo}`,
            type: 'walk',
            title: `Walk to ${opt.boardStop.name}`,
            subtitle: `${opt.walkOriginMin} min · ${opt.boardStop.distanceM}m`,
            durationMin: opt.walkOriginMin,
            distanceM: opt.boardStop.distanceM,
            isSheltered: true,
          },
          {
            id: `leg_2_bus_${opt.primaryServiceNo || opt.serviceNo}`,
            type: 'bus',
            title: opt.isMultiBus
              ? `Board any bus: ${opt.serviceNo}`
              : `Bus ${opt.serviceNo} (${opt.boardStop.name} -> ${opt.alightStop.name})`,
            subtitle: opt.isMultiBus
              ? `towards ${opt.destinationName} • ${opt.services.length} buses from this stop`
              : `towards ${opt.destinationName}`,
            fromStation: opt.boardStop.name,
            toStation: opt.alightStop.name,
            directionText: `towards ${opt.destinationName}`,
            durationMin: opt.rideDurationMin,
            lineColor: '#E91E63',
            serviceNumber: opt.serviceNo,
            services: opt.services || [opt.serviceNo],
            isMultiBus: opt.isMultiBus || false,
            badge: opt.badge || (opt.isExpress ? 'Express Bus' : 'Direct Bus'),
            busDetails: {
              load: 'SEA',
              loadText: 'Seats Available',
              feature: 'WAB',
              type: 'Double Decker',
              operator: opt.operator,
              freq: opt.isMultiBus ? `${opt.waitMin * 2} min combined` : opt.freq,
            },
            stops: opt.stopsList,
          },
          {
            id: `leg_3_walk_dest_${opt.primaryServiceNo || opt.serviceNo}`,
            type: 'walk',
            title: `Walk to ${destName}`,
            subtitle: `${opt.walkDestMin} min · ${opt.alightStop.distanceM}m`,
            durationMin: opt.walkDestMin,
            distanceM: opt.alightStop.distanceM,
            isSheltered: true,
          },
        ],
        polylineSegments: [
          {
            id: `poly_walk_1_${opt.primaryServiceNo || opt.serviceNo}`,
            type: 'walk',
            color: '#6366F1',
            dashArray: '5, 8',
            weight: 4,
            coordinates: [
              [origin.lat, origin.lng],
              [opt.boardStop.lat, opt.boardStop.lng],
            ],
            tooltip: `Walk to ${opt.boardStop.name}`,
          },
          {
            id: `poly_bus_${opt.primaryServiceNo || opt.serviceNo}`,
            type: 'bus',
            color: '#E91E63',
            weight: 6,
            coordinates: opt.coordinates && opt.coordinates.length > 1
              ? generateCurvedTransitPath(opt.coordinates, 3)
              : [
                  [opt.boardStop.lat, opt.boardStop.lng],
                  [opt.alightStop.lat, opt.alightStop.lng],
                ],
            tooltip: `Bus ${opt.serviceNo}: ${opt.rideDurationMin} min`,
          },
          {
            id: `poly_walk_2_${opt.primaryServiceNo || opt.serviceNo}`,
            type: 'walk',
            color: '#6366F1',
            dashArray: '5, 8',
            weight: 4,
            coordinates: [
              [opt.alightStop.lat, opt.alightStop.lng],
              [destination.lat, destination.lng],
            ],
            tooltip: `Walk to ${destName}`,
          },
        ],
      };
    });

    return {
      id: primary.id || 'route_bus_primary',
      title: primary.title || 'Direct Bus',
      badge: primary.badge || 'Direct Bus',
      routeSummary: primary.routeSummary || primary.title || 'Direct Bus',
      isMultiBus: primary.isMultiBus || false,
      services: primary.services || [],
      isRerouted: false,
      scenarioType: 'bus',
      mode: 'bus',
      originName,
      destinationName: destName,
      totalDurationMin: primary.totalDurationMin,
      durationMin: primary.totalDurationMin,
      serviceNumber: primary.serviceNumber || primary.services?.[0] || '',
      minDurationMin: Math.max(3, primary.totalDurationMin - 2),
      maxDurationMin: primary.totalDurationMin + 4,
      uncertaintyText: `${Math.max(3, primary.totalDurationMin - 2)} - ${primary.totalDurationMin + 4} min`,
      departureTime,
      arrivalTime: arrTime,
      delayDifferenceMin: 0,
      proactiveAction: null,
      proactiveReason: null,
      shelterCoverage: '78%',
      transferCount: 0,
      legs,
      polylineSegments,
      routes,
    };
  }

  // Fallback if no direct bus matches: use closest stops
  const nearestOriginStops = getNearestBusStops(origin.lat, origin.lng, 3);
  const originStop = nearestOriginStops[0] || BUS_STOPS[0];
  const nearestDestStops = getNearestBusStops(destination.lat, destination.lng, 3);
  const destStop = nearestDestStops[0] || BUS_STOPS[1];

  const directDist = haversineDistKm(originStop.lat, originStop.lng, destStop.lat, destStop.lng);
  const busMin = Math.max(8, Math.round((directDist / 24) * 60));
  const walk1Min = Math.max(2, Math.round(haversineDistKm(origin.lat, origin.lng, originStop.lat, originStop.lng) * 12));
  const walk2Min = Math.max(2, Math.round(haversineDistKm(destStop.lat, destStop.lng, destination.lat, destination.lng) * 12));
  const totalMin = walk1Min + 4 + busMin + walk2Min;

  const depTime = formatClockTime(currentTime);
  const arrTime = formatClockTime(addMinutes(currentTime, totalMin));

  return {
    isRerouted: false,
    scenarioType: 'bus',
    mode: 'bus',
    originName,
    destinationName: destName,
    totalDurationMin: totalMin,
    durationMin: totalMin,
    minDurationMin: Math.max(3, totalMin - 2),
    maxDurationMin: totalMin + 4,
    uncertaintyText: `${Math.max(3, totalMin - 2)} - ${totalMin + 4} min`,
    departureTime: depTime,
    arrivalTime: arrTime,
    delayDifferenceMin: 0,
    proactiveAction: null,
    proactiveReason: null,
    shelterCoverage: '78%',
    transferCount: 0,
    legs: [
      {
        id: 'leg_1_walk_bus_stop',
        type: 'walk',
        title: `Walk to ${originStop.name}`,
        subtitle: `${walk1Min} min`,
        durationMin: walk1Min,
        distanceM: Math.round(walk1Min * 75),
        isSheltered: true,
      },
      {
        id: 'leg_2_bus_generic',
        type: 'bus',
        title: `Bus Transit (${originStop.name} -> ${destStop.name})`,
        subtitle: `towards ${destStop.name}`,
        fromStation: originStop.name,
        toStation: destStop.name,
        directionText: `towards ${destStop.name}`,
        durationMin: busMin,
        lineColor: '#E91E63',
        serviceNumber: 'Direct',
        badge: 'Transit Bus',
        busDetails: {
          load: 'SEA',
          loadText: 'Seats Available',
          feature: 'WAB',
          type: 'Double Decker',
          operator: 'SBST',
          freq: '6 - 10 min',
        },
        stops: [originStop.name, 'Expressway Transit', destStop.name],
      },
      {
        id: 'leg_3_walk_from_bus',
        type: 'walk',
        title: `Walk to ${destName}`,
        subtitle: `${walk2Min} min`,
        durationMin: walk2Min,
        distanceM: Math.round(walk2Min * 75),
        isSheltered: true,
      },
    ],
    polylineSegments: [
      {
        id: 'poly_walk_bus_1',
        type: 'walk',
        color: '#6366F1',
        dashArray: '5, 8',
        weight: 4,
        coordinates: [
          [origin.lat, origin.lng],
          [originStop.lat, originStop.lng],
        ],
        tooltip: `Walk to ${originStop.name}`,
      },
      {
        id: 'poly_bus_generic',
        type: 'bus',
        color: '#E91E63',
        weight: 6,
        coordinates: [
          [originStop.lat, originStop.lng],
          [(originStop.lat + destStop.lat) / 2 + 0.003, (originStop.lng + destStop.lng) / 2],
          [destStop.lat, destStop.lng],
        ],
        tooltip: `Bus: ${busMin} min`,
      },
      {
        id: 'poly_walk_bus_2',
        type: 'walk',
        color: '#6366F1',
        dashArray: '5, 8',
        weight: 4,
        coordinates: [
          [destStop.lat, destStop.lng],
          [destination.lat, destination.lng],
        ],
        tooltip: `Walk to ${destName}`,
      },
    ],
  };
}

/**
 * General Dynamic Multi-Modal Transit Router - Compact & Direct
 */
function buildDynamicTransitRoute(
  origin,
  destination,
  originStationObj,
  destStationObj,
  scenario,
  preference,
  now,
  isCrowdSurge,
  isAccessible
) {
  let currentTime = new Date(now.getTime());
  const originName = toTitleCase(origin.shortName || origin.name);
  const destName = toTitleCase(destination.shortName || destination.name);

  // Leg 1: Walk from Origin to nearest station
  // Leg 1: Get from Origin to nearest MRT station (feeder bus if >1km)
  const walk1DistM = Math.max(120, Math.round(haversineDistKm(origin.lat, origin.lng, originStationObj.lat, originStationObj.lng) * 1000));
  let walk1Min = Math.max(2, Math.round(walk1DistM / 80));
  const feederBus = walk1DistM > 1000 ? findFeederBusToStation(origin, originStationObj) : null;
  const leg1Start = formatClockTime(currentTime);
  currentTime = addMinutes(currentTime, walk1Min);
  const leg1End = formatClockTime(currentTime);

  const legs = [];
  const polylineSegments = [];

  legs.push({
    id: 'leg_1_walk_origin',
    type: 'walk',
    title: `Walk to ${originStationObj.name}`,
    subtitle: `${walk1Min} min · ${walk1DistM}m`,
    timeStart: leg1Start,
    timeEnd: leg1End,
    durationMin: walk1Min,
    distanceM: walk1DistM,
    isSheltered: true,
  });
  if (feederBus) {
    // Walk to bus stop
    const walkToStopMin = feederBus.walkToStopMin;
    currentTime = addMinutes(currentTime, walkToStopMin);

  polylineSegments.push({
    id: 'poly_walk_1',
    type: 'walk',
    color: '#6366F1',
    dashArray: '5, 8',
    weight: 4,
    coordinates: [
      [origin.lat, origin.lng],
      [originStationObj.lat, originStationObj.lng],
    ],
    tooltip: `Walk to ${originStationObj.name}`,
  });
    legs.push({
      id: 'leg_1a_walk_to_stop',
      type: 'walk',
      title: `Walk to bus stop`,
      subtitle: `${feederBus.walkToStopM}m to ${feederBus.boardStop?.name || 'bus stop'}`,
      timeStart: leg1Start,
      timeEnd: formatClockTime(currentTime),
      durationMin: walkToStopMin,
      distanceM: feederBus.walkToStopM,
      isSheltered: false,
    });

    polylineSegments.push({
      id: 'poly_walk_to_stop',
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4,
      coordinates: [
        [origin.lat, origin.lng],
        [feederBus.boardStop?.lat || origin.lat, feederBus.boardStop?.lng || origin.lng],
      ],
      tooltip: `Walk to bus stop`,
    });

    // Wait + ride
    currentTime = addMinutes(currentTime, feederBus.waitMin);
    const busStart = formatClockTime(currentTime);
    currentTime = addMinutes(currentTime, feederBus.rideDurationMin);
    const busEnd = formatClockTime(currentTime);

    const svcLabel = feederBus.isMultiBus
      ? `Bus ${feederBus.services.slice(0, 2).join(', ')}`
      : `Bus ${feederBus.serviceNo}`;

    legs.push({
      id: 'leg_1b_feeder_bus',
      type: 'bus',
      serviceNumber: feederBus.serviceNo,
      badge: `Bus ${feederBus.serviceNo}`,
      title: `${svcLabel} to ${originStationObj.name}`,
      subtitle: `${feederBus.rideDurationMin} min · ${feederBus.stopsCount} stops`,
      timeStart: busStart,
      timeEnd: busEnd,
      durationMin: feederBus.rideDurationMin,
      lineColor: '#E91E63',
      busDetails: {
        type: 'Feeder Bus',
        loadText: svcLabel,
        freq: feederBus.isMultiBus ? '3-6 min' : '6-10 min',
      },
      stops: [feederBus.boardStop?.name || 'Bus Stop', originStationObj.name],
    });

    if (feederBus.coordinates && feederBus.coordinates.length > 0) {
      polylineSegments.push({
        id: 'poly_feeder_bus',
        type: 'bus',
        color: '#E91E63',
        weight: 5,
        coordinates: feederBus.coordinates,
        tooltip: `${svcLabel} to ${originStationObj.name}`,
      });
    }

    walk1Min = walkToStopMin + feederBus.waitMin + feederBus.rideDurationMin;
  } else {
    walk1Min = Math.max(2, Math.round(walk1DistM / 80));
    currentTime = addMinutes(currentTime, walk1Min);
    const leg1End = formatClockTime(currentTime);

    legs.push({
      id: 'leg_1_walk_origin',
      type: 'walk',
      title: `Walk to ${originStationObj.name}`,
      subtitle: `${walk1Min} min · ${walk1DistM}m`,
      timeStart: leg1Start,
      timeEnd: leg1End,
      durationMin: walk1Min,
      distanceM: walk1DistM,
      isSheltered: true,
    });

    polylineSegments.push({
      id: 'poly_walk_1',
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4,
      coordinates: [
        [origin.lat, origin.lng],
        [originStationObj.lat, originStationObj.lng],
      ],
      tooltip: `Walk to ${originStationObj.name}`,
    });
  }

  // Check if same station
  if (originStationObj.id === destStationObj.id) {
    const walk2DistM = Math.max(120, Math.round(haversineDistKm(destStationObj.lat, destStationObj.lng, destination.lat, destination.lng) * 1000));
    const walk2Min = Math.max(2, Math.round(walk2DistM / 80));
    const leg2Start = formatClockTime(currentTime);
    currentTime = addMinutes(currentTime, walk2Min);
    const leg2End = formatClockTime(currentTime);

    legs.push({
      id: 'leg_2_walk_dest',
      type: 'walk',
      title: `Walk to ${destName}`,
      subtitle: `${walk2Min} min · ${walk2DistM}m`,
      timeStart: leg2Start,
      timeEnd: leg2End,
      durationMin: walk2Min,
      distanceM: walk2DistM,
      isSheltered: true,
    });

    polylineSegments.push({
      id: 'poly_walk_dest',
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4,
      coordinates: [
        [destStationObj.lat, destStationObj.lng],
        [destination.lat, destination.lng],
      ],
      tooltip: `Walk to ${destName}`,
    });

    const totalMin = walk1Min + walk2Min;
    return {
      isRerouted: false,
      originName,
      destinationName: destName,
      totalDurationMin: totalMin,
      minDurationMin: totalMin - 1,
      maxDurationMin: totalMin + 2,
      uncertaintyText: `${totalMin - 1} - ${totalMin + 2} min`,
      departureTime: leg1Start,
      arrivalTime: leg2End,
      delayDifferenceMin: 0,
      proactiveAction: null,
      proactiveReason: null,
      shelterCoverage: '90%',
      legs,
      polylineSegments,
    };
  }

  // Find multi-route transit options using A* Algorithm
  const transitOptions = findMultiRouteTransitPaths(originStationObj.id, destStationObj.id, {
    activeScenarioId: scenario?.id,
    preference,
  });

  const candidateRoutes = [];

  const disruptionCfg = getDisruptionConfig(scenario?.id);
  const isDisrupted = !!disruptionCfg || scenario?.trainServiceAlerts?.Status === 2;

  const normalPaths = isDisrupted ? findMultiRouteTransitPaths(originStationObj.id, destStationObj.id) : [];
  const normalTraversesFault = isDisrupted && disruptionCfg && normalPaths.some(opt => doesOptionTraverseDisruption(opt, disruptionCfg));
  const isDirectFaultSector = isDisrupted && disruptionCfg && (
    disruptionCfg.stops.includes(originStationObj.id) || disruptionCfg.stops.includes(destStationObj.id)
  );
  const isJourneyAffectedByDisruption = isDisrupted && (normalTraversesFault || isDirectFaultSector);

  // 1. Build door-to-door objects for each MRT transit option
  transitOptions.forEach((opt, idx) => {
    const traversesFault = isDisrupted && disruptionCfg && doesOptionTraverseDisruption(opt, disruptionCfg);

    // If this option traverses the disrupted corridor, construct the Free Bridging Shuttle alternative
    if (traversesFault && disruptionCfg) {
      const shuttleRoute = buildBridgingShuttleOption({
        id: `route_shuttle_${idx}`,
        origin,
        destination,
        originStationObj,
        destStationObj,
        opt,
        now,
        isCrowdSurge,
        disruptionCfg,
      });
      if (shuttleRoute) {
        candidateRoutes.push(shuttleRoute);
      }
    }

    const isPrimary = idx === 0;
    const r = assembleTransitDoorToDoorRoute({
      id: opt.id || `route_mrt_${idx}`,
      title: traversesFault ? `Direct ${disruptionCfg?.lineId || 'MRT'} (Disrupted)` : (opt.title || (isPrimary ? 'Recommended' : 'Alternative')),
      badge: traversesFault ? 'Delayed (+40m)' : (opt.badge || (isPrimary ? 'Fastest' : 'Alternative')),
      origin,
      destination,
      originStationObj,
      destStationObj,
      transitSegments: opt.legs || [],
      now,
      isCrowdSurge,
    });

    if (r) {
      if (traversesFault) {
        r.isDisrupted = true;
        r.isRerouted = false;
        r.proactiveAction = `⚠️ ${disruptionCfg?.lineId || 'Rail'} Disrupted (+40 min delay)`;
        r.proactiveReason = `${disruptionCfg?.name || 'Disruption'}: trains delayed along ${disruptionCfg?.corridorName || 'affected corridor'}.`;
        r.mitigationNotice = `Severe delays on ${disruptionCfg?.lineId || 'MRT'}. Free Bridging Shuttle recommended.`;
      } else if (isJourneyAffectedByDisruption) {
        r.isRerouted = true;
        r.proactiveAction = 'Bypasses Disrupted Rail Corridor';
        r.proactiveReason = `Rerouted via ${r.routeSummary} to avoid the ${disruptionCfg?.lineId || 'MRT'} disruption along ${disruptionCfg?.corridorName || 'affected line'}.`;
        r.mitigationNotice = `${disruptionCfg?.lineId || 'MRT'} disruption bypassed via alternative network.`;
      }
      candidateRoutes.push(r);
    }
  });

  // 2. Discover direct bus options across the full Singapore bus network
  const directBusCandidates = findDirectBusOptions(origin, destination, 4);
  if (directBusCandidates && directBusCandidates.length > 0) {
    const busPlan = buildBusRoutePlan(origin, destination, now, 'bus');
    if (busPlan && busPlan.routes && busPlan.routes.length > 0) {
      busPlan.routes.forEach(br => {
        br.isRerouted = Boolean(isJourneyAffectedByDisruption);
        if (isJourneyAffectedByDisruption) {
          br.proactiveAction = `Direct Bus ${br.serviceNumber || ''} Alternative`;
          br.proactiveReason = 'Direct public bus service bypasses disrupted rail corridor.';
          br.mitigationNotice = 'Public bus operational.';
        }
        candidateRoutes.push(br);
      });
    }
  }

  // 2b. Check if a direct bus route from MAJOR_BUS_SERVICES connects this corridor
  const directBus = findDirectBusRouteCandidate(origin, destination, now);
  if (directBus) {
    directBus.isRerouted = Boolean(isJourneyAffectedByDisruption);
    if (isJourneyAffectedByDisruption) {
      directBus.proactiveAction = `Direct Bus ${directBus.serviceNumber || ''} Alternative`;
      directBus.proactiveReason = 'Direct public bus service bypasses disrupted rail corridor.';
      directBus.mitigationNotice = 'Public bus operational.';
    }
    candidateRoutes.push(directBus);
  }

  // [WALKING ROUTE - START] (Comment out this block to disable walking routes)
  if (typeof ENABLE_WALKING_ROUTES !== 'undefined' && ENABLE_WALKING_ROUTES && typeof calculateWalkingRoute === 'function') {
    const directDistKm = haversineDistKm(origin.lat, origin.lng, destination.lat, destination.lng);
    // Strictly prevent walks exceeding 1km (approx 0.8km direct Euclidean distance) unless preference is walk
    if (directDistKm <= 0.8 || preference === 'walk') {
      const walkCandidate = calculateWalkingRoute(origin, destination, now, { force: preference === 'walk' });
      if (walkCandidate) {
        candidateRoutes.push(walkCandidate);
      }
    }
  }
  // [WALKING ROUTE - END]

  // 3. Fallback if no routes found
  if (candidateRoutes.length === 0) {
    const dist = haversineDistKm(originStationObj.lat, originStationObj.lng, destStationObj.lat, destStationObj.lng);
    const estMin = Math.max(8, Math.round(dist * 2.0));
    const fallbackSegments = [
      {
        type: 'mrt',
        lineId: originStationObj.lines[0] || 'NSL',
        fromStationId: originStationObj.id,
        toStationId: destStationObj.id,
        durationMin: estMin,
      },
    ];
    candidateRoutes.push(
      assembleTransitDoorToDoorRoute({
        id: 'route_fallback',
        title: 'MRT Direct',
        badge: 'Estimated',
        origin,
        destination,
        originStationObj,
        destStationObj,
        transitSegments: fallbackSegments,
        now,
        isCrowdSurge,
      })
    );
  }

  // De-duplicate candidate routes
  const seen = new Set();
  const dedupedRoutes = [];
  for (const r of candidateRoutes) {
    if (!r) continue;
    const key = `${r.mode}_${r.routeSummary || r.title}_${r.totalDurationMin}`;
    if (!seen.has(key)) {
      seen.add(key);
      dedupedRoutes.push(r);
    }
  }

  // Sort candidate routes: non-delayed routes first by totalDurationMin, delayed routes last
  dedupedRoutes.sort((a, b) => {
    if (a.isDisrupted && !b.isDisrupted) return 1;
    if (!a.isDisrupted && b.isDisrupted) return -1;
    if (preference === 'walk') {
      if (a.mode === 'walk' && b.mode !== 'walk') return -1;
      if (a.mode !== 'walk' && b.mode === 'walk') return 1;
    }
    return a.totalDurationMin - b.totalDurationMin;
  });

  // Assign descriptive badges for the compact horizontal row
  dedupedRoutes.forEach((r, idx) => {
    if (r.isDisrupted) {
      r.badge = 'Delayed (+40m)';
    } else if (idx === 0) {
      r.badge = r.mode === 'walk' ? '★ Quick Walk' : '★ Fastest';
    } else if (r.badge === 'Free Shuttle' || r.id?.includes('shuttle')) {
      r.badge = 'Free Shuttle';
    } else if (r.mode === 'walk') {
      r.badge = 'Direct Walk';
    } else if (r.mode === 'bus') {
      r.badge = 'Direct Bus';
    } else if (r.transferCount === 0) {
      r.badge = 'Direct MRT';
    } else {
      r.badge = 'Alt MRT';
    }
  });

  if (isDisrupted) {
    const disruptedPoly = {
      id: 'poly_disrupted_track',
      type: 'disrupted',
      color: '#B71C1C',
      dashArray: '8, 8',
      weight: 5,
      coordinates: [
        [1.3332, 103.7423],
        [1.3490, 103.7496],
        [1.3586, 103.7519],
        [1.3854, 103.7444],
      ],
      tooltip: '⚠️ NSL Track Disrupted: Jurong East ↔ Choa Chu Kang',
    };

    dedupedRoutes.forEach(r => {
      if (r.polylineSegments && !r.polylineSegments.some(p => p.id === 'poly_disrupted_track')) {
        r.polylineSegments.push(disruptedPoly);
      }
    });
  }

  const primaryRoute = dedupedRoutes[0] || candidateRoutes[0];

  return {
    ...primaryRoute,
    routes: dedupedRoutes,
    candidateRoutes: dedupedRoutes,
  };
}

/**
 * Helper to build a complete door-to-door transit route from MRT segments
 */
function assembleTransitDoorToDoorRoute({
  id,
  title,
  badge,
  origin,
  destination,
  originStationObj,
  destStationObj,
  transitSegments,
  now,
  isCrowdSurge,
}) {
  const safeSegments = Array.isArray(transitSegments) ? transitSegments : [];
  let currentTime = new Date(now.getTime());
  const originName = toTitleCase(origin.shortName || origin.name);
  const destName = toTitleCase(destination.shortName || destination.name);

  const rawWalk1DistM = Math.max(80, Math.round(haversineDistKm(origin.lat, origin.lng, originStationObj.lat, originStationObj.lng) * 1000));
  const isWalk1Long = rawWalk1DistM > 950;
  const walk1DistM = isWalk1Long ? 900 : rawWalk1DistM;
  const walk1BaseMin = isWalk1Long ? 6 : Math.max(2, Math.round(walk1DistM / 75));
  const feederBusToStation = rawWalk1DistM > 1000 ? findFeederBusToStation(origin, originStationObj) : null;

  const legs = [];
  const polylineSegments = [];
  let walk1ActualMin = walk1BaseMin;
  let departureTimeStr = formatClockTime(currentTime);

  if (feederBusToStation) {
    const walkToStopStart = formatClockTime(currentTime);
    currentTime = addMinutes(currentTime, feederBusToStation.walkToStopMin);
    const walkToStopEnd = formatClockTime(currentTime);

    legs.push({
      id: `${id}_leg_1a_walk_to_stop`,
      type: 'walk',
      title: 'Walk to bus stop',
      subtitle: `${feederBusToStation.walkToStopM}m to ${feederBusToStation.boardStop?.name || 'bus stop'}`,
      timeStart: walkToStopStart,
      timeEnd: walkToStopEnd,
      durationMin: feederBusToStation.walkToStopMin,
      distanceM: feederBusToStation.walkToStopM,
      isSheltered: false,
    });

    polylineSegments.push({
      id: `${id}_poly_walk_to_stop`,
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4,
      coordinates: [
        [origin.lat, origin.lng],
        [feederBusToStation.boardStop?.lat || origin.lat, feederBusToStation.boardStop?.lng || origin.lng],
      ],
      tooltip: 'Walk to bus stop',
    });

    currentTime = addMinutes(currentTime, feederBusToStation.waitMin);
    const busRideStart = formatClockTime(currentTime);
    currentTime = addMinutes(currentTime, feederBusToStation.rideDurationMin);
    const busRideEnd = formatClockTime(currentTime);

    const svcLabel = feederBusToStation.isMultiBus
      ? `Bus ${feederBusToStation.services.slice(0, 2).join(', ')}`
      : `Bus ${feederBusToStation.serviceNo}`;

    legs.push({
      id: `${id}_leg_1b_feeder_bus`,
      type: 'bus',
      serviceNumber: feederBusToStation.serviceNo,
      badge: feederBusToStation.isMultiBus ? `${feederBusToStation.services.length} buses available` : `Bus ${feederBusToStation.serviceNo}`,
      title: `${svcLabel} to ${originStationObj.name}`,
      subtitle: `${feederBusToStation.rideDurationMin} min · ${feederBusToStation.stopsCount} stops`,
      timeStart: busRideStart,
      timeEnd: busRideEnd,
      durationMin: feederBusToStation.rideDurationMin,
      lineColor: '#E91E63',
      busDetails: {
        type: 'Feeder Bus',
        loadText: svcLabel,
        freq: feederBusToStation.isMultiBus ? '3-6 min' : '6-10 min',
      },
      stops: [feederBusToStation.boardStop?.name || 'Bus Stop', originStationObj.name],
    });

    if (feederBusToStation.coordinates && feederBusToStation.coordinates.length > 0) {
      polylineSegments.push({
        id: `${id}_poly_feeder_bus`,
        type: 'bus',
        color: '#E91E63',
        weight: 5,
        coordinates: feederBusToStation.coordinates,
        tooltip: `${svcLabel} to ${originStationObj.name}`,
      });
    }

    walk1ActualMin = feederBusToStation.walkToStopMin + feederBusToStation.waitMin + feederBusToStation.rideDurationMin;
  } else {
    const leg1Start = formatClockTime(currentTime);
    currentTime = addMinutes(currentTime, walk1BaseMin);
    const leg1End = formatClockTime(currentTime);

    legs.push({
      id: `${id}_leg_1_walk_origin`,
      type: 'walk',
      title: `Go to ${originStationObj.name}`,
      subtitle: isWalk1Long ? 'Transit link / feeder to station' : 'Transit node entrance',
      timeStart: leg1Start,
      timeEnd: leg1End,
      durationMin: walk1BaseMin,
      distanceM: walk1DistM,
      isSheltered: true,
    });

    const walk1Coords =
      typeof generatePedestrianPath === 'function' && typeof ENABLE_WALKING_ROUTES !== 'undefined' && ENABLE_WALKING_ROUTES
        ? generatePedestrianPath(origin, originStationObj)
        : [[origin.lat, origin.lng], [originStationObj.lat, originStationObj.lng]];

    polylineSegments.push({
      id: `${id}_poly_walk_1`,
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4,
      coordinates: walk1Coords,
      tooltip: `Go to ${originStationObj.name}`,
    });
  }

  const stationEntryWaitMin = 4;
  currentTime = addMinutes(currentTime, stationEntryWaitMin);

  let totalTransitMin = 0;
  let transferCount = 0;
  const intermediateStations = [];

  safeSegments.forEach((segment, idx) => {
    if (segment.type === 'mrt') {
      const lineObj = CANONICAL_LINES[segment.lineId] || CANONICAL_LINES.NSL;
      const fromStn = getStationById(segment.fromStationId);
      const toStn = getStationById(segment.toStationId);
      const stopsData = getLineStops(segment.lineId, segment.fromStationId, segment.toStationId);

      if (stopsData?.intermediateStations) {
        stopsData.intermediateStations.forEach(stn => {
          if (!intermediateStations.some(s => s.id === stn.id && s.lineId === stn.lineId)) {
            intermediateStations.push(stn);
          }
        });
      }

      const tMin = Math.max(2, Math.round(segment.durationMin));
      totalTransitMin += tMin;

      const legStart = formatClockTime(currentTime);
      currentTime = addMinutes(currentTime, tMin);
      const legEnd = formatClockTime(currentTime);

      const fromCode = fromStn ? getStationCodeForLine(fromStn, segment.lineId) : '';
      const toCode = toStn ? getStationCodeForLine(toStn, segment.lineId) : '';
      const fromName = fromStn?.name || segment.fromStationId;
      const toName = toStn?.name || segment.toStationId;
      const fromDisplay = fromCode ? `${fromCode} ${fromName}` : fromName;
      const toDisplay = toCode ? `${toCode} ${toName}` : toName;
      const dirText = stopsData?.directionText || '';

      legs.push({
        id: `${id}_leg_mrt_${idx}`,
        type: 'mrt',
        title: `${fromDisplay} -> ${toDisplay}`,
        subtitle: dirText,
        fromStation: fromName,
        fromStationCode: fromCode,
        toStation: toName,
        toStationCode: toCode,
        directionText: dirText,
        timeStart: legStart,
        timeEnd: legEnd,
        durationMin: tMin,
        lineId: segment.lineId,
        lineName: lineObj.name,
        lineColor: lineObj.color,
        crowdLevel: isCrowdSurge ? 'h' : 'l',
        crowdBadge: isCrowdSurge ? 'Crowded' : 'Seats Available',
        stops: stopsData?.stops || [fromName, toName],
      });

      if (stopsData?.coordinates && stopsData.coordinates.length > 0) {
        polylineSegments.push({
          id: `${id}_poly_mrt_${idx}`,
          type: 'mrt',
          color: lineObj.color,
          weight: 6,
          coordinates: stopsData.coordinates,
          tooltip: `${lineObj.name}: ${tMin} min`,
        });
      }
    } else if (segment.type === 'transfer') {
      transferCount++;
      const transStn = getStationById(segment.stationId);
      const stnName = transStn?.name || segment.stationId;
      const nextLineObj = CANONICAL_LINES[segment.toLine] || { id: segment.toLine, name: segment.toLine };
      const transMin = Math.max(1, Math.round(segment.durationMin));
      totalTransitMin += transMin;

      const legTransStart = formatClockTime(currentTime);
      currentTime = addMinutes(currentTime, transMin);
      const legTransEnd = formatClockTime(currentTime);

      const instructionText = segment.instruction || `${transMin} min transfer to ${nextLineObj.id}`;

      legs.push({
        id: `${id}_leg_transfer_${idx}`,
        type: 'transfer',
        title: `Transfer at ${stnName}`,
        subtitle: instructionText,
        instruction: instructionText,
        fromLine: segment.fromLine,
        toLine: segment.toLine,
        isCross: segment.isCross,
        walkMin: segment.walkMin || Math.round(transMin * 0.6),
        timeStart: legTransStart,
        timeEnd: legTransEnd,
        durationMin: transMin,
        isSheltered: true,
      });
    } else if (segment.type === 'bus' || segment.type === 'shuttle') {
      const bMin = Math.max(2, Math.round(segment.durationMin));
      totalTransitMin += bMin;

      const legStart = formatClockTime(currentTime);
      currentTime = addMinutes(currentTime, bMin);
      const legEnd = formatClockTime(currentTime);

      legs.push({
        id: `${id}_leg_shuttle_${idx}`,
        type: 'bus',
        serviceNumber: segment.serviceNumber || 'Shuttle',
        badge: segment.badge || 'Free Shuttle',
        title: segment.title || 'Free MRT Shuttle Bus',
        subtitle: segment.subtitle || `${segment.fromName} ➔ ${segment.toName}`,
        timeStart: legStart,
        timeEnd: legEnd,
        durationMin: bMin,
        lineColor: segment.lineColor || '#DC2626',
        busDetails: segment.busDetails || {
          type: 'Bridging Bus',
          loadText: 'Free Bridging Shuttle',
          freq: '3-5 min',
        },
        stops: segment.stops || [segment.fromName, segment.toName],
      });

      if (segment.coordinates && segment.coordinates.length > 0) {
        polylineSegments.push({
          id: `${id}_poly_shuttle_${idx}`,
          type: 'bus',
          color: segment.lineColor || '#DC2626',
          weight: 6,
          coordinates: segment.coordinates,
          tooltip: `${segment.title || 'Free Shuttle'}: ${bMin} min`,
        });
      }
    }
  });

  const stationExitMin = 2;
  currentTime = addMinutes(currentTime, stationExitMin);

  const rawWalk2DistM = Math.max(80, Math.round(haversineDistKm(destStationObj.lat, destStationObj.lng, destination.lat, destination.lng) * 1000));
  const isWalk2Long = rawWalk2DistM > 950;
  const walk2DistM = isWalk2Long ? 900 : rawWalk2DistM;
  const feederBusFromStation = rawWalk2DistM > 1000 ? findFeederBusFromStation(destStationObj, destination) : null;

  let walk2ActualMin = isWalk2Long ? 6 : Math.max(2, Math.round(walk2DistM / 75));
  let legLastEnd = formatClockTime(currentTime);

  if (feederBusFromStation) {
    const walkToStopStart = formatClockTime(currentTime);
    currentTime = addMinutes(currentTime, feederBusFromStation.walkToStopMin);
    const walkToStopEnd = formatClockTime(currentTime);

    legs.push({
      id: `${id}_leg_last_walk_to_stop`,
      type: 'walk',
      title: 'Walk to bus stop',
      subtitle: `${feederBusFromStation.walkToStopM}m from ${destStationObj.name}`,
      timeStart: walkToStopStart,
      timeEnd: walkToStopEnd,
      durationMin: feederBusFromStation.walkToStopMin,
      distanceM: feederBusFromStation.walkToStopM,
      isSheltered: false,
    });

    polylineSegments.push({
      id: `${id}_poly_walk_to_dest_stop`,
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4,
      coordinates: [
        [destStationObj.lat, destStationObj.lng],
        [feederBusFromStation.boardStop?.lat || destStationObj.lat, feederBusFromStation.boardStop?.lng || destStationObj.lng],
      ],
      tooltip: 'Walk to bus stop',
    });

    currentTime = addMinutes(currentTime, feederBusFromStation.waitMin);
    const busRideStart = formatClockTime(currentTime);
    currentTime = addMinutes(currentTime, feederBusFromStation.rideDurationMin);
    const busRideEnd = formatClockTime(currentTime);

    const svcLabel = feederBusFromStation.isMultiBus
      ? `Bus ${feederBusFromStation.services.slice(0, 2).join(', ')}`
      : `Bus ${feederBusFromStation.serviceNo}`;

    legs.push({
      id: `${id}_leg_last_feeder_bus`,
      type: 'bus',
      serviceNumber: feederBusFromStation.serviceNo,
      badge: `Bus ${feederBusFromStation.serviceNo}`,
      title: `${svcLabel} to ${destName}`,
      subtitle: `${feederBusFromStation.rideDurationMin} min · ${feederBusFromStation.stopsCount} stops`,
      timeStart: busRideStart,
      timeEnd: busRideEnd,
      durationMin: feederBusFromStation.rideDurationMin,
      lineColor: '#E91E63',
      busDetails: {
        type: 'Feeder Bus',
        loadText: svcLabel,
        freq: feederBusFromStation.isMultiBus ? '3-6 min' : '6-10 min',
      },
      stops: [destStationObj.name, feederBusFromStation.alightStop?.name || destName],
    });

    if (feederBusFromStation.coordinates && feederBusFromStation.coordinates.length > 0) {
      polylineSegments.push({
        id: `${id}_poly_feeder_bus_dest`,
        type: 'bus',
        color: '#E91E63',
        weight: 5,
        coordinates: feederBusFromStation.coordinates,
        tooltip: `${svcLabel} to ${destName}`,
      });
    }

    const finalWalkStart = formatClockTime(currentTime);
    currentTime = addMinutes(currentTime, feederBusFromStation.walkFromStopMin);
    legLastEnd = formatClockTime(currentTime);

    legs.push({
      id: `${id}_leg_final_walk`,
      type: 'walk',
      title: `Go to ${destName}`,
      subtitle: 'Destination',
      timeStart: finalWalkStart,
      timeEnd: legLastEnd,
      durationMin: feederBusFromStation.walkFromStopMin,
      distanceM: feederBusFromStation.walkFromStopM,
      isSheltered: false,
    });

    polylineSegments.push({
      id: `${id}_poly_walk_dest_final`,
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4,
      coordinates: [
        [feederBusFromStation.alightStop?.lat || destination.lat, feederBusFromStation.alightStop?.lng || destination.lng],
        [destination.lat, destination.lng],
      ],
      tooltip: `Go to ${destName}`,
    });

    walk2ActualMin = feederBusFromStation.walkToStopMin + feederBusFromStation.waitMin + feederBusFromStation.rideDurationMin + feederBusFromStation.walkFromStopMin;
  } else {
    const legLastStart = formatClockTime(currentTime);
    currentTime = addMinutes(currentTime, walk2ActualMin);
    legLastEnd = formatClockTime(currentTime);

    legs.push({
      id: `${id}_leg_final_walk`,
      type: 'walk',
      title: `Go to ${destName}`,
      subtitle: 'Destination',
      timeStart: legLastStart,
      timeEnd: legLastEnd,
      durationMin: walk2ActualMin,
      distanceM: walk2DistM,
      isSheltered: true,
    });

    const walk2Coords =
      typeof generatePedestrianPath === 'function' && typeof ENABLE_WALKING_ROUTES !== 'undefined' && ENABLE_WALKING_ROUTES
        ? generatePedestrianPath(destStationObj, destination)
        : [[destStationObj.lat, destStationObj.lng], [destination.lat, destination.lng]];

    polylineSegments.push({
      id: `${id}_poly_walk_dest`,
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4,
      coordinates: walk2Coords,
      tooltip: `Go to ${destName}`,
    });
  }

  const totalMin = walk1ActualMin + stationEntryWaitMin + totalTransitMin + stationExitMin + walk2ActualMin;
  const transitModesUsed = [];
  legs.forEach(l => {
    if (l.type === 'mrt' && !transitModesUsed.includes(l.lineId)) {
      transitModesUsed.push(l.lineId);
    } else if (l.type === 'bus' && !transitModesUsed.includes(l.serviceNumber || 'Bus')) {
      transitModesUsed.push(l.serviceNumber || 'Bus');
    }
  });

  return {
    id,
    title,
    badge,
    routeSummary: transitModesUsed.join(' ➔ '),
    mode: legs.some(l => l.type === 'mrt') ? 'mrt' : 'bus',
    isRerouted: false,
    originName,
    destinationName: destName,
    totalDurationMin: totalMin,
    durationMin: totalMin,
    minDurationMin: Math.max(3, totalMin - 2),
    maxDurationMin: totalMin + 3,
    uncertaintyText: `${Math.max(3, totalMin - 2)} - ${totalMin + 3} min`,
    departureTime: departureTimeStr,
    arrivalTime: legLastEnd,
    delayDifferenceMin: 0,
    proactiveAction: null,
    proactiveReason: null,
    shelterCoverage: '89%',
    transferCount,
    legs,
    polylineSegments,
    intermediateStations,
  };
}

/**
 * Checks if any high-frequency trunk or express bus route connects origin to destination area
 * Powered by full Singapore bus network dataset.
 */
function findDirectBusRouteCandidate(origin, destination, now) {
  // First, check the comprehensive bus routing service with ALL Singapore bus routes!
  const directBuses = findDirectBusOptions(origin, destination, 1);
  if (directBuses && directBuses.length > 0) {
    const busPlan = buildBusRoutePlan(origin, destination, now, 'bus');
    if (busPlan) {
      const b = directBuses[0];
      return {
        ...busPlan,
        id: `route_bus_${b.serviceNo}`,
        title: `Bus ${b.serviceNo}`,
        badge: b.isExpress ? 'Express Bus' : 'Direct Bus',
        mode: 'bus',
        routeSummary: `Bus ${b.serviceNo}`,
        transferCount: 0,
      };
    }
  }

  // Fallback to MAJOR_BUS_SERVICES if any
  for (const [svcNo, svc] of Object.entries(MAJOR_BUS_SERVICES)) {
    const stops = svc.direction1?.stops || [];
    let origStop = null;
    let destStop = null;
    let origIdx = -1;
    let destIdx = -1;

    for (let i = 0; i < stops.length; i++) {
      const bs = getBusStopByCode(stops[i].code);
      if (!bs) continue;
      const dOrig = haversineDistKm(origin.lat, origin.lng, bs.lat, bs.lng);
      const dDest = haversineDistKm(destination.lat, destination.lng, bs.lat, bs.lng);

      if (dOrig <= 1.2 && origIdx === -1) {
        origStop = bs;
        origIdx = i;
      }
      if (dDest <= 1.4 && origIdx !== -1 && i > origIdx) {
        destStop = bs;
        destIdx = i;
        break;
      }
    }

    if (origStop && destStop && destIdx > origIdx) {
      const busPlan = buildBusRoutePlan(origin, destination, now, 'bus');
      if (busPlan) {
        return {
          ...busPlan,
          id: `route_bus_${svcNo}`,
          title: `Bus ${svcNo}`,
          serviceNumber: String(svcNo),
          badge: svc.category?.includes('Express') ? 'Express Bus' : 'Direct Bus',
          mode: 'bus',
          routeSummary: `Bus ${svcNo}`,
          durationMin: busPlan.totalDurationMin,
          totalDurationMin: busPlan.totalDurationMin,
          transferCount: 0,
        };
      }
    }
  }
  return null;
}

