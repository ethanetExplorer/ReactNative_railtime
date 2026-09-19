// Comprehensive Singapore Bus Network & Routing Service
// Powered by live LTA DataMall datasets: 5,208 bus stops, 602 bus services, and 26,823 route stop sequences.

import allBusServices from '../data/allBusServices.js';
import allBusStops from '../data/allBusStops.js';
import allBusRoutes from '../data/allBusRoutes.js';
import busStopToServices from '../data/busStopToServices.js';

// Haversine distance in km
function haversineDistKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Get nearest bus stops to any Singapore coordinate
 */
export function getNearbyStopsFromNetwork(lat, lng, limit = 5, maxRadiusKm = 1.0) {
  const matches = [];
  for (const [code, s] of Object.entries(allBusStops)) {
    const dist = haversineDistKm(lat, lng, s.lat, s.lng);
    if (dist <= maxRadiusKm) {
      matches.push({
        code,
        name: s.name,
        road: s.road,
        lat: s.lat,
        lng: s.lng,
        distanceKm: Math.round(dist * 100) / 100,
        distanceM: Math.round(dist * 1000),
        services: busStopToServices[code] || [],
      });
    }
  }
  matches.sort((a, b) => a.distanceKm - b.distanceKm);
  return matches.slice(0, limit);
}

/**
 * Get bus stop by 5-digit code
 */
export function getBusStop(code) {
  if (!code) return null;
  const clean = String(code).trim();
  const s = allBusStops[clean];
  if (!s) return null;
  return {
    ...s,
    services: busStopToServices[clean] || [],
  };
}

/**
 * Get official bus service information (Category, Operator, Terminus, Frequencies)
 */
export function getBusServiceInfo(serviceNo) {
  if (!serviceNo) return null;
  const clean = String(serviceNo).trim();
  const s = allBusServices[clean];
  if (!s) return null;

  const destStop1 = s.direction1?.destinationCode ? allBusStops[s.direction1.destinationCode] : null;
  const origStop1 = s.direction1?.originCode ? allBusStops[s.direction1.originCode] : null;
  const destStop2 = s.direction2?.destinationCode ? allBusStops[s.direction2.destinationCode] : null;
  const origStop2 = s.direction2?.originCode ? allBusStops[s.direction2.originCode] : null;

  return {
    serviceNo: clean,
    operator: s.operator || 'SBST',
    category: s.category || 'TRUNK',
    loopDesc: s.loopDesc || null,
    direction1: {
      ...s.direction1,
      originName: origStop1?.name || origStop1?.road || 'Interchange',
      destinationName: destStop1?.name || destStop1?.road || (s.loopDesc ? `Loop at ${s.loopDesc}` : 'Terminus'),
      peakFreq: s.direction1?.amPeakFreq ? `${s.direction1.amPeakFreq} min` : '5 - 10 min',
      offpeakFreq: s.direction1?.amOffpeakFreq ? `${s.direction1.amOffpeakFreq} min` : '8 - 14 min',
    },
    direction2: s.direction2 ? {
      ...s.direction2,
      originName: origStop2?.name || origStop2?.road || 'Interchange',
      destinationName: destStop2?.name || destStop2?.road || 'Terminus',
      peakFreq: s.direction2?.amPeakFreq ? `${s.direction2.amPeakFreq} min` : '5 - 10 min',
      offpeakFreq: s.direction2?.amOffpeakFreq ? `${s.direction2.amOffpeakFreq} min` : '8 - 14 min',
    } : null,
  };
}

/**
 * Get official terminus name for any bus service
 */
export function getOfficialTerminus(serviceNo, direction = 1) {
  const info = getBusServiceInfo(serviceNo);
  if (!info) return 'In Service';
  if (direction === 2 && info.direction2) {
    return `towards ${info.direction2.destinationName}`;
  }
  if (info.direction1?.destinationName) {
    return `towards ${info.direction1.destinationName}`;
  }
  if (info.loopDesc) {
    return `looping at ${info.loopDesc}`;
  }
  return 'In Service';
}

/**
 * Find ALL direct bus connections between ANY origin and ANY destination across Singapore
 */
