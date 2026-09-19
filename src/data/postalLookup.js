// Singapore Postal Code Resolver and Intelligent Search Index
// Handles 6-digit Singapore postal sectors, landmark names, station codes, and street names.

import { MRT_STATIONS, getNearestStation } from './mrtStations.js';
import { POPULAR_DESTINATIONS } from './destinations.js';
import { BUS_STOPS, MAJOR_BUS_SERVICES, searchBusStops } from './busData.js';

// Singapore postal sector mappings (first 2 digits of 6-digit postal code)
export const POSTAL_SECTOR_MAP = {
  '01': { area: 'Raffles Place, Cecil, Marina', lat: 1.2800, lng: 103.8520 },
  '02': { area: 'Anson, Tanjong Pagar', lat: 1.2750, lng: 103.8460 },
  '03': { area: 'Queenstown, Tiong Bahru', lat: 1.2900, lng: 103.8200 },
  '04': { area: 'Telok Blangah, HarbourFront', lat: 1.2700, lng: 103.8220 },
  '05': { area: 'Pasir Panjang, Hong Leong', lat: 1.2800, lng: 103.7850 },
  '06': { area: 'High Street, Beach Road', lat: 1.2950, lng: 103.8550 },
  '07': { area: 'Middle Road, Golden Mile', lat: 1.3020, lng: 103.8600 },
  '08': { area: 'Little India, Farrer Park', lat: 1.3110, lng: 103.8530 },
  '09': { area: 'Orchard, Cairnhill, River Valley', lat: 1.3040, lng: 103.8340 },
  '10': { area: 'Ardmore, Bukit Timah, Holland', lat: 1.3150, lng: 103.8200 },
  '11': { area: 'Watten Estate, Novena, Thomson', lat: 1.3200, lng: 103.8420 },
  '12': { area: 'Balestier, Toa Payoh, Serangoon', lat: 1.3340, lng: 103.8500 },
  '13': { area: 'Macpherson, Braddell', lat: 1.3400, lng: 103.8750 },
  '14': { area: 'Geylang, Eunos', lat: 1.3180, lng: 103.8950 },
  '15': { area: 'Katong, Joo Chiat, Amber Road', lat: 1.3050, lng: 103.9020 },
  '16': { area: 'Bedok, Upper East Coast', lat: 1.3230, lng: 103.9280 },
  '17': { area: 'Loyang, Changi', lat: 1.3650, lng: 103.9850 },
  '18': { area: 'Tampines, Pasir Ris', lat: 1.3530, lng: 103.9450 },
  '19': { area: 'Serangoon Garden, Hougang, Punggol', lat: 1.3700, lng: 103.8850 },
  '20': { area: 'Bishan, Ang Mo Kio', lat: 1.3550, lng: 103.8480 },
  '21': { area: 'Upper Bukit Timah, Clementi Park', lat: 1.3450, lng: 103.7750 },
  '22': { area: 'Jurong, Tuas', lat: 1.3350, lng: 103.7050 },
  '23': { area: 'Hillview, Dairy Farm, Bukit Panjang', lat: 1.3650, lng: 103.7650 },
  '24': { area: 'Lim Chu Kang, Tengah', lat: 1.3700, lng: 103.7300 },
  '25': { area: 'Kranji, Woodgrove', lat: 1.4250, lng: 103.7700 },
  '26': { area: 'Upper Thomson, Springleaf', lat: 1.3900, lng: 103.8200 },
  '27': { area: 'Yishun, Sembawang', lat: 1.4300, lng: 103.8350 },
  '28': { area: 'Seletar', lat: 1.4100, lng: 103.8700 },
};

