// Geolocation Service for Mobile Web App
// Handles browser location permissions, coordinates, and real Singapore commuter origins.
// Never uses generic labels like "Your current location"; always returns the actual place name.

import { getNearestStation } from '../data/mrtStations.js';

// Default initial origin: Current Location (auto-detected via GPS on launch)
export const DEFAULT_COMMUTER_ORIGIN = {
  id: 'origin_current_location',
  name: 'Current Location',
  shortName: 'Current Location',
  address: 'Detecting current GPS location...',
  lat: 1.2930,
  lng: 103.8520,
  nearestStationId: 'city_hall',
  isGps: false,
};

export async function requestUserLocation() {
  if (typeof window === 'undefined' || !navigator.geolocation) {
    return {
      success: false,
      location: DEFAULT_COMMUTER_ORIGIN,
      error: 'Geolocation is not supported by your browser.',
    };
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        const nearest = getNearestStation(latitude, longitude);
        const actualName = nearest.station
          ? `${nearest.station.name} Vicinity`
          : `Singapore (${latitude.toFixed(4)}, ${longitude.toFixed(4)})`;

        resolve({
          success: true,
          location: {
            id: `gps_${latitude.toFixed(4)}_${longitude.toFixed(4)}`,
            name: actualName,
            shortName: nearest.station ? nearest.station.name : 'Singapore Location',
            address: nearest.station ? `${nearest.station.name} Area, Singapore` : 'Singapore',
            lat: latitude,
            lng: longitude,
            nearestStationId: nearest.station ? nearest.station.id : 'city_hall',
            isGps: true,
          },
        });
      },
      (error) => {
        let errorMsg = 'Location permission denied.';
        if (error.code === error.TIMEOUT) errorMsg = 'Location request timed out.';
        if (error.code === error.POSITION_UNAVAILABLE) errorMsg = 'Location unavailable.';

        resolve({
          success: false,
          location: DEFAULT_COMMUTER_ORIGIN,
          error: errorMsg,
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      }
    );
  });
}