export function findDirectBusOptions(origin, destination, maxOptions = 3) {
  if (!origin || !destination) return [];

  // Find bus stops within walking distance of origin and destination (capped strictly to prevent walks > 1km)
  const originStops = getNearbyStopsFromNetwork(origin.lat, origin.lng, 6, 0.65);
  const destStops = getNearbyStopsFromNetwork(destination.lat, destination.lng, 6, 0.65);

  if (originStops.length === 0 || destStops.length === 0) return [];

  const originStopCodes = new Set(originStops.map(s => s.code));
  const destStopCodes = new Set(destStops.map(s => s.code));

  // Find candidate services serving both stop sets
  const candidateMatches = [];

  for (const [svcNo, directions] of Object.entries(allBusRoutes)) {
    for (const dirStr of ['1', '2']) {
      const seq = directions[dirStr];
      if (!seq || seq.length === 0) continue;

      let boardIdx = -1;
      let alightIdx = -1;
      let bestBoardStop = null;
      let bestAlightStop = null;

      for (let i = 0; i < seq.length; i++) {
        const stopCode = seq[i].stop;
        if (originStopCodes.has(stopCode) && boardIdx === -1) {
          boardIdx = i;
          bestBoardStop = originStops.find(s => s.code === stopCode);
        }
        if (destStopCodes.has(stopCode) && boardIdx !== -1 && i > boardIdx) {
          alightIdx = i;
          bestAlightStop = destStops.find(s => s.code === stopCode);
          break;
        }
      }

      if (boardIdx !== -1 && alightIdx !== -1 && alightIdx > boardIdx) {
        const intermediateStops = seq.slice(boardIdx, alightIdx + 1);
        const stopsCount = intermediateStops.length;
        const svcInfo = getBusServiceInfo(svcNo);
        const isExpress = svcInfo?.category?.includes('EXPRESS') || svcNo.endsWith('e') || svcNo.startsWith('50') || svcNo.startsWith('51');

        // Estimate distance and travel time based on stops & commercial average speed
        const distKm = intermediateStops.length > 1
          ? (intermediateStops[intermediateStops.length - 1].dist - intermediateStops[0].dist)
          : haversineDistKm(bestBoardStop.lat, bestBoardStop.lng, bestAlightStop.lat, bestAlightStop.lng);

        // Calibrated commercial bus speeds for Singapore (LTA operational data):
        // Trunk buses in Singapore urban/town traffic: ~17 km/h with traffic lights & passenger boarding
        // Express buses on expressways: ~32 km/h
        const avgSpeed = isExpress ? 32 : 17;
        const dwellTimeMin = Math.max(0, stopsCount - 1) * 0.55;
        const runningTimeMin = (distKm / avgSpeed) * 60;
        const rideDurationMin = Math.max(7, Math.round(runningTimeMin + dwellTimeMin));

        // Walking times to/from bus stops (~75 m/min)
        const walkOriginMin = Math.max(2, Math.round(bestBoardStop.distanceM / 75));
        const walkDestMin = Math.max(2, Math.round(bestAlightStop.distanceM / 75));

        // Realistic bus waiting time: average Singapore bus headway wait is ~5-7 min
        const waitMin = isExpress ? 7 : 5;
        const totalMin = walkOriginMin + waitMin + rideDurationMin + walkDestMin;

        // Build stop names array for route display
        const stopNamesList = intermediateStops.map(s => {
          const stp = allBusStops[s.stop];
          return stp?.name || `Stop ${s.stop}`;
        });

        // Build coordinates for polyline
        const coords = intermediateStops
          .map(s => {
            const stp = allBusStops[s.stop];
            return stp ? [stp.lat, stp.lng] : null;
          })
          .filter(Boolean);

        candidateMatches.push({
          serviceNo: svcNo,
          direction: parseInt(dirStr, 10),
          category: svcInfo?.category || (isExpress ? 'EXPRESS' : 'TRUNK'),
          operator: svcInfo?.operator || 'SBST',
          isExpress,
          boardStop: bestBoardStop,
          alightStop: bestAlightStop,
          stopsCount,
          rideDurationMin,
          totalDurationMin: totalMin,
          walkOriginMin,
          walkDestMin,
          waitMin,
          distKm: Math.round(distKm * 10) / 10,
          stopsList: stopNamesList,
          coordinates: coords,
          freq: svcInfo?.direction1?.peakFreq || '6 - 10 min',
          destinationName: svcInfo?.direction1?.destinationName || bestAlightStop.name,
        });
      }
    }
  }

  // Group direct bus options that share the same boarding stop and alighting stop into a single multi-bus journey
  const groupedByCorridor = new Map();

  for (const match of candidateMatches) {
    // Cluster key by boarding stop code and alighting stop code
    const key = `${match.boardStop.code}->${match.alightStop.code}`;
    if (!groupedByCorridor.has(key)) {
      groupedByCorridor.set(key, {
        ...match,
        services: [match.serviceNo],
        serviceList: [match],
      });
    } else {
      const existing = groupedByCorridor.get(key);
      if (!existing.services.includes(match.serviceNo)) {
        existing.services.push(match.serviceNo);
        existing.serviceList.push(match);
        if (match.isExpress) existing.isExpress = true;
        if (match.rideDurationMin < existing.rideDurationMin) {
          existing.rideDurationMin = match.rideDurationMin;
          existing.stopsCount = match.stopsCount;
          existing.stopsList = match.stopsList;
          existing.coordinates = match.coordinates;
        }
      }
    }
  }

  // Finalize aggregated corridor journeys
  const finalCorridors = Array.from(groupedByCorridor.values()).map(corridor => {
    const svcCount = corridor.services.length;
    // Format combined serviceNo: e.g. "67, 31"
    const serviceNoStr = corridor.services.slice(0, 4).join(', ') + (corridor.services.length > 4 ? '...' : '');

    // Combined wait time is substantially shorter with multiple available buses
    const reducedWaitMin = svcCount > 1 ? Math.max(2, Math.round(corridor.waitMin / Math.sqrt(svcCount))) : corridor.waitMin;
    const totalMin = corridor.walkOriginMin + reducedWaitMin + corridor.rideDurationMin + corridor.walkDestMin;

    return {
      ...corridor,
      serviceNo: serviceNoStr,
      primaryServiceNo: corridor.services[0],
      services: corridor.services,
      isMultiBus: svcCount > 1,
      waitMin: reducedWaitMin,
      totalDurationMin: totalMin,
      title: svcCount > 1 ? `Bus ${serviceNoStr}` : `Bus ${corridor.services[0]}`,
      badge: corridor.isExpress
        ? 'Express Bus'
        : (svcCount > 1 ? `${svcCount} Buses Available` : 'Direct Bus'),
    };
  });

  // Sort corridors by total duration
  finalCorridors.sort((a, b) => {
    if (a.isExpress && !b.isExpress && a.totalDurationMin <= b.totalDurationMin + 5) return -1;
    if (!a.isExpress && b.isExpress && b.totalDurationMin <= a.totalDurationMin + 5) return 1;
    return a.totalDurationMin - b.totalDurationMin;
  });

  return finalCorridors.slice(0, maxOptions);
}