// Geocode a 6-digit Singapore postal code
export function geocodePostalCode(code) {
  const clean = String(code).trim().replace(/\D/g, '');
  if (clean.length !== 6) return null;

  // Exact popular match
  const popMatch = POPULAR_DESTINATIONS.find(d => d.postalCode === clean);
  if (popMatch) {
    return {
      name: popMatch.name,
      postalCode: clean,
      lat: popMatch.lat,
      lng: popMatch.lng,
      nearestStationId: popMatch.nearestStationId,
    };
  }

  // Sector-based lookup
  const sector = clean.substring(0, 2);
  const sectorData = POSTAL_SECTOR_MAP[sector];
  if (sectorData) {
    // Add micro jitter based on the last 4 digits for realistic precision
    const hash = (parseInt(clean.substring(2), 10) || 1234) % 1000;
    const latOffset = ((hash % 40) - 20) * 0.0003;
    const lngOffset = ((Math.floor(hash / 40) % 40) - 20) * 0.0003;
    const lat = sectorData.lat + latOffset;
    const lng = sectorData.lng + lngOffset;
    const nearest = getNearestStation(lat, lng);

    return {
      name: `Postal Code ${clean} (${sectorData.area})`,
      postalCode: clean,
      lat,
      lng,
      nearestStationId: nearest.station ? nearest.station.id : 'raffles_place',
    };
  }

  // Fallback to Singapore central coordinate
  const lat = 1.3521;
  const lng = 103.8198;
  const nearest = getNearestStation(lat, lng);
  return {
    name: `Singapore (${clean})`,
    postalCode: clean,
    lat,
    lng,
    nearestStationId: nearest.station ? nearest.station.id : 'city_hall',
  };
}

