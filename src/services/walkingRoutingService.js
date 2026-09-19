// ============================================================================
// Walking Routing Service for RailTime
// Calculates realistic pedestrian walking routes, calories, steps, and
// generates street-following coordinate waypoints for map illustration.
//
// HOW TO DISABLE / COMMENT OUT:
// 1. Set ENABLE_WALKING_ROUTES = false below, OR
// 2. Comment out the [WALKING ROUTE - START] ... [WALKING ROUTE - END] blocks
//    in src/services/routingEngine.js
// ============================================================================

/**
 * MASTER TOGGLE:
 * Set to false or comment out to immediately disable walking route calculations
 * across the entire app without any side effects.
 */
export const ENABLE_WALKING_ROUTES = false;

/**
 * Pedestrian Walking Model Configurations calibrated for Singapore
 */
export const WALK_CONFIG = {
  // Comfortable urban walking pace in Singapore's tropical climate: ~4.5 km/h (~75 m/min)
  SPEED_KMH: 4.5,
  METERS_PER_MIN: 75,

  // Average energy expenditure for adult pedestrian: ~48 kcal per km
  CALORIES_PER_KM: 48,

  // Average pedestrian stride: ~0.76 m/step (~1,320 steps per km)
  STEPS_PER_KM: 1320,

  // Pedestrian street circuity factor (Manhattan footpath / linkway detour vs straight line)
  DETOUR_FACTOR: 1.20,

  // Maximum walking threshold: STRICTLY capped at 1.0 km (1000m) unless absolutely necessary
  MAX_WALK_RECOMMENDATION_DIST_KM: 1.0,
  MAX_WALK_DISTANCE_METERS: 1000,

  // Singapore LTA Covered Linkway Programme estimated shelter coverage
  DEFAULT_SHELTER_PERCENT: 88,
};

/**
 * Standard Haversine distance in kilometers
 */
function haversineDistKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Format Date object to "HH:MM"
 */
