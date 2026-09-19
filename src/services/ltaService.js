// LTA DataMall API Service Layer
// Connects to live LTA DataMall endpoints with automated canonical line translation and seamless scenario fallback.

import { getEffectiveApiKey, getEffectiveCredentials } from '../config/ltaKeys.js';
import { CANONICAL_LINES, toPCDLineCode, getCanonicalLine } from '../data/canonicalLines.js';
import { SCENARIOS } from '../data/scenarios.js';
import { getBusStopByCode, BUS_STOPS, MAJOR_BUS_SERVICES } from '../data/busData.js';
import { getBusServiceTerminus, getBusServiceOperator } from '../data/busServices.js';
import { getOfficialTerminus, getBusServiceInfo } from './busRoutingService.js';

const LTA_BASE_URL = 'https://datamall2.mytransport.sg/ltaodataservice';

// In-memory cache for fetched LTA bus stops (populated once per session)
let _cachedBusStops = null;
let _busStopsFetchPromise = null;


// Active scenario state (default to NORMAL, or user chosen simulation)
// Active scenario state (default to live API with valid user keys!)
let currentScenario = SCENARIOS.NSL_UNPLANNED_FAULT;
let isLiveApiMode = true; // Enabled by default to use real live data!

export function setActiveScenario(scenarioKey) {
  if (SCENARIOS[scenarioKey]) {
    currentScenario = SCENARIOS[scenarioKey];
  }
}

export function getActiveScenario() {
  return currentScenario;
}

export function setLiveApiMode(enabled) {
  isLiveApiMode = enabled;
}

export function getLiveApiMode() {
  return isLiveApiMode;
}

// Fetch helper with DataMall AccountKey & APIKey headers, with local proxy support
async function fetchLTA(endpoint) {
  const { accountKey, apiKey } = getEffectiveCredentials();
  const effectiveKey = accountKey || apiKey;
  
  if (!effectiveKey) {
    throw new Error('No LTA DataMall AccountKey configured.');
  }

  const headers = {
    accept: 'application/json',
  };

  if (accountKey) headers['AccountKey'] = accountKey;
  if (apiKey) headers['ApiKey'] = apiKey;

  // 1. Try local dev proxy (/api/lta/...) first if in browser environment to bypass CORS
  if (typeof window !== 'undefined' && window.location) {
    try {
      const proxyRes = await fetch(`/api/lta/${endpoint}`, {
        method: 'GET',
        headers,
      });
      if (proxyRes.ok) {
        return await proxyRes.json();
      }
    } catch (proxyErr) {
      console.warn('Proxy fetch failed, attempting direct fetch:', proxyErr.message);
    }
  }

  // 2. Direct fetch to LTA DataMall
  const response = await fetch(`${LTA_BASE_URL}/${endpoint}`, {
    method: 'GET',
    headers,
  });

  if (!response.ok) {
    throw new Error(`LTA DataMall HTTP ${response.status}: ${response.statusText}`);
  }

  return await response.json();
}


/**
 * 1. Train Service Alerts
 * GET /ltaodataservice/TrainServiceAlerts
 * Official structured train disruption feed
 */
export async function getTrainServiceAlerts() {
  if (isLiveApiMode) {
    try {
      const data = await fetchLTA('TrainServiceAlerts');
      if (data && data.value) {
        return data.value;
      }
    } catch (err) {
      console.warn('Live TrainServiceAlerts fetch failed, falling back to scenario:', err.message);
    }
  }
  return currentScenario.trainServiceAlerts;
}

/**
 * 2. Station Crowd Density (Real-Time)
 * GET /ltaodataservice/PCDRealTime?TrainLine=<code>
 * Refreshed every 10 minutes. CrowdLevel: 'l', 'm', 'h' or 'NA'
 */
export async function getPCDRealTime(canonicalLineId) {
  const pcdCode = toPCDLineCode(canonicalLineId);

  if (isLiveApiMode) {
    try {
      const data = await fetchLTA(`PCDRealTime?TrainLine=${pcdCode}`);
      if (data && data.value) {
        return data.value;
      }
    } catch (err) {
      console.warn(`Live PCDRealTime (${pcdCode}) failed:`, err.message);
    }
  }

  // Generate realistic crowd density map based on current scenario
  return generateSimulatedPCD(canonicalLineId, currentScenario);
}