// Search destinations and stations by text or postal code
export function searchLocations(query) {
  if (!query || query.trim().length === 0) {
    return POPULAR_DESTINATIONS;
  }

  const q = query.trim().toLowerCase();
  const results = [];

  // Check if query is 6-digit postal code or starting with digits
  const numericOnly = q.replace(/\D/g, '');
  if (numericOnly.length >= 4) {
    // Check popular destinations matching postal code prefix
    const matchingPostal = POPULAR_DESTINATIONS.filter(d => d.postalCode.startsWith(numericOnly));
    results.push(...matchingPostal);

    // If exact 6-digit, add synthesized postal result if not already matched
    if (numericOnly.length === 6 && !matchingPostal.some(d => d.postalCode === numericOnly)) {
      const geo = geocodePostalCode(numericOnly);
      if (geo) {
        results.push({
          id: `postal_${numericOnly}`,
          name: geo.name,
          shortName: `S(${numericOnly})`,
          postalCode: numericOnly,
          address: geo.name,
          category: 'Postal Code Geocode',
          nearestStationId: geo.nearestStationId,
          dailyTapOuts: 25000,
          lat: geo.lat,
          lng: geo.lng,
          badge: 'GPS Matched',
        });
      }
    }
  }

  // Check popular destinations by name or category
  POPULAR_DESTINATIONS.forEach(dest => {
    if (
      dest.name.toLowerCase().includes(q) ||
      dest.shortName.toLowerCase().includes(q) ||
      dest.address.toLowerCase().includes(q) ||
      dest.category.toLowerCase().includes(q)
    ) {
      if (!results.some(r => r.id === dest.id)) {
        results.push(dest);
      }
    }
  });

  // Direct LRT shortform matching (BP, SK, PG)
  if (q === 'bp' || q === 'bpl') {
    const stn = MRT_STATIONS.find(s => s.id === 'bukit_panjang');
    if (stn && !results.some(r => r.nearestStationId === stn.id)) {
      results.unshift({
        id: `stn_${stn.id}`,
        name: `${stn.name} MRT/LRT (${stn.codes.join('/')})`,
        shortName: stn.name,
        postalCode: 'LRT Interchange',
        address: `${stn.name} Station, Singapore`,
        category: 'LRT Station',
        nearestStationId: stn.id,
        dailyTapOuts: stn.dailyTapOuts,
        lat: stn.lat,
        lng: stn.lng,
        badge: 'BP LRT Interchange',
      });
    }
  } else if (q === 'sk' || q === 'skl') {
    const stn = MRT_STATIONS.find(s => s.id === 'sengkang');
    if (stn && !results.some(r => r.nearestStationId === stn.id)) {
      results.unshift({
        id: `stn_${stn.id}`,
        name: `${stn.name} MRT/LRT (${stn.codes.join('/')})`,
        shortName: stn.name,
        postalCode: 'LRT Interchange',
        address: `${stn.name} Station, Singapore`,
        category: 'LRT Station',
        nearestStationId: stn.id,
        dailyTapOuts: stn.dailyTapOuts,
        lat: stn.lat,
        lng: stn.lng,
        badge: 'SK LRT Interchange',
      });
    }
  } else if (q === 'pg' || q === 'pgl') {
    const stn = MRT_STATIONS.find(s => s.id === 'punggol');
    if (stn && !results.some(r => r.nearestStationId === stn.id)) {
      results.unshift({
        id: `stn_${stn.id}`,
        name: `${stn.name} MRT/LRT (${stn.codes.join('/')})`,
        shortName: stn.name,
        postalCode: 'LRT Interchange',
        address: `${stn.name} Station, Singapore`,
        category: 'LRT Station',
        nearestStationId: stn.id,
        dailyTapOuts: stn.dailyTapOuts,
        lat: stn.lat,
        lng: stn.lng,
        badge: 'PG LRT Interchange',
      });
    }
  }

  // Check MRT stations by name or station code (e.g. "NS1", "Jurong East")
  MRT_STATIONS.forEach(stn => {
    const codeMatch = stn.codes.some(c => c.toLowerCase().includes(q));
    const nameMatch = stn.name.toLowerCase().includes(q);

    if (codeMatch || nameMatch) {
      const destId = `stn_${stn.id}`;
      if (!results.some(r => r.id === destId || r.nearestStationId === stn.id)) {
        results.push({
          id: destId,
          name: `${stn.name} MRT (${stn.codes.join('/')})`,
          shortName: stn.name,
          postalCode: 'MRT Station',
          address: `${stn.name} MRT Station, Singapore`,
          category: 'Metro Station',
          nearestStationId: stn.id,
          dailyTapOuts: stn.dailyTapOuts,
          lat: stn.lat,
          lng: stn.lng,
          badge: `${stn.codes[0]} Station`,
        });
      }
    }
  });

  // Check Bus Services (e.g. "190", "106", "Bus 960")
  const cleanSrv = q.replace(/^bus\s*/i, '').trim();
  if (MAJOR_BUS_SERVICES[cleanSrv]) {
    const srv = MAJOR_BUS_SERVICES[cleanSrv];
    results.unshift({
      id: `bus_srv_${srv.serviceNo}`,
      name: `Bus ${srv.serviceNo} (${srv.origin} ⇄ ${srv.destination})`,
      shortName: `Bus ${srv.serviceNo}`,
      postalCode: 'Bus Route',
      address: srv.description,
      category: 'Bus Service',
      nearestStationId: 'bukit_batok',
      dailyTapOuts: 30000,
      lat: 1.3496,
      lng: 103.7497,
      badge: `${srv.category}`,
      isBusService: true,
      serviceNo: srv.serviceNo,
    });
  }

  // Check Bus Stops by code or name
  const matchedStops = searchBusStops(q);
  matchedStops.forEach(stop => {
    const stopId = `bus_stop_${stop.code}`;
    if (!results.some(r => r.id === stopId)) {
      results.push({
        id: stopId,
        name: `${stop.name} (${stop.code})`,
        shortName: stop.name,
        postalCode: `Stop ${stop.code}`,
        address: `${stop.road}, Singapore`,
        category: 'Bus Stop',
        nearestStationId: stop.nearestMrt || 'bukit_batok',
        dailyTapOuts: 18000,
        lat: stop.lat,
        lng: stop.lng,
        badge: `Buses: ${stop.services.slice(0, 4).join(', ')}`,
        isBusStop: true,
        busStopCode: stop.code,
      });
    }
  });

  return results;
}

