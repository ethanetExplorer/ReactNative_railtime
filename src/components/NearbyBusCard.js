// NearbyBusCard Component
// Exact recreation of the reference screenshot UI:
// - Dark slate card aesthetic with "Nearby Bus Stops" header and stop count
// - Cyan bus icon badges, road & code subtitle
// - Navigation distance pills (e.g. ↗ 1.5 km) with chevrons
// - Sleek bus service capsules with crowd load dots and real-time countdowns [ 138 • 1m ]

import React, { useState, useEffect, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Bus, Navigation, ChevronRight, RefreshCw, X, Users, Accessibility } from 'lucide-react';
import { getNearestBusStops, BUS_STOPS } from '../data/busData';
import { getBusArrivals, getNearbyBusStopsLive } from '../services/ltaService';
import { THEME } from '../theme/colors';

function formatDistance(meters) {
  if (meters === undefined || meters === null) return '—';
  if (meters >= 1000) {
    return `${(meters / 1000).toFixed(1)} km`;
  }
  return `${meters}m`;
}

export default function NearbyBusCard({
  commuterOrigin,
  onSelectDestination,
}) {
  const [nearbyStops, setNearbyStops] = useState([]);
  const [stopsLoading, setStopsLoading] = useState(true);
  const [arrivalsByStop, setArrivalsByStop] = useState({});
  const [loadingStops, setLoadingStops] = useState({});
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [selectedBusDetail, setSelectedBusDetail] = useState(null);

  // 1. Fetch nearest stops (limit 6)
  const fetchStops = useCallback(async () => {
    const lat = commuterOrigin?.lat || 1.349033;
    const lng = commuterOrigin?.lng || 103.749596;
    setStopsLoading(true);

    try {
      const stops = await getNearbyBusStopsLive(lat, lng, 6);
      if (stops && stops.length > 0) {
        setNearbyStops(stops);
      } else {
        setNearbyStops(getNearestBusStops(lat, lng, 6));
      }
    } catch (e) {
      setNearbyStops(getNearestBusStops(lat, lng, 6));
    } finally {
      setStopsLoading(false);
    }
  }, [commuterOrigin?.lat, commuterOrigin?.lng]);

  useEffect(() => {
    fetchStops();
  }, [fetchStops]);

  // 2. Fetch arrivals for all nearby stops
  const fetchAllArrivals = useCallback(async (stopsList) => {
    if (!stopsList || stopsList.length === 0) return;
    setIsRefreshing(true);

    const newArrivals = {};
    await Promise.all(
      stopsList.map(async (stop) => {
        try {
          const data = await getBusArrivals(stop.code);
          newArrivals[stop.code] = data || [];
        } catch (e) {
          newArrivals[stop.code] = [];
        }
      })
    );

    setArrivalsByStop(prev => ({ ...prev, ...newArrivals }));
    setIsRefreshing(false);
  }, []);

  useEffect(() => {
    if (nearbyStops.length > 0) {
      fetchAllArrivals(nearbyStops);
    }
  }, [nearbyStops, fetchAllArrivals]);

  const handleRefresh = () => {
    if (nearbyStops.length > 0) {
      fetchAllArrivals(nearbyStops);
    }
  };

  const handleRouteToStop = (stop) => {
    if (onSelectDestination) {
      onSelectDestination({
        id: `bus_stop_${stop.code}`,
        name: `${stop.name} (${stop.code})`,
        shortName: stop.name,
        address: `${stop.road}, Singapore`,
        category: 'Bus Stop',
        lat: stop.lat,
        lng: stop.lng,
        isBusStop: true,
        busStopCode: stop.code,
      });
    }
  };

  return (
    <View style={styles.container}>
      {/* Dark Card Container */}
      <View style={styles.card}>
        {/* Card Header: "Nearby Bus Stops" & "6 stops" */}
        <View style={styles.headerRow}>
          <Text style={styles.headerTitle}>Nearby Bus Stops</Text>
          <View style={styles.headerRight}>
            <Text style={styles.headerCount}>
              {stopsLoading ? 'Locating...' : `${nearbyStops.length} stops`}
            </Text>
            <TouchableOpacity
              onPress={handleRefresh}
              disabled={isRefreshing}
              activeOpacity={0.7}
              style={styles.refreshBtn}
            >
              <RefreshCw
                size={12}
                color="#94A3B8"
                style={isRefreshing ? styles.spinning : null}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* Loading skeleton or Stops List */}
        {stopsLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="small" color="#06B6D4" />
            <Text style={styles.loadingText}>Finding closest bus stops...</Text>
          </View>
        ) : nearbyStops.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No bus stops found nearby.</Text>
          </View>
        ) : (
          nearbyStops.map((stop, index) => {
            const isLast = index === nearbyStops.length - 1;
            const stopArrivals = arrivalsByStop[stop.code] || [];
            const isLoadingArrivals = isRefreshing && stopArrivals.length === 0;

            return (
              <View
                key={stop.code}
                style={[styles.stopBlock, !isLast && styles.stopBlockDivider]}
              >
                {/* Stop Top Line: Icon, Name, Road & Code, Distance Pill, Chevron */}
                <TouchableOpacity
                  style={styles.stopTopLine}
                  onPress={() => handleRouteToStop(stop)}
                  activeOpacity={0.7}
                >
                  {/* Cyan Bus Icon Badge */}
                  <View style={styles.busIconBadge}>
                    <Bus size={18} color="#FFFFFF" strokeWidth={2.2} />
                  </View>

                  {/* Stop Name & Road / Code */}
                  <View style={styles.stopTextGroup}>
                    <Text style={styles.stopName} numberOfLines={1}>
                      {stop.name}
                    </Text>
                    <Text style={styles.stopSubtitle} numberOfLines={1}>
                      {stop.road} • {stop.code}
                    </Text>
                  </View>

                  {/* Right Actions: Distance Pill + Chevron */}
                  <View style={styles.rightActionGroup}>
                    <View style={styles.distancePill}>
                      <Navigation size={10} color="#60A5FA" style={styles.navIcon} />
                      <Text style={styles.distanceText}>
                        {formatDistance(stop.distanceM)}
                      </Text>
                    </View>
                    <ChevronRight size={15} color="#64748B" />
                  </View>
                </TouchableOpacity>

                {/* Stop Bottom Line: Scrollable Bus Arrival Pills */}
                <View style={styles.pillsContainer}>
                  {isLoadingArrivals ? (
                    <View style={styles.pillsLoading}>
                      <ActivityIndicator size="small" color="#06B6D4" />
                    </View>
                  ) : stopArrivals.length === 0 ? (
                    <Text style={styles.noArrivalsText}>Checking arrival timings...</Text>
                  ) : (
                    <ScrollView
                      horizontal
                      showsHorizontalScrollIndicator={false}
                      contentContainerStyle={styles.pillsScroll}
                    >
                      {stopArrivals.map((svc) => {
                        const next = svc.nextBus;
                        const eta = next?.etaText || '—';
                        const isArr = eta === 'Arr' || eta === '0m';
                        const dotColor = next?.load?.color || '#10B981';

                        return (
                          <TouchableOpacity
                            key={svc.serviceNo}
                            style={styles.servicePill}
                            onPress={() => setSelectedBusDetail({ ...svc, stopName: stop.name })}
                            activeOpacity={0.75}
                          >
                            <Text style={styles.serviceNoText}>{svc.serviceNo}</Text>
                            <View style={[styles.crowdDot, { backgroundColor: dotColor }]} />
                            <Text
                              style={[
                                styles.etaText,
                                isArr && styles.etaTextArr,
                              ]}
                            >
                              {eta}
                            </Text>
                          </TouchableOpacity>
                        );
                      })}
                    </ScrollView>
                  )}
                </View>
              </View>
            );
          })
        )}
      </View>

      {/* Optional Detail Modal / Popover when user taps a specific bus pill */}
      {selectedBusDetail && (
        <View style={styles.detailOverlay}>
          <View style={styles.detailCard}>
            <View style={styles.detailTop}>
              <View style={styles.detailBadge}>
                <Text style={styles.detailBadgeText}>{selectedBusDetail.serviceNo}</Text>
              </View>
              <View style={styles.detailTitles}>
                <Text style={styles.detailDest} numberOfLines={1}>
                  {selectedBusDetail.destination || 'In Service'}
                </Text>
                <Text style={styles.detailStop} numberOfLines={1}>
                  At {selectedBusDetail.stopName}
                </Text>
              </View>
              <TouchableOpacity
                onPress={() => setSelectedBusDetail(null)}
                style={styles.detailClose}
              >
                <X size={16} color="#94A3B8" />
              </TouchableOpacity>
            </View>

            {/* Timings row */}
            <View style={styles.timingsRow}>
              <View style={styles.timingCol}>
                <Text style={styles.timingLabel}>NEXT BUS</Text>
                <Text style={styles.timingValue}>
                  {selectedBusDetail.nextBus?.etaText || '—'}
                </Text>
                {selectedBusDetail.nextBus?.load && (
                  <Text
                    style={[
                      styles.timingLoad,
                      { color: selectedBusDetail.nextBus.load.color },
                    ]}
                  >
                    {selectedBusDetail.nextBus.load.text}
                  </Text>
                )}
              </View>

              <View style={styles.timingCol}>
                <Text style={styles.timingLabel}>2ND BUS</Text>
                <Text style={styles.timingValue}>
                  {selectedBusDetail.nextBus2?.etaText || '—'}
                </Text>
                {selectedBusDetail.nextBus2?.load && (
                  <Text
                    style={[
                      styles.timingLoad,
                      { color: selectedBusDetail.nextBus2.load.color },
                    ]}
                  >
                    {selectedBusDetail.nextBus2.load.text}
                  </Text>
                )}
              </View>

              <View style={styles.timingCol}>
                <Text style={styles.timingLabel}>3RD BUS</Text>
                <Text style={styles.timingValue}>
                  {selectedBusDetail.nextBus3?.etaText || '—'}
                </Text>
                {selectedBusDetail.nextBus3?.load && (
                  <Text
                    style={[
                      styles.timingLoad,
                      { color: selectedBusDetail.nextBus3.load.color },
                    ]}
                  >
                    {selectedBusDetail.nextBus3.load.text}
                  </Text>
                )}
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 12,
  },

  // ── Light Card ───────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingTop: 16,
    paddingBottom: 8,
    paddingHorizontal: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },

  // ── Header Row ────────────────────────────────────────────────────────────
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 2,
  },
  headerTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerCount: {
    fontSize: 13,
    color: '#64748B',
    fontWeight: '500',
  },
  refreshBtn: {
    padding: 2,
  },
  spinning: {
    transform: [{ rotate: '45deg' }],
  },

  // ── Stop Block ────────────────────────────────────────────────────────────
  stopBlock: {
    paddingVertical: 11,
  },
  stopBlockDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },

  // ── Stop Top Line ─────────────────────────────────────────────────────────
  stopTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  busIconBadge: {
    width: 34,
    height: 34,
    borderRadius: 8,
    backgroundColor: '#0284C7', // Crisp cyan-blue badge
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  stopTextGroup: {
    flex: 1,
    minWidth: 0,
    marginRight: 8,
  },
  stopName: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.1,
  },
  stopSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  // ── Right Action (Distance pill + Chevron) ─────────────────────────────────
  rightActionGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexShrink: 0,
  },
  distancePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EFF6FF', // Soft light blue tint
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  navIcon: {
    transform: [{ rotate: '45deg' }],
  },
  distanceText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#2563EB',
  },

  // ── Bottom Line: Bus Service Arrival Pills ────────────────────────────────
  pillsContainer: {
    marginTop: 9,
    minHeight: 28,
    justifyContent: 'center',
  },
  pillsScroll: {
    flexDirection: 'row',
    gap: 7,
    paddingRight: 6,
  },
  servicePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: '#F8FAFC', // Crisp light pill
    borderRadius: 8,
    paddingHorizontal: 9,
    paddingVertical: 5,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  serviceNoText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.1,
  },
  crowdDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  etaText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  etaTextArr: {
    color: '#15803D', // Emerald green for 'Arr'
    fontWeight: '700',
  },
  pillsLoading: {
    paddingVertical: 4,
    alignItems: 'flex-start',
  },
  noArrivalsText: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },

  // ── Loading & Empty States ────────────────────────────────────────────────
  loadingContainer: {
    paddingVertical: 24,
    alignItems: 'center',
    gap: 8,
  },
  loadingText: {
    fontSize: 12,
    color: '#64748B',
  },
  emptyContainer: {
    paddingVertical: 20,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 12,
    color: '#64748B',
  },

  // ── Detail Popover Modal ──────────────────────────────────────────────────
  detailOverlay: {
    marginTop: 10,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  detailCard: {
    gap: 10,
  },
  detailTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  detailBadge: {
    backgroundColor: '#0284C7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailBadgeText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  detailTitles: {
    flex: 1,
    minWidth: 0,
  },
  detailDest: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  detailStop: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  detailClose: {
    padding: 4,
  },
  timingsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  timingCol: {
    alignItems: 'center',
    flex: 1,
  },
  timingLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  timingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginVertical: 2,
  },
  timingLoad: {
    fontSize: 10,
    fontWeight: '600',
  },
});