/**
 * 3. Station Crowd Density (Forecast)
 * GET /ltaodataservice/PCDForecast?TrainLine=<code>
 * 30-minute intervals forecast
 */
export async function getPCDForecast(canonicalLineId) {
  const pcdCode = toPCDLineCode(canonicalLineId);

  if (isLiveApiMode) {
    try {
      const data = await fetchLTA(`PCDForecast?TrainLine=${pcdCode}`);
      if (data && data.value) {
        return data.value;
      }
    } catch (err) {
      console.warn(`Live PCDForecast (${pcdCode}) failed:`, err.message);
    }
  }

  return generateSimulatedPCDForecast(canonicalLineId, currentScenario);
}

// Helper to format ISO arrival timestamp to countdown minutes
export function calculateEtaMin(isoString) {
  if (!isoString) return null;
  try {
    const target = new Date(isoString);
    const now = new Date();
    const diffMs = target.getTime() - now.getTime();
    const diffMin = Math.round(diffMs / 60000);
    if (diffMin <= 0) return 'Arr';
    return `${diffMin}m`;
  } catch (e) {
    return 'Arr';
  }
}

// Helper to translate LTA crowd loads into commuter badges
export function parseLoad(loadCode) {
  switch (loadCode) {
    case 'SEA':
      return { text: 'Seats Available', level: 'low', color: '#10B981', bg: '#E6F4F1' };
    case 'SDA':
      return { text: 'Standing Available', level: 'medium', color: '#D97706', bg: '#FEF3C7' };
    case 'LSD':
      return { text: 'Limited Standing', level: 'high', color: '#DC2626', bg: '#FEE2E2' };
    default:
      return { text: 'Normal', level: 'low', color: '#10B981', bg: '#E6F4F1' };
  }
}

/**
 * 4. Bus Arrival & Load
 * GET /ltaodataservice/v3/BusArrival?BusStopCode=<code>
 * Load: SEA (Seats Available), SDA (Standing Available), LSD (Limited Standing)
 * Feature: WAB (Wheelchair Accessible Bus)
 * Type: SD (Single Deck), DD (Double Deck), BD (Bendy)
 */
export async function getBusArrivals(busStopCode, serviceNo) {
  let rawServices = [];
  if (isLiveApiMode) {
    try {
      const ep = `v3/BusArrival?BusStopCode=${busStopCode}${serviceNo ? `&ServiceNo=${serviceNo}` : ''}`;
      const data = await fetchLTA(ep);
      if (data && data.Services && data.Services.length > 0) {
        rawServices = data.Services;
      }
    } catch (err) {
      console.warn(`Live BusArrival for stop ${busStopCode} failed:`, err.message);
    }
  }

  // Fallback to simulated arrivals if empty (e.g. late-night hours in Singapore or offline)
  if (!rawServices || rawServices.length === 0) {
    rawServices = getSimulatedBusArrivals(busStopCode);
  }

  // Normalize into commuter-friendly structure
  return rawServices.map(srv => {
    const next1 = srv.NextBus;
    const next2 = srv.NextBus2;
    const next3 = srv.NextBus3;

    return {
      serviceNo: srv.ServiceNo,
      operator: srv.Operator || getBusServiceOperator(srv.ServiceNo),
      destination: getServiceTerminus(srv.ServiceNo),
      nextBus: next1 && next1.EstimatedArrival ? {
        etaText: calculateEtaMin(next1.EstimatedArrival),
        etaMin: calculateEtaMin(next1.EstimatedArrival),
        load: parseLoad(next1.Load),
        type: next1.Type === 'DD' ? 'Double Decker' : 'Single Deck',
        isDoubleDecker: next1.Type === 'DD',
        isWheelchairAccessible: next1.Feature === 'WAB',
      } : null,
      nextBus2: next2 && next2.EstimatedArrival ? {
        etaText: calculateEtaMin(next2.EstimatedArrival),
        etaMin: calculateEtaMin(next2.EstimatedArrival),
        load: parseLoad(next2.Load),
        isDoubleDecker: next2.Type === 'DD',
      } : null,
      nextBus3: next3 && next3.EstimatedArrival ? {
        etaText: calculateEtaMin(next3.EstimatedArrival),
        etaMin: calculateEtaMin(next3.EstimatedArrival),
        load: parseLoad(next3.Load),
      } : null,
    };
  });
}