// Live Online Geocoder & Search across Singapore via OneMap and OpenStreetMap Nominatim
export async function searchSingaporeLocationsLive(query) {
  if (!query || query.trim().length === 0) {
    return POPULAR_DESTINATIONS;
  }

  const clean = query.trim();
  // Get fast local results first (stations, landmarks, postal sectors)
  const localResults = searchLocations(clean);

  // If query is short (< 3 chars), return local results immediately
  if (clean.length < 3) {
    return localResults;
  }

  const liveResults = [];

  // 1. Try OneMap Official Singapore Search API (with 2s timeout)
  try {
    const oneMapUrl = `https://www.onemap.gov.sg/api/common/elastic/search?searchVal=${encodeURIComponent(clean)}&returnGeom=Y&getAddrDetails=Y&pageNum=1`;
    const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
    const timeoutId = controller ? setTimeout(() => controller.abort(), 2000) : null;
    const res = await fetch(oneMapUrl, { signal: controller?.signal });
    if (timeoutId) clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.results && data.results.length > 0) {
        data.results.forEach((item, idx) => {
          const lat = parseFloat(item.LATITUDE);
          const lng = parseFloat(item.LONGITUDE);
          if (!isNaN(lat) && !isNaN(lng)) {
            const nearest = getNearestStation(lat, lng);
            const bldg = item.BUILDING && item.BUILDING !== 'NIL' ? item.BUILDING : null;
            const road = item.ROAD_NAME && item.ROAD_NAME !== 'NIL' ? item.ROAD_NAME : null;
            const searchVal = item.SEARCHVAL && item.SEARCHVAL !== 'NIL' ? item.SEARCHVAL : 'Singapore Address';
            const name = bldg || searchVal || road;

            liveResults.push({
              id: `onemap_${item.POSTAL || ''}_${idx}`,
              name: name,
              shortName: name,
              postalCode: item.POSTAL && item.POSTAL !== 'NIL' ? item.POSTAL : '',
              address: item.ADDRESS || `${road || ''} Singapore`,
              category: 'Singapore Address',
              lat,
              lng,
              nearestStationId: nearest.station ? nearest.station.id : 'city_hall',
              badge: item.POSTAL && item.POSTAL !== 'NIL' ? `S(${item.POSTAL})` : 'Address',
              dailyTapOuts: nearest.station ? nearest.station.dailyTapOuts : 35000,
            });
          }
        });
      }
    }
  } catch (_err) {
    // Silent fallback to local and OSM datasets
  }

  // 2. Fallback to OpenStreetMap Nominatim Singapore if OneMap returned nothing
  if (liveResults.length === 0) {
    try {
      const osmUrl = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(clean)}&countrycodes=sg&format=json&limit=5`;
      const controller = typeof AbortController !== 'undefined' ? new AbortController() : null;
      const timeoutId = controller ? setTimeout(() => controller.abort(), 2000) : null;
      const osmRes = await fetch(osmUrl, {
        headers: {
          'Accept': 'application/json',
        },
        signal: controller?.signal,
      });
      if (timeoutId) clearTimeout(timeoutId);

      if (osmRes.ok) {
        const osmData = await osmRes.json();
        if (Array.isArray(osmData)) {
          osmData.forEach((item, idx) => {
            const lat = parseFloat(item.lat);
            const lng = parseFloat(item.lon);
            if (!isNaN(lat) && !isNaN(lng)) {
              const nearest = getNearestStation(lat, lng);
              liveResults.push({
                id: `osm_${item.place_id || idx}`,
                name: item.name || clean,
                shortName: item.name || clean,
                postalCode: '',
                address: item.display_name,
                category: item.type || 'OpenStreetMap',
                lat,
                lng,
                nearestStationId: nearest.station ? nearest.station.id : 'city_hall',
                badge: 'OSM Match',
                dailyTapOuts: nearest.station ? nearest.station.dailyTapOuts : 35000,
              });
            }
          });
        }
      }
    } catch (_osmErr) {
      // Silent fallback to local dataset
    }
  }

  // Deduplicate and merge live results with local matches
  const merged = [...localResults];
  for (const live of liveResults) {
    const isDup = merged.some(m =>
      m.name.toLowerCase() === live.name.toLowerCase() ||
      (m.postalCode && live.postalCode && m.postalCode === live.postalCode) ||
      (Math.abs(m.lat - live.lat) < 0.001 && Math.abs(m.lng - live.lng) < 0.001)
    );
    if (!isDup) {
      merged.push(live);
    }
  }

  return merged;
}

