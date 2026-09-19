// Storage and management for user-defined regular commute places
// Supports:
// - User-defined name (e.g., "Office", "Gym", "Campus")
// - Venue name / destination (e.g., "Raffles Place", "Changi Airport")
// - Arrive-by time (e.g., "08:45")
// - Days of the week (e.g., ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'])

export const REGULAR_PLACES_STORAGE_KEY = 'kiasu_transit_regular_places_v1';

export const DAYS_OF_WEEK = [
  { key: 'Mon', label: 'M', full: 'Monday' },
  { key: 'Tue', label: 'T', full: 'Tuesday' },
  { key: 'Wed', label: 'W', full: 'Wednesday' },
  { key: 'Thu', label: 'T', full: 'Thursday' },
  { key: 'Fri', label: 'F', full: 'Friday' },
  { key: 'Sat', label: 'S', full: 'Saturday' },
  { key: 'Sun', label: 'S', full: 'Sunday' },
];

export const DEFAULT_REGULAR_PLACES = [
  {
    id: 'place_work',
    customName: 'Office / HQ',
    venueName: 'Raffles Place',
    destinationObj: {
      id: 'dest_raffles_place',
      name: 'Raffles Place',
      shortName: 'Raffles Place',
      lat: 1.2842,
      lng: 103.8515,
      nearestStationId: 'raffles_place',
    },
    arriveBy: '08:45',
    days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
  },
  {
    id: 'place_gym',
    customName: 'Fitness Club',
    venueName: 'Orchard',
    destinationObj: {
      id: 'dest_orchard',
      name: 'Orchard',
      shortName: 'Orchard',
      lat: 1.3040,
      lng: 103.8319,
      nearestStationId: 'orchard',
    },
    arriveBy: '18:30',
    days: ['Tue', 'Thu'],
  },
];

export function loadRegularPlaces() {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem(REGULAR_PLACES_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (_e) {
      // Fallback to default
    }
  }
  return DEFAULT_REGULAR_PLACES;
}

export function saveRegularPlaces(places) {
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      window.localStorage.setItem(REGULAR_PLACES_STORAGE_KEY, JSON.stringify(places));
    } catch (_e) {}
  }
}