export const getBusArrival = getBusArrivals;

function getServiceTerminus(serviceNo) {
  const official = getOfficialTerminus(serviceNo);
  if (official && official !== 'In Service') return official;
  return getBusServiceTerminus(serviceNo);
}

/**
 * Fetch all LTA bus services directly from DataMall API (live synced).
 */
export async function getLtaBusServices() {
  if (isLiveApiMode) {
    try {
      let all = [];
      let skip = 0;
      while (true) {
        const data = await fetchLTA(`BusServices?$skip=${skip}`);
        const batch = data?.value || [];
        if (batch.length === 0) break;
        all.push(...batch);
        if (batch.length < 500) break;
        skip += 500;
      }
      return all;
    } catch (err) {
      console.warn('Failed to fetch live LTA BusServices:', err.message);
    }
  }
  const allBusServices = (await import('../data/allBusServices.js')).default;
  return Object.values(allBusServices);
}

/**
 * Fetch all LTA bus routes directly from DataMall API (live synced).
 */
export async function getLtaBusRoutes(serviceNo) {
  if (isLiveApiMode) {
    try {
      const data = await fetchLTA(`BusRoutes?$skip=0`);
      return data?.value || [];
    } catch (err) {
      console.warn('Failed to fetch live LTA BusRoutes:', err.message);
    }
  }
  const allBusRoutes = (await import('../data/allBusRoutes.js')).default;
  if (serviceNo && allBusRoutes[serviceNo]) {
    return allBusRoutes[serviceNo];
  }
  return allBusRoutes;
}

/**
 * Fetch all LTA bus stops (paginated, 500 per call).
 * Caches in memory for the session. Returns array of stop objects.
 */
async function fetchAllLtaBusStops() {
  if (_cachedBusStops) return _cachedBusStops;
  if (_busStopsFetchPromise) return _busStopsFetchPromise;

  _busStopsFetchPromise = (async () => {
    const allStops = [];
    let skip = 0;
    const limit = 500;
    try {
      while (true) {
        const data = await fetchLTA(`BusStops?$skip=${skip}`);
        const batch = data?.value || [];
        if (batch.length === 0) break;
        allStops.push(...batch);
        if (batch.length < limit) break;
        skip += limit;
        // LTA has ~5000 stops, cap at 10 pages for safety
        if (skip >= 5000) break;
      }
      _cachedBusStops = allStops;
    } catch (err) {
      console.warn('Failed to fetch LTA bus stops:', err.message);
      _cachedBusStops = [];
    }
    _busStopsFetchPromise = null;
    return _cachedBusStops;
  })();

  return _busStopsFetchPromise;
}

// Haversine distance helper (km)
function _haversineKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

/**
 * Get nearest bus stops to a coordinate using LTA DataMall live data.
 * Falls back to the static BUS_STOPS list from busData.js.
 */
export async function getNearbyBusStopsLive(lat, lng, limit = 6) {
  if (isLiveApiMode) {
    try {
      const allStops = await fetchAllLtaBusStops();
      if (allStops && allStops.length > 0) {
        const withDist = allStops.map(s => ({
          code: s.BusStopCode,
          name: s.Description,
          road: s.RoadName,
          lat: s.Latitude,
          lng: s.Longitude,
          distanceKm: _haversineKm(lat, lng, s.Latitude, s.Longitude),
          distanceM: Math.round(_haversineKm(lat, lng, s.Latitude, s.Longitude) * 1000),
          services: [],
        }));
        withDist.sort((a, b) => a.distanceKm - b.distanceKm);
        return withDist.slice(0, limit);
      }
    } catch (err) {
      console.warn('getNearbyBusStopsLive failed:', err.message);
    }
  }

  // Fallback to static list
  const { getNearestBusStops } = await import('../data/busData.js');
  return getNearestBusStops(lat, lng, limit);
}