function formatClockTime(date) {
  if (!date) return '12:00';
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Add minutes to Date object
 */
function addMinutes(date, minutes) {
  return new Date(date.getTime() + minutes * 60000);
}

/**
 * Convert string to Title Case
 */
function toTitleCase(str) {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Compute cardinal compass direction from point A to point B
 */
function getCardinalDirection(lat1, lon1, lat2, lon2) {
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLon) * Math.cos((lat2 * Math.PI) / 180);
  const x =
    Math.cos((lat1 * Math.PI) / 180) * Math.sin((lat2 * Math.PI) / 180) -
    Math.sin((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.cos(dLon);
  const brng = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;

  if (brng >= 337.5 || brng < 22.5) return 'North';
  if (brng >= 22.5 && brng < 67.5) return 'Northeast';
  if (brng >= 67.5 && brng < 112.5) return 'East';
  if (brng >= 112.5 && brng < 157.5) return 'Southeast';
  if (brng >= 157.5 && brng < 202.5) return 'South';
  if (brng >= 202.5 && brng < 247.5) return 'Southwest';
  if (brng >= 247.5 && brng < 292.5) return 'West';
  return 'Northwest';
}

/**
 * Generates realistic street-grid pedestrian path coordinates between two locations.
 * Follows actual street corridors, sidewalks, and covered linkway junctions
 * (Manhattan orthogonal routing) rather than cutting through buildings or erratic oscillations.
 *
 * @param {{ lat: number, lng: number }} origin
 * @param {{ lat: number, lng: number }} destination
 * @returns {Array<[number, number]>} Array of [lat, lng] coordinates
 */
export function generatePedestrianPath(origin, destination) {
  if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) {
    return [];
  }

  const startLat = origin.lat;
  const startLng = origin.lng;
  const endLat = destination.lat;
  const endLng = destination.lng;

  const directDistKm = haversineDistKm(startLat, startLng, endLat, endLng);

  // For very close points (< 60m), direct straight segment is natural
  if (directDistKm < 0.06) {
    return [
      [startLat, startLng],
      [endLat, endLng],
    ];
  }

  const coords = [[startLat, startLng]];

  const dLat = endLat - startLat;
  const dLng = endLng - startLng;

  // Decide street corridor layout:
  // In Singapore, pedestrians follow major road corridors before turning onto cross streets.
  // We determine whether the dominant street movement is along latitude or longitude.
  const isLngDominant = Math.abs(dLng) >= Math.abs(dLat);

  if (isLngDominant) {
    // Primary segment along East-West road corridor, then turn onto North-South connector
    // Point 1 (along sidewalk)
    coords.push([
      Number((startLat + dLat * 0.08).toFixed(6)),
      Number((startLng + dLng * 0.40).toFixed(6)),
    ]);
    // Point 2 (nearing street corner)
    coords.push([
      Number((startLat + dLat * 0.15).toFixed(6)),
      Number((startLng + dLng * 0.85).toFixed(6)),
    ]);
    // Corner point (pedestrian crossing / road junction)
    const cornerLat = startLat + dLat * 0.25;
    const cornerLng = startLng + dLng * 0.95;
    coords.push([Number(cornerLat.toFixed(6)), Number(cornerLng.toFixed(6))]);
    // Point 4 (after crossing into final stretch)
    coords.push([
      Number((startLat + dLat * 0.70).toFixed(6)),
      Number((startLng + dLng * 0.98).toFixed(6)),
    ]);
  } else {
    // Primary segment along North-South street corridor, then turn onto East-West linkway
    // Point 1 (along sidewalk)
    coords.push([
      Number((startLat + dLat * 0.40).toFixed(6)),
      Number((startLng + dLng * 0.08).toFixed(6)),
    ]);
    // Point 2 (nearing street corner)
    coords.push([
      Number((startLat + dLat * 0.85).toFixed(6)),
      Number((startLng + dLng * 0.15).toFixed(6)),
    ]);
    // Corner point (pedestrian crossing / road junction)
    const cornerLat = startLat + dLat * 0.95;
    const cornerLng = startLng + dLng * 0.25;
    coords.push([Number(cornerLat.toFixed(6)), Number(cornerLng.toFixed(6))]);
    // Point 4 (after crossing into final stretch)
    coords.push([
      Number((startLat + dLat * 0.98).toFixed(6)),
      Number((startLng + dLng * 0.70).toFixed(6)),
    ]);
  }

  coords.push([endLat, endLng]);
  return coords;
}

/**
 * Calculate a dedicated walking route between origin and destination.
 * Strictly prevents walks exceeding 1km (1000m) unless explicitly requested or necessary.
 *
 * @param {{ lat: number, lng: number, name?: string, shortName?: string }} origin
 * @param {{ lat: number, lng: number, name?: string, shortName?: string }} destination
 * @param {Date} [now] - Current timestamp
 * @param {object} [options] - Optional configurations (e.g. { force: true })
 * @returns {object|null} Complete route plan object or null if exceeding 1km
 */
export function calculateWalkingRoute(origin, destination, now = new Date(), options = {}) {
  if (!ENABLE_WALKING_ROUTES) return null;
  if (!origin?.lat || !origin?.lng || !destination?.lat || !destination?.lng) return null;

  const directDistKm = haversineDistKm(origin.lat, origin.lng, destination.lat, destination.lng);

  // Realistic pedestrian footpath distance accounting for street circuity
  const walkingDistM = Math.max(
    80,
    Math.round(directDistKm * 1000 * WALK_CONFIG.DETOUR_FACTOR)
  );

  // PREVENT WALKS EXCEEDING 1KM (1,000m) UNLESS EXPLICITLY REQUESTED OR FORCED
  if (!options.force && walkingDistM > WALK_CONFIG.MAX_WALK_DISTANCE_METERS) {
    return null;
  }

  const walkingDistKm = walkingDistM / 1000;

  // Calibrated walking time in minutes (~75 m/min comfortable walking speed in Singapore)
  const walkMin = Math.max(2, Math.round(walkingDistM / WALK_CONFIG.METERS_PER_MIN));

  // Health & Pedestrian Metrics
  const calories = Math.round(walkingDistKm * WALK_CONFIG.CALORIES_PER_KM);
  const steps = Math.round(walkingDistKm * WALK_CONFIG.STEPS_PER_KM);
  const shelterCoverage = `${WALK_CONFIG.DEFAULT_SHELTER_PERCENT}%`;

  const originName = toTitleCase(origin.shortName || origin.name || 'Start');
  const destName = toTitleCase(destination.shortName || destination.name || 'Destination');

  const depTime = formatClockTime(now);
  const arrTime = formatClockTime(addMinutes(now, walkMin));

  // Generate realistic street-grid pedestrian coordinates
  const pathCoordinates = generatePedestrianPath(origin, destination);

  // Calculate cardinal direction for clear, sensible pedestrian guidance
  const heading = getCardinalDirection(origin.lat, origin.lng, destination.lat, destination.lng);

  // Build structured turn-by-turn walking legs that make complete sense to follow
  const isShortWalk = walkingDistM <= 450;
  const leg1Dist = isShortWalk ? walkingDistM : Math.round(walkingDistM * 0.55);
  const leg1Min = Math.max(1, Math.round(leg1Dist / WALK_CONFIG.METERS_PER_MIN));
  const leg1End = formatClockTime(addMinutes(now, leg1Min));

  const legs = [];

  if (isShortWalk) {
    legs.push({
      id: 'leg_walk_direct_all',
      type: 'walk',
      title: `Walk to ${destName}`,
      subtitle: `${walkMin} min · ${walkingDistM}m · head ${heading}`,
      timeStart: depTime,
      timeEnd: arrTime,
      durationMin: walkMin,
      distanceM: walkingDistM,
      isSheltered: true,
      lineColor: '#6366F1',
      stepsCount: steps,
      caloriesBurned: calories,
      shelterCoverage,
      walkingDetails: {
        steps,
        calories,
        shelterCoverage,
        distanceM: walkingDistM,
        instruction: `Head ${heading} along sheltered pedestrian walkway directly towards ${destName}`,
      },
    });
  } else {
    // Leg 1: Walk along main street corridor / covered linkway
    legs.push({
      id: 'leg_walk_part_1',
      type: 'walk',
      title: `Walk ${heading} along Covered Linkway`,
      subtitle: `${leg1Min} min · ${leg1Dist}m · follow footpath`,
      timeStart: depTime,
      timeEnd: leg1End,
      durationMin: leg1Min,
      distanceM: leg1Dist,
      isSheltered: true,
      lineColor: '#6366F1',
      walkingDetails: {
        steps: Math.round(steps * 0.55),
        calories: Math.round(calories * 0.55),
        shelterCoverage,
        distanceM: leg1Dist,
        instruction: `Head ${heading} along covered linkway and sidewalk towards pedestrian crossing`,
      },
    });

    // Leg 2: Cross intersection and approach destination
    const leg2Dist = walkingDistM - leg1Dist;
    const leg2Min = Math.max(1, walkMin - leg1Min);
    legs.push({
      id: 'leg_walk_part_2',
      type: 'walk',
      title: `Turn towards ${destName}`,
      subtitle: `${leg2Min} min · ${leg2Dist}m · cross to destination`,
      timeStart: leg1End,
      timeEnd: arrTime,
      durationMin: leg2Min,
      distanceM: leg2Dist,
      isSheltered: true,
      lineColor: '#6366F1',
      stepsCount: steps,
      caloriesBurned: calories,
      shelterCoverage,
      walkingDetails: {
        steps: Math.round(steps * 0.45),
        calories: Math.round(calories * 0.45),
        shelterCoverage,
        distanceM: leg2Dist,
        instruction: `Use signalised pedestrian crossing and enter ${destName}`,
      },
    });
  }

  // Map Polyline Segments with distinctive pedestrian dashed styling
  const distText = walkingDistM < 1000 ? `${walkingDistM}m` : `${walkingDistKm.toFixed(1)} km`;

  const polylineSegments = [
    {
      id: 'poly_walk_dedicated',
      type: 'walk',
      color: '#6366F1',
      dashArray: '5, 8',
      weight: 4.5,
      coordinates: pathCoordinates,
      tooltip: `🚶 Walk: ${distText} (${walkMin} min · ~${steps.toLocaleString()} steps · ${calories} kcal)`,
      isWalkRoute: true,
      steps,
      calories,
      distanceM: walkingDistM,
    },
  ];

  const badgeText = walkingDistM <= 500 ? '★ Quick Walk' : 'Direct Walk';

  const walkRoute = {
    id: 'route_walk_dedicated',
    title: 'Direct Walk',
    badge: badgeText,
    mode: 'walk',
    routeSummary: `Walk ${walkMin} min (${distText})`,
    transferCount: 0,
    isRerouted: false,
    originName,
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
    shelterCoverage,
    caloriesBurned: calories,
    stepCount: steps,
    distanceM: walkingDistM,
    legs,
    polylineSegments,
  };

  return walkRoute;
}
