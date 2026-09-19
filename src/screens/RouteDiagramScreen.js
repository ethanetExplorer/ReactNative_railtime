// RouteDiagramScreen Component
// Top 1/3 OpenStreetMap view + Bottom 2/3 Vertical Route Diagram.
// Bottom sheet can be dragged or toggled to 100% full screen.

import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import OSMMapView from '../components/OSMMapView';
import VerticalRouteDiagram from '../components/VerticalRouteDiagram';

export default function RouteDiagramScreen({
  origin,
  destination,
  onUpdateOrigin,
  onUpdateDestination,
  routePlan,
  onBack,
}) {
  // Sheet state: 'standard' (2/3 sheet, 1/3 map), 'full' (100% sheet), 'hidden' (sheet hidden away at bottom, full map)
  const [sheetState, setSheetState] = useState('standard');
  const isFullScreen = sheetState === 'full';
  const isHidden = sheetState === 'hidden';

  // State for which candidate route is selected
  const [selectedRouteIndex, setSelectedRouteIndex] = useState(0);

  // Active route selection
  const allRoutes = (routePlan?.routes && routePlan.routes.length > 0) ? routePlan.routes : (routePlan ? [routePlan] : []);
  const activeRoute = allRoutes[selectedRouteIndex] || allRoutes[0] || routePlan;
  const polylineSegments = activeRoute?.polylineSegments || routePlan?.polylineSegments || [];
  const intermediateStations = activeRoute?.intermediateStations || routePlan?.intermediateStations || [];

  return (
    <View style={styles.container}>
      {/* Top OpenStreetMap View (collapses only when sheet is full screen; expands to 100% when sheet is hidden) */}
      {!isFullScreen && (
        <View style={[styles.mapSection, isHidden && styles.mapSectionFull]}>
          <OSMMapView
            origin={origin}
            destination={destination}
            polylineSegments={polylineSegments}
            intermediateStations={intermediateStations}
            disruptionMitigation={activeRoute?.mitigationNotice || routePlan?.mitigationNotice}
          />
        </View>
      )}

      {/* Expandable Route Diagram Bottom Sheet */}
      <View
        style={[
          styles.diagramSection,
          isFullScreen && styles.diagramSectionFull,
          isHidden && styles.diagramSectionHidden,
        ]}
      >
        <VerticalRouteDiagram
          origin={origin}
          destination={destination}
          onUpdateOrigin={onUpdateOrigin}
          onUpdateDestination={onUpdateDestination}
          routePlan={routePlan}
          selectedRouteIndex={selectedRouteIndex}
          onSelectRouteIndex={setSelectedRouteIndex}
          onBack={onBack}
          sheetState={sheetState}
          onChangeSheetState={setSheetState}
          isFullScreen={isFullScreen}
          onToggleFullScreen={() => setSheetState(s => (s === 'full' ? 'standard' : 'full'))}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#083B38',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
    position: 'relative',
  },
  mapSection: {
    height: '33.333%',
    width: '100%',
    overflow: 'hidden',
  },
  mapSectionFull: {
    height: '100%',
    width: '100%',
  },
  diagramSection: {
    height: '66.667%',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  diagramSectionFull: {
    height: '100%',
    width: '100%',
    maxWidth: '100%',
    overflow: 'hidden',
  },
  diagramSectionHidden: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    zIndex: 1000,
  },
});