/**
 * 5. Facilities Maintenance (Lift Maintenance at MRT Stations)
 * GET /ltaodataservice/v2/FacilitiesMaintenance
 */
export async function getFacilitiesMaintenance() {
  if (isLiveApiMode) {
    try {
      const data = await fetchLTA('v2/FacilitiesMaintenance');
      if (data && data.value) {
        return data.value;
      }
    } catch (err) {
      console.warn('Live FacilitiesMaintenance failed:', err.message);
    }
  }

  return currentScenario.facilitiesMaintenance || [];
}

/**
 * 6. Public Flood Alerts & Weather Advisories
 */
export async function getWeatherAndFloodAlerts() {
  return currentScenario.weather;
}

// Helper: generate simulated real-time PCD based on scenario
function generateSimulatedPCD(canonicalLineId, scenario) {
  const levels = ['l', 'm', 'h'];
  const baseLevel = scenario.pcdCrowdLevels ? scenario.pcdCrowdLevels.default || 'm' : 'm';

  // Sample stations for this line
  return [
    { Station: 'NS1', CrowdLevel: scenario.pcdCrowdLevels?.jurong_east || baseLevel },
    { Station: 'NS2', CrowdLevel: scenario.pcdCrowdLevels?.bukit_batok || 'l' },
    { Station: 'NS4', CrowdLevel: scenario.pcdCrowdLevels?.choa_chu_kang || baseLevel },
    { Station: 'NS17', CrowdLevel: scenario.pcdCrowdLevels?.bishan || 'h' },
    { Station: 'NS24', CrowdLevel: scenario.pcdCrowdLevels?.dhoby_ghaut || 'm' },
    { Station: 'EW14', CrowdLevel: scenario.pcdCrowdLevels?.raffles_place || 'm' },
    { Station: 'DT19', CrowdLevel: 'l' },
  ];
}

function generateSimulatedPCDForecast(canonicalLineId, scenario) {
  return [
    { TimeInterval: '07:30 - 08:00', CrowdLevel: 'm' },
    { TimeInterval: '08:00 - 08:30', CrowdLevel: scenario.id === 'PCD_CROWD_SURGE_FORECAST' ? 'h' : 'm' },
    { TimeInterval: '08:30 - 09:00', CrowdLevel: 'h' },
    { TimeInterval: '09:00 - 09:30', CrowdLevel: 'm' },
    { TimeInterval: '09:30 - 10:00', CrowdLevel: 'l' },
  ];
}

function getSimulatedBusArrivals(busStopCode) {
  const stop = getBusStopByCode(busStopCode);
  const services = (stop && stop.services && stop.services.length > 0)
    ? stop.services.slice(0, 6)
    : ['190', '106', '174', '61', '990'];

  const now = Date.now();
  const loads = ['SEA', 'SEA', 'SDA', 'LSD'];

  return services.map((srvNo, index) => {
    const srvConfig = MAJOR_BUS_SERVICES[srvNo];
    const offset1 = ((index * 3) % 8) + 1; // 1 to 8 min
    const offset2 = offset1 + 7 + (index % 4);
    const offset3 = offset2 + 10;

    return {
      ServiceNo: srvNo,
      Operator: srvConfig?.operator || 'SBST',
      NextBus: {
        EstimatedArrival: new Date(now + offset1 * 60000).toISOString(),
        Load: loads[index % loads.length],
        Feature: 'WAB',
        Type: index % 2 === 0 ? 'DD' : 'SD',
      },
      NextBus2: {
        EstimatedArrival: new Date(now + offset2 * 60000).toISOString(),
        Load: loads[(index + 1) % loads.length],
        Feature: 'WAB',
        Type: 'DD',
      },
      NextBus3: {
        EstimatedArrival: new Date(now + offset3 * 60000).toISOString(),
        Load: 'SEA',
        Feature: 'WAB',
        Type: 'SD',
      },
    };
  });
}
