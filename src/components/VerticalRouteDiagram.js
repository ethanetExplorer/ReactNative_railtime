// Vertical Route Diagram Component
// Compact, direct step diagram with dark forest teal accents (#083B38).
// Supports dragging up to full screen, Proper Title Case destination names,
// and zero unnecessary alerts or descriptions.

import React, { useState, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  PanResponder,
} from 'react-native';
import {
  ChevronLeft,
  ChevronDown,
  ChevronUp,
  Zap,
  Footprints,
  Bus,
  Train,
  MapPin,
  Clock,
  ArrowUpDown,
  ArrowRight,
  Pencil,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import LocationPickerModal from './LocationPickerModal';
import { THEME } from '../theme/colors';

export default function VerticalRouteDiagram({
  origin,
  destination,
  onUpdateOrigin,
  onUpdateDestination,
  routePlan,
  selectedRouteIndex = 0,
  onSelectRouteIndex,
  onBack,
  sheetState = 'standard',
  onChangeSheetState,
  isFullScreen = false,
  onToggleFullScreen,
}) {
  const [expandedStops, setExpandedStops] = useState({});
  const [showAlternativeComparison, setShowAlternativeComparison] = useState(false);
  const [editingLocationMode, setEditingLocationMode] = useState(null);

  // PanResponder to detect upward or downward drags on the handle and header
  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: (evt, gestureState) => Math.abs(gestureState.dy) > 8,
      onPanResponderRelease: (evt, gestureState) => {
        if (gestureState.dy < -20) {
          // Dragged up
          if (sheetState === 'hidden') {
            if (onChangeSheetState) onChangeSheetState('standard');
            else if (onToggleFullScreen) onToggleFullScreen();
          } else if (sheetState === 'standard') {
            if (onChangeSheetState) onChangeSheetState('full');
            else if (onToggleFullScreen) onToggleFullScreen();
          }
        } else if (gestureState.dy > 20) {
          // Dragged down
          if (sheetState === 'full' || isFullScreen) {
            if (onChangeSheetState) onChangeSheetState('standard');
            else if (onToggleFullScreen) onToggleFullScreen();
          } else if (sheetState === 'standard') {
            // Drag down from standard -> HIDE AWAY!
            if (onChangeSheetState) onChangeSheetState('hidden');
          }
        }
      },
    })
  ).current;

  if (!routePlan) return null;

  // Derive active route and all available routes
  const allRoutes = (routePlan.routes && routePlan.routes.length > 0) ? routePlan.routes : [routePlan];
  const activeRoute = allRoutes[selectedRouteIndex] || allRoutes[0] || routePlan;

  const toggleStopList = (legId) => {
    setExpandedStops(prev => ({ ...prev, [legId]: !prev[legId] }));
  };

  const handleSwapLocations = () => {
    if (onUpdateOrigin && onUpdateDestination && origin && destination) {
      const temp = origin;
      onUpdateOrigin(destination);
      onUpdateDestination(temp);
    }
  };

  const {
    originName,
    destinationName,
    uncertaintyText,
    totalDurationMin,
    departureTime,
    arrivalTime,
    proactiveAction,
    proactiveReason,
    legs = [],
    alternativeRoute,
    isRerouted,
    mode,
    stepCount,
    caloriesBurned,
    shelterCoverage,
  } = activeRoute;

  // If sheet is hidden away, render sleek compact bottom bar that can be tapped or dragged up
  if (sheetState === 'hidden') {
    return (
      <View style={styles.collapsedBarContainer} {...panResponder.panHandlers}>
        <TouchableOpacity
          style={styles.collapsedBarTouchArea}
          onPress={() => onChangeSheetState ? onChangeSheetState('standard') : onToggleFullScreen?.()}
          activeOpacity={0.8}
        >
          <View style={styles.dragHandle} />
          <View style={styles.collapsedContentRow}>
            <TouchableOpacity
              style={styles.collapsedBackBtn}
              onPress={onBack}
              activeOpacity={0.7}
            >
              <ChevronLeft size={16} color={THEME.forestDark} strokeWidth={2.4} />
              <Text style={styles.collapsedBackText}>Home</Text>
            </TouchableOpacity>

            <View style={styles.collapsedCenterInfo}>
              <Text style={styles.collapsedRouteTitle} numberOfLines={1}>
                {activeRoute.title || activeRoute.routeSummary || 'Route'}
              </Text>
              <Text style={styles.collapsedRouteTime}>
                {totalDurationMin} min • {departureTime} ➔ {arrivalTime}
              </Text>
            </View>

            <View style={styles.collapsedPullUpPill}>
              <Text style={styles.collapsedPullUpText}>Show Details</Text>
              <ChevronUp size={14} color="#FFFFFF" strokeWidth={2.4} />
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.sheetContainer}>
      {/* Draggable Handle Header */}
      <View
        style={styles.handleWrapper}
        {...panResponder.panHandlers}
      >
        <TouchableOpacity
          style={styles.handleTouchArea}
          onPress={() => {
            if (isFullScreen) {
              if (onChangeSheetState) onChangeSheetState('standard');
              else if (onToggleFullScreen) onToggleFullScreen();
            } else {
              if (onChangeSheetState) onChangeSheetState('full');
              else if (onToggleFullScreen) onToggleFullScreen();
            }
          }}
          activeOpacity={0.7}
        >
          <View style={styles.dragHandle} />
        </TouchableOpacity>
      </View>

      {/* Compact Top Navigation Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backButton} onPress={onBack} activeOpacity={0.7}>
          <ChevronLeft size={18} color={THEME.forestDark} strokeWidth={2.4} />
          <Text style={styles.backButtonText}>Home</Text>
        </TouchableOpacity>

        <View style={styles.etaHeaderRow}>
          <Text style={styles.etaMinutes}>{totalDurationMin}</Text>
          <Text style={styles.etaUnit}>min</Text>
          <Text style={styles.etaClockText}>
            ({departureTime} ➔ {arrivalTime})
          </Text>
        </View>

        {onChangeSheetState && (
          <TouchableOpacity
            style={styles.hideSheetButton}
            onPress={() => onChangeSheetState('hidden')}
            activeOpacity={0.7}
            accessibilityLabel="Hide sheet"
          >
            <ChevronDown size={18} color={THEME.forestDark} strokeWidth={2.4} />
          </TouchableOpacity>
        )}
      </View>

      {/* Native Apple Maps Style Journey Origin & Destination Card */}
      <View style={styles.journeyCard}>
        <View style={styles.journeyTrackColumn}>
          <View style={styles.journeyDotOrigin} />
          <View style={styles.journeyTrackDashed} />
          <View style={styles.journeyDotDest} />
        </View>

        <View style={styles.journeyInputsColumn}>
          {/* Origin Row */}
          <TouchableOpacity
            style={styles.journeyInputRow}
            onPress={() => setEditingLocationMode('origin')}
            activeOpacity={0.7}
          >
            <View style={styles.journeyTextWrapper}>
              <Text style={styles.journeyInputLabel}>START</Text>
              <Text style={styles.journeyInputName} numberOfLines={1}>
                {originName || origin?.shortName || origin?.name || 'Starting Point'}
              </Text>
            </View>
            <Pencil size={12} color={THEME.forestAccent} />
          </TouchableOpacity>

          <View style={styles.journeyDivider} />

          {/* Destination Row */}
          <TouchableOpacity
            style={styles.journeyInputRow}
            onPress={() => setEditingLocationMode('destination')}
            activeOpacity={0.7}
          >
            <View style={styles.journeyTextWrapper}>
              <Text style={styles.journeyInputLabel}>DESTINATION</Text>
              <Text style={styles.journeyInputName} numberOfLines={1}>
                {destinationName || destination?.shortName || destination?.name || 'Destination'}
              </Text>
            </View>
            <Pencil size={12} color={THEME.forestAccent} />
          </TouchableOpacity>
        </View>

        {/* Tactile Swap Button */}
        <TouchableOpacity
          style={styles.journeySwapButton}
          onPress={handleSwapLocations}
          activeOpacity={0.65}
          accessibilityLabel="Swap start and destination"
        >
          <ArrowUpDown size={14} color={THEME.forestDark} strokeWidth={2.4} />
        </TouchableOpacity>
      </View>

      {/* Compact Horizontal Row of All Possible Routes */}
      {allRoutes && allRoutes.length > 0 && (
        <View style={styles.routesWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.routesScrollContent}
          >
            {allRoutes.map((rt, idx) => {
              const isSelected = idx === (selectedRouteIndex || 0);
              const isBus = rt.mode === 'bus';
              const isWalk = rt.mode === 'walk';
              const transfers = rt.transferCount ?? 0;

              return (
                <TouchableOpacity
                  key={rt.id || `route_${idx}`}
                  style={[styles.routeCompactCard, isSelected && styles.routeCompactCardSelected]}
                  onPress={() => onSelectRouteIndex && onSelectRouteIndex(idx)}
                  activeOpacity={0.7}
                >
                  <View style={styles.routeCompactTop}>
                    <View style={[styles.routeIconBadge, isSelected && styles.routeIconBadgeSelected]}>
                      {isBus ? (
                        <Bus size={12} color={isSelected ? '#FFFFFF' : '#0284C7'} strokeWidth={2.4} />
                      ) : isWalk ? (
                        <Footprints size={12} color={isSelected ? '#FFFFFF' : '#64748B'} strokeWidth={2.4} />
                      ) : (
                        <Train size={12} color={isSelected ? '#FFFFFF' : '#0D9488'} strokeWidth={2.4} />
                      )}
                    </View>
                    <Text style={[styles.routeCompactTime, isSelected && styles.routeCompactTimeSelected]}>
                      {rt.totalDurationMin} min
                    </Text>
                    {rt.badge ? (
                      <View style={[styles.routeCompactBadge, isSelected && styles.routeCompactBadgeSelected]}>
                        <Text style={[styles.routeCompactBadgeText, isSelected && styles.routeCompactBadgeTextSelected]}>
                          {rt.badge}
                        </Text>
                      </View>
                    ) : null}
                  </View>

                  <View style={styles.routeCompactBottom}>
                    <Text
                      style={[styles.routeCompactSummary, isSelected && styles.routeCompactSummarySelected]}
                      numberOfLines={1}
                    >
                      {rt.routeSummary || rt.title}
                    </Text>
                    <Text style={[styles.routeCompactTransfers, isSelected && styles.routeCompactTransfersSelected]}>
                      {isWalk ? 'Walk' : transfers === 0 ? 'Direct' : `${transfers} xfer`}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      )}

      {/* Proactive Recommendation Alert: ONLY shown when disrupted / rerouted! */}
      {isRerouted && (
        <View style={styles.rerouteBanner}>
          <View style={styles.rerouteTop}>
            <Zap size={14} color="#B45309" strokeWidth={2.4} />
            <Text style={styles.rerouteTitle}>{proactiveAction}</Text>
          </View>
          <Text style={styles.rerouteReason}>{proactiveReason}</Text>
        </View>
      )}

      {/* Direct, Compact Steps Timeline */}
      <ScrollView
        style={styles.timelineScroll}
        contentContainerStyle={styles.timelineContent}
        showsVerticalScrollIndicator={false}
      >
        {legs.map((leg, index) => {
          const isLast = index === legs.length - 1;
          const isExpanded = expandedStops[leg.id];
          const isTransfer = leg.type === 'transfer';

          return (
            <View key={leg.id || index} style={styles.stepRow}>
              {/* Connector line */}
              {!isLast && (
                <View
                  style={[
                    styles.timelineLine,
                    { backgroundColor: leg.lineColor || (leg.type === 'walk' ? '#CBD5E1' : '#94A3B8') },
                  ]}
                />
              )}

              {/* Node Icon */}
              <View
                style={[
                  styles.nodeCircle,
                  { backgroundColor: leg.lineColor || (leg.type === 'walk' ? '#64748B' : THEME.forestDark) },
                ]}
              >
                {leg.type === 'walk' && <Footprints size={12} color="#FFFFFF" />}
                {leg.type === 'bus' && <Bus size={12} color="#FFFFFF" />}
                {leg.type === 'mrt' && <Train size={12} color="#FFFFFF" />}
                {leg.type === 'transfer' && <ArrowUpDown size={12} color="#FFFFFF" />}
                {!['walk', 'bus', 'mrt', 'transfer'].includes(leg.type) && <MapPin size={12} color="#FFFFFF" />}
              </View>

              {/* Compact Card */}
              <View style={styles.compactCard}>
                <View style={styles.cardHeader}>
                  <View style={styles.titleGroup}>
                    {leg.isMultiBus && Array.isArray(leg.services) && leg.services.length > 1 ? (
                      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
                        <View style={[styles.pill, { backgroundColor: '#E91E63' }]}>
                          <Text style={styles.pillText}>Any Bus</Text>
                        </View>
                        {leg.services.map(s => (
                          <View key={s} style={[styles.pill, { backgroundColor: '#0284C7' }]}>
                            <Text style={styles.pillText}>{s}</Text>
                          </View>
                        ))}
                      </View>
                    ) : (
                      leg.serviceNumber && (
                        <View style={[styles.pill, { backgroundColor: leg.lineColor || '#E91E63' }]}>
                          <Text style={styles.pillText}>Bus {leg.serviceNumber}</Text>
                        </View>
                      )
                    )}
                    {leg.lineId && (
                      <View style={[styles.pill, { backgroundColor: leg.lineColor || '#D42E12' }]}>
                        <Text style={styles.pillText}>{leg.lineId}</Text>
                      </View>
                    )}
                    {leg.fromStation && leg.toStation ? (
                      <View style={styles.stationRouteRow}>
                        <Text style={styles.stationNameText}>
                          {leg.fromStationCode ? `${leg.fromStationCode} ` : ''}{leg.fromStation}
                        </Text>
                        <ArrowRight size={12} color="#475569" strokeWidth={2.4} style={styles.arrowIcon} />
                        <Text style={styles.stationNameText}>
                          {leg.toStationCode ? `${leg.toStationCode} ` : ''}{leg.toStation}
                        </Text>
                      </View>
                    ) : (
                      <Text style={styles.stepTitle}>{leg.title}</Text>
                    )}
                  </View>

                  {!isTransfer && (
                    <Text style={styles.stepTimeText}>
                      {leg.timeStart} ({leg.durationMin}m)
                    </Text>
                  )}
                </View>

                <Text style={styles.stepSubtitle}>
                  {isTransfer
                    ? `${leg.fromLine || ''} ➔ ${leg.toLine || ''}`
                    : (leg.directionText || leg.subtitle)}
                </Text>

                {/* Bus Specific Metadata (Double Decker, Crowding, Frequency, Multi-Bus Badge) */}
                {(leg.busDetails || leg.badge) && (
                  <View style={styles.busMetaRow}>
                    {leg.badge && (
                      <View style={[styles.busMetaBadge, { backgroundColor: '#EDE9FE' }]}>
                        <Text style={[styles.busMetaText, { color: '#6D28D9' }]}>{leg.badge}</Text>
                      </View>
                    )}
                    {leg.busDetails?.type && (
                      <View style={styles.busMetaBadge}>
                        <Text style={styles.busMetaText}>{leg.busDetails.type}</Text>
                      </View>
                    )}
                    {leg.busDetails?.loadText && (
                      <View style={[styles.busMetaBadge, { backgroundColor: '#E6F4F1' }]}>
                        <Text style={[styles.busMetaText, { color: THEME.forestText }]}>
                          {leg.busDetails.loadText}
                        </Text>
                      </View>
                    )}
                    {leg.busDetails?.freq && (
                      <Text style={styles.busFreqText}>Every {leg.busDetails.freq}</Text>
                    )}
                  </View>
                )}

                {/* Walking Leg Specific Details (Steps, Calories, Sheltered Linkway) */}
                {leg.type === 'walk' && (leg.walkingDetails || leg.stepsCount) && (
                  <View style={styles.busMetaRow}>
                    {(leg.walkingDetails?.steps || leg.stepsCount) ? (
                      <View style={[styles.busMetaBadge, { backgroundColor: '#EEF2FF' }]}>
                        <Text style={[styles.busMetaText, { color: '#4F46E5' }]}>
                          ~{(leg.walkingDetails?.steps || leg.stepsCount).toLocaleString()} steps
                        </Text>
                      </View>
                    ) : null}
                    {(leg.walkingDetails?.calories || leg.caloriesBurned) ? (
                      <View style={[styles.busMetaBadge, { backgroundColor: '#FEF2F2' }]}>
                        <Text style={[styles.busMetaText, { color: '#DC2626' }]}>
                          🔥 {leg.walkingDetails?.calories || leg.caloriesBurned} kcal
                        </Text>
                      </View>
                    ) : null}
                    <View style={[styles.busMetaBadge, { backgroundColor: '#F0FDF4' }]}>
                      <Text style={[styles.busMetaText, { color: '#16A34A' }]}>
                        ☂️ {leg.walkingDetails?.shelterCoverage || leg.shelterCoverage || '88%'} Covered
                      </Text>
                    </View>
                  </View>
                )}

                {/* Intermediate stops collapsible with station sequence dots */}
                {leg.stops && leg.stops.length > 2 && (
                  <View style={styles.stopsWrapper}>
                    <TouchableOpacity
                      style={styles.stopToggleBtn}
                      onPress={() => toggleStopList(leg.id)}
                      activeOpacity={0.7}
                    >
                      <Text style={styles.stopToggleText}>
                        {isExpanded ? 'Hide stops' : `${leg.stops.length - 2} intermediate stops`}
                      </Text>
                      {isExpanded ? (
                        <ChevronUp size={12} color={THEME.forestAccent} />
                      ) : (
                        <ChevronDown size={12} color={THEME.forestAccent} />
                      )}
                    </TouchableOpacity>

                    {isExpanded && (
                      <View style={styles.stopList}>
                        {leg.stops.slice(1, -1).map((stn, i) => (
                          <View key={i} style={styles.stopSequenceRow}>
                            <View style={[styles.stopSequenceDot, { backgroundColor: leg.lineColor || THEME.forestDark }]} />
                            <Text style={styles.stopSequenceName}>{stn}</Text>
                          </View>
                        ))}
                      </View>
                    )}
                  </View>
                )}
              </View>
            </View>
          );
        })}

        {/* Alternative Disrupted Route Comparison */}
        {alternativeRoute && (
          <View style={styles.altBox}>
            <TouchableOpacity
              style={styles.altHeader}
              onPress={() => setShowAlternativeComparison(!showAlternativeComparison)}
              activeOpacity={0.7}
            >
              <Text style={styles.altTitle}>
                {showAlternativeComparison ? 'Hide naive route' : 'Compare with naive route'}
              </Text>
              <Text style={styles.altTimeDiff}>
                Saves ~{alternativeRoute.durationMin - totalDurationMin} min
              </Text>
            </TouchableOpacity>

            {showAlternativeComparison && (
              <View style={styles.altDetails}>
                <Text style={styles.altRouteText}>{alternativeRoute.name} ({alternativeRoute.durationMin} min)</Text>
                <Text style={styles.altWarningText}>{alternativeRoute.warning}</Text>
              </View>
            )}
          </View>
        )}

        <View style={styles.bottomSpace} />
      </ScrollView>

      {/* Location Picker Modal */}
      <LocationPickerModal
        visible={editingLocationMode !== null}
        mode={editingLocationMode || 'origin'}
        currentLocation={editingLocationMode === 'origin' ? origin : destination}
        onSelect={(selectedLoc) => {
          if (editingLocationMode === 'origin' && onUpdateOrigin) {
            onUpdateOrigin(selectedLoc);
          } else if (editingLocationMode === 'destination' && onUpdateDestination) {
            onUpdateDestination(selectedLoc);
          }
        }}
        onClose={() => setEditingLocationMode(null)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 8,
  },
  handleWrapper: {
    width: '100%',
    paddingTop: 8,
    paddingBottom: 4,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'pointer',
  },
  handleTouchArea: {
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 20,
  },
  dragHandle: {
    width: 36,
    height: 4,
    borderRadius: 2,
    backgroundColor: '#CBD5E1',
    marginBottom: 4,
  },
  expandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  expandText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.forestDark,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 4,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 2,
  },
  backButtonText: {
    fontSize: 13,
    color: THEME.forestDark,
    fontWeight: '700',
  },
  etaHeaderRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
  },
  etaMinutes: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0F172A',
  },
  etaUnit: {
    fontSize: 12,
    fontWeight: '700',
    color: '#64748B',
  },
  etaClockText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  journeyCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  journeyTrackColumn: {
    alignItems: 'center',
    width: 16,
    marginRight: 8,
    paddingVertical: 2,
  },
  journeyDotOrigin: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    borderWidth: 2,
    borderColor: '#10B981',
    backgroundColor: '#FFFFFF',
  },
  journeyTrackDashed: {
    width: 1.5,
    height: 22,
    backgroundColor: '#CBD5E1',
    marginVertical: 2,
  },
  journeyDotDest: {
    width: 9,
    height: 9,
    borderRadius: 4.5,
    backgroundColor: '#EF4444',
  },
  journeyInputsColumn: {
    flex: 1,
    minWidth: 0,
  },
  journeyInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 1,
  },
  journeyTextWrapper: {
    flex: 1,
    minWidth: 0,
    marginRight: 6,
  },
  journeyInputLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
    letterSpacing: 0.4,
  },
  journeyInputName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    marginTop: 1,
  },
  journeyDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 4,
  },
  journeySwapButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 6,
  },
  routesWrapper: {
    marginHorizontal: 16,
    marginTop: 4,
    marginBottom: 8,
  },
  routesScrollContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  routeCompactCard: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 9,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minWidth: 118,
  },
  routeCompactCardSelected: {
    backgroundColor: THEME.forestDark,
    borderColor: THEME.forestDark,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.12,
    shadowRadius: 3,
    elevation: 2,
  },
  routeCompactTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 3,
  },
  routeIconBadge: {
    width: 18,
    height: 18,
    borderRadius: 4,
    backgroundColor: '#EEF2F6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  routeIconBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
  routeCompactTime: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  routeCompactTimeSelected: {
    color: '#FFFFFF',
  },
  routeCompactBadge: {
    backgroundColor: '#EEF2F6',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 'auto',
  },
  routeCompactBadgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.22)',
  },
  routeCompactBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  routeCompactBadgeTextSelected: {
    color: '#FFFFFF',
  },
  routeCompactBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 8,
  },
  routeCompactSummary: {
    fontSize: 11,
    fontWeight: '600',
    color: '#475569',
    flexShrink: 1,
  },
  routeCompactSummarySelected: {
    color: '#E2E8F0',
  },
  routeCompactTransfers: {
    fontSize: 10,
    fontWeight: '500',
    color: '#64748B',
  },
  routeCompactTransfersSelected: {
    color: '#6EE7B7',
    fontWeight: '600',
  },
  rerouteBanner: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FCD34D',
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 16,
    marginBottom: 6,
    padding: 8,
  },
  rerouteTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  rerouteTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  rerouteReason: {
    fontSize: 11,
    color: '#78350F',
    lineHeight: 14,
  },
  walkingBanner: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
    borderWidth: 1,
    borderRadius: 10,
    marginHorizontal: 16,
    marginBottom: 8,
    padding: 10,
  },
  walkingBannerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  walkingBannerTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#3730A3',
  },
  walkingStatsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  walkingStatItem: {
    alignItems: 'center',
  },
  walkingStatValue: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E1B4B',
  },
  walkingStatLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#6366F1',
    marginTop: 1,
  },
  timelineScroll: {
    flex: 1,
    width: '100%',
  },
  timelineContent: {
    paddingHorizontal: 16,
    paddingTop: 6,
    paddingBottom: 24,
  },
  stepRow: {
    flexDirection: 'row',
    position: 'relative',
    marginBottom: 8,
    alignItems: 'flex-start',
    width: '100%',
    paddingLeft: 0,
  },
  timelineLine: {
    position: 'absolute',
    top: 22,
    left: 10,
    width: 2,
    bottom: -8,
  },
  nodeCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    marginTop: 2,
    flexShrink: 0,
  },
  compactCard: {
    flex: 1,
    marginLeft: 10,
    marginRight: 0,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 9,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    minWidth: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 6,
  },
  titleGroup: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  stationRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexWrap: 'wrap',
    minWidth: 0,
  },
  stationNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  arrowIcon: {
    marginHorizontal: 1,
  },
  pill: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  pillText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  stepTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  stepTimeText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#64748B',
    flexShrink: 0,
    marginTop: 1,
  },
  stepSubtitle: {
    fontSize: 11,
    color: '#475569',
    marginTop: 3,
  },
  stopsWrapper: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 3,
  },
  stopToggleBtn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stopToggleText: {
    fontSize: 10,
    fontWeight: '600',
    color: THEME.forestAccent,
  },
  stopList: {
    marginTop: 3,
    paddingLeft: 4,
    gap: 2,
  },
  stopName: {
    fontSize: 10,
    color: '#64748B',
  },
  altBox: {
    marginTop: 6,
    marginBottom: 10,
  },
  altHeader: {
    backgroundColor: '#F1F5F9',
    padding: 6,
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  altTitle: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '600',
  },
  altTimeDiff: {
    fontSize: 10,
    fontWeight: '700',
    color: '#15803D',
  },
  altDetails: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 6,
    padding: 6,
    marginTop: 3,
  },
  altRouteText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#991B1B',
  },
  altWarningText: {
    fontSize: 10,
    color: '#64748B',
    marginTop: 1,
  },
  busMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
    marginBottom: 2,
  },
  busMetaBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 2,
    borderRadius: 4,
  },
  busMetaText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#475569',
  },
  busFreqText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  transferDetailBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  transferBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeCrossPlatform: {
    backgroundColor: '#ECFDF5',
  },
  badgeConcourse: {
    backgroundColor: '#F1F5F9',
  },
  transferBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  textCrossPlatform: {
    color: '#059669',
  },
  textConcourse: {
    color: '#475569',
  },
  transferWalkTimeText: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: '500',
  },
  stopSequenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingVertical: 2,
  },
  stopSequenceDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  hideSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
  },
  collapsedBarContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    borderTopWidth: 1,
    borderColor: 'rgba(226, 232, 240, 0.9)',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
    paddingHorizontal: 14,
    paddingTop: 6,
    paddingBottom: 8,
  },
  collapsedBarTouchArea: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  collapsedContentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 2,
    gap: 8,
    marginBottom: 4,
  },
  collapsedBackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 2,
  },
  collapsedBackText: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.forestDark,
  },
  collapsedCenterInfo: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
  },
  collapsedRouteTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.forestDark,
  },
  collapsedRouteTime: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
    marginTop: 1,
  },
  collapsedPullUpPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: THEME.forestDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 14,
    gap: 4,
  },
  collapsedPullUpText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bottomSpace: {
    height: 16,
  },
});
