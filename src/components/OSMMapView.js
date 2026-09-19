// OpenStreetMap Map View Component (React Native Web)
// Renders the top 1/3 display with OpenStreetMap tiles, ODbL attribution,
// MRT routes highlighted in canonical line colors, and Bus routes in Pink (#E91E63).
// Features native iOS floating map controls (recenter, zoom, and route legend).

import React, { useMemo } from 'react';
import { StyleSheet, View, Text, Platform } from 'react-native';

export default function OSMMapView({
  origin,
  destination,
  polylineSegments = [],
  intermediateStations = [],
  disruptionMitigation,
  style,
}) {
  // Compute bounds and center
  const center = useMemo(() => {
    if (origin && destination) {
      return {
        lat: (origin.lat + destination.lat) / 2,
        lng: (origin.lng + destination.lng) / 2,
      };
    }
    return { lat: 1.3521, lng: 103.8198 }; // Singapore center
  }, [origin, destination]);

  // Generate Leaflet HTML document to embed cleanly in web iframe
  const leafletHtml = useMemo(() => {
    const originJson = JSON.stringify(origin || { lat: 1.3490, lng: 103.7496, name: 'Origin' });
    const destJson = JSON.stringify(destination || { lat: 1.2842, lng: 103.8515, name: 'Destination' });
    const segmentsJson = JSON.stringify(polylineSegments);
    const stationsJson = JSON.stringify(intermediateStations);

    return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY=" crossorigin="" />
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js" integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo=" crossorigin=""></script>
  <style>
    * { box-sizing: border-box; }
    html, body, #map {
      height: 100%;
      width: 100%;
      margin: 0;
      padding: 0;
      background: #e2e8f0;
      font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
    }
    .leaflet-control-attribution {
      font-size: 10px !important;
      background: rgba(255,255,255,0.92) !important;
      padding: 3px 7px !important;
      border-radius: 6px !important;
      box-shadow: 0 1px 4px rgba(0,0,0,0.1) !important;
      margin: 6px !important;
      color: #475569 !important;
    }
    .leaflet-control-attribution a {
      color: #0284c7 !important;
      text-decoration: none;
    }
    .custom-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 12px;
      font-weight: 700;
      color: white;
      border-radius: 50%;
      box-shadow: 0 3px 8px rgba(0,0,0,0.35);
      border: 2.5px solid white;
    }
    .marker-origin { background: #10B981; }
    .marker-dest { background: #EF4444; }
    
    .station-marker {
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
    }
    .station-tooltip {
      font-size: 11px !important;
      font-weight: 600 !important;
      color: #0f172a !important;
      background: rgba(255, 255, 255, 0.95) !important;
      border: 1px solid #cbd5e1 !important;
      border-radius: 6px !important;
      padding: 3px 7px !important;
      box-shadow: 0 2px 6px rgba(0,0,0,0.15) !important;
    }
    .station-popup {
      font-size: 12px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      line-height: 1.4;
    }

    /* Native iOS floating controls */
    .map-controls-group {
      position: absolute;
      bottom: 12px;
      right: 12px;
      z-index: 1000;
      display: flex;
      flex-direction: column;
      gap: 6px;
    }
    .floating-btn {
      width: 36px;
      height: 36px;
      background: #ffffff;
      border-radius: 18px;
      border: none;
      box-shadow: 0 3px 10px rgba(0,0,0,0.18);
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      color: #0f172a;
      transition: transform 0.1s, background-color 0.1s;
    }
    .floating-btn:active {
      transform: scale(0.92);
      background-color: #f1f5f9;
    }
    .floating-btn svg {
      width: 17px;
      height: 17px;
    }
    
    .legend-box {
      position: absolute;
      top: 12px;
      left: 12px;
      z-index: 1000;
      background: rgba(255,255,255,0.94);
      backdrop-filter: blur(8px);
      -webkit-backdrop-filter: blur(8px);
      padding: 6px 10px;
      border-radius: 10px;
      font-size: 11px;
      font-weight: 600;
      box-shadow: 0 3px 12px rgba(0,0,0,0.12);
      display: flex;
      flex-direction: column;
      gap: 4px;
      border: 1px solid rgba(226, 232, 240, 0.8);
    }
    .legend-row {
      display: flex;
      align-items: center;
      gap: 7px;
      color: #334155;
    }
    .legend-line {
      width: 18px;
      height: 4px;
      border-radius: 2px;
    }
  </style>
</head>
<body>
  <div id="map"></div>

  <!-- Route Legend -->
  <div class="legend-box">
    <div class="legend-row">
      <div class="legend-line" style="background: #E91E63;"></div>
      <span>Bus Route (Pink)</span>
    </div>
    <div class="legend-row">
      <div class="legend-line" style="background: #009645;"></div>
      <span>MRT Line</span>
    </div>
    <div class="legend-row">
      <div style="width: 10px; height: 10px; border-radius: 50%; border: 2.5px solid #009645; background: #fff;"></div>
      <span>MRT Station</span>
    </div>
    <div class="legend-row">
      <div class="legend-line" style="background: #6366F1; border-bottom: 2px dashed #6366F1; height: 0;"></div>
      <span>Walking Leg</span>
    </div>
  </div>

  <!-- Native iOS Map Controls -->
  <div class="map-controls-group">
    <button class="floating-btn" id="btn-recenter" title="Recenter Route">
      <svg viewBox="0 0 24 24" fill="none" stroke="#0284c7" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
        <polygon points="3 11 22 2 13 21 11 13 3 11"></polygon>
      </svg>
    </button>
    <button class="floating-btn" id="btn-zoom-in" title="Zoom In">
      <svg viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <line x1="12" y1="5" x2="12" y2="19"></line>
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
    <button class="floating-btn" id="btn-zoom-out" title="Zoom Out">
      <svg viewBox="0 0 24 24" fill="none" stroke="#334155" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
        <line x1="5" y1="12" x2="19" y2="12"></line>
      </svg>
    </button>
  </div>

  <script>
    const origin = ${originJson};
    const destination = ${destJson};
    const segments = ${segmentsJson};
    const stations = ${stationsJson};

    const map = L.map('map', {
      zoomControl: false,
      attributionControl: true
    }).setView([${center.lat}, ${center.lng}], 12);

    // OpenStreetMap Tile Layer with required attribution
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '© <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a> contributors'
    }).addTo(map);

    const latlngs = [];

    // Render polyline segments (with realistic curved geometry)
    segments.forEach(seg => {
      if (seg.coordinates && seg.coordinates.length > 0) {
        // Crisp white underlay casing for MRT tracks to emphasize smooth track curvature
        if (seg.type === 'mrt') {
          L.polyline(seg.coordinates, {
            color: '#ffffff',
            weight: 8.5,
            opacity: 0.95,
            smoothFactor: 0,
            lineJoin: 'round',
            lineCap: 'round',
          }).addTo(map);
        }

        // Crisp white underlay casing for walking path to contrast cleanly against map tiles
        if (seg.type === 'walk') {
          L.polyline(seg.coordinates, {
            color: '#ffffff',
            weight: 6.5,
            opacity: 0.9,
            smoothFactor: 0,
            lineJoin: 'round',
            lineCap: 'round',
          }).addTo(map);
        }

        const poly = L.polyline(seg.coordinates, {
          color: seg.color || '#3388ff',
          weight: seg.weight || (seg.type === 'mrt' ? 5.5 : seg.type === 'walk' ? 4 : 5),
          opacity: 0.95,
          smoothFactor: 0,
          dashArray: seg.dashArray || null,
          lineJoin: 'round',
          lineCap: 'round'
        }).addTo(map);

        if (seg.tooltip) {
          poly.bindTooltip(seg.tooltip, { sticky: true });
        }

        // Render subtle intermediate pedestrian waypoints for clear route illustration
        if (seg.type === 'walk' && seg.coordinates.length > 2) {
          for (let i = 1; i < seg.coordinates.length - 1; i++) {
            const pt = seg.coordinates[i];
            const walkDotIcon = L.divIcon({
              className: 'walk-dot-marker',
              html: '<div style="width: 7px; height: 7px; background: #6366F1; border: 1.5px solid #ffffff; border-radius: 50%; box-shadow: 0 1px 3px rgba(0,0,0,0.25);"></div>',
              iconSize: [7, 7],
              iconAnchor: [3.5, 3.5]
            });
            L.marker([pt[0], pt[1]], { icon: walkDotIcon, interactive: false }).addTo(map);
          }
        }

        seg.coordinates.forEach(c => latlngs.push(c));
      }
    });

    // Render Intermediate MRT Stations
    if (Array.isArray(stations) && stations.length > 0) {
      stations.forEach(stn => {
        if (stn && stn.lat && stn.lng) {
          const isInterchange = Boolean(stn.isInterchange);
          const lineColor = stn.lineColor || '#009645';
          const size = isInterchange ? 14 : 10;
          const radius = size / 2;

          const innerHtml = isInterchange
            ? '<div style="width: 14px; height: 14px; background: #ffffff; border: 3px solid ' + lineColor + '; border-radius: 50%; box-shadow: 0 0 0 2px rgba(0,0,0,0.15), 0 2px 6px rgba(0,0,0,0.25);"></div>'
            : '<div style="width: 10px; height: 10px; background: #ffffff; border: 2.5px solid ' + lineColor + '; border-radius: 50%; box-shadow: 0 1px 4px rgba(0,0,0,0.2);"></div>';

          const stationIcon = L.divIcon({
            className: 'station-marker',
            html: innerHtml,
            iconSize: [size, size],
            iconAnchor: [radius, radius]
          });

          const marker = L.marker([stn.lat, stn.lng], {
            icon: stationIcon,
            zIndexOffset: isInterchange ? 450 : 350
          }).addTo(map);

          const label = stn.code ? (stn.name + ' (' + stn.code + ')') : stn.name;
          marker.bindTooltip(label, {
            direction: 'top',
            offset: [0, -radius - 2],
            className: 'station-tooltip'
          });

          const linesHtml = Array.isArray(stn.lines) && stn.lines.length > 0
            ? '<div style="margin-top: 3px; font-size: 11px; color: #64748b;">Lines: ' + stn.lines.join(', ') + '</div>'
            : '';
          const popupContent =
            '<div class="station-popup">' +
              '<strong style="font-size: 13px; color: #0f172a;">' + stn.name + '</strong>' +
              (stn.code ? '<span style="color: #64748b; font-weight: 600; margin-left: 4px;">' + stn.code + '</span>' : '') +
              (isInterchange ? '<div style="color: #0284c7; font-weight: 600; font-size: 11px; margin-top: 2px;">● Interchange Station</div>' : '') +
              linesHtml +
            '</div>';
          marker.bindPopup(popupContent);

          latlngs.push([stn.lat, stn.lng]);
        }
      });
    }

    // Add Origin Marker
    if (origin && origin.lat) {
      const originIcon = L.divIcon({
        className: 'custom-marker marker-origin',
        html: 'A',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      L.marker([origin.lat, origin.lng], { icon: originIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('<b>Start:</b> ' + (origin.shortName || origin.name));
      latlngs.push([origin.lat, origin.lng]);
    }

    // Add Destination Marker
    if (destination && destination.lat) {
      const destIcon = L.divIcon({
        className: 'custom-marker marker-dest',
        html: 'B',
        iconSize: [26, 26],
        iconAnchor: [13, 13]
      });
      L.marker([destination.lat, destination.lng], { icon: destIcon, zIndexOffset: 1000 })
        .addTo(map)
        .bindPopup('<b>Destination:</b> ' + (destination.shortName || destination.name));
      latlngs.push([destination.lat, destination.lng]);
    }

    // Fit map to route bounds
    const fitRoute = () => {
      if (latlngs.length > 0) {
        map.fitBounds(L.latLngBounds(latlngs), { padding: [35, 35], maxZoom: 14 });
      }
    };
    fitRoute();

    // Floating Button Event Handlers
    document.getElementById('btn-recenter').addEventListener('click', fitRoute);
    document.getElementById('btn-zoom-in').addEventListener('click', () => map.zoomIn());
    document.getElementById('btn-zoom-out').addEventListener('click', () => map.zoomOut());
  </script>
</body>
</html>`;
  }, [origin, destination, polylineSegments, intermediateStations, center]);

  return (
    <View style={[styles.container, style]}>
      {Platform.OS === 'web' ? (
        <iframe
          srcDoc={leafletHtml}
          style={styles.iframe}
          title="OpenStreetMap Route View"
          frameBorder="0"
        />
      ) : (
        <View style={styles.fallbackContainer}>
          <Text style={styles.fallbackTitle}>Map Route Overview</Text>
          <Text style={styles.fallbackAttribution}>© OpenStreetMap contributors</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    backgroundColor: '#e2e8f0',
    position: 'relative',
    overflow: 'hidden',
  },
  iframe: {
    width: '100%',
    height: '100%',
    border: 'none',
  },
  fallbackContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f1f5f9',
  },
  fallbackTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#334155',
  },
  fallbackAttribution: {
    fontSize: 11,
    color: '#64748b',
    marginTop: 4,
  },
});
