// MetroStatusCard Component
// Unified MRT + LRT Line Status Grid with disruption opacity and bridging bus indicator.

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { RotateCw, Bus } from 'lucide-react';
import { THEME } from '../theme/colors';

const ALL_LINES = [
  // MRT Lines
  { id: 'NSL', name: 'North-South', color: '#D42E12', alertCodes: ['NSL'], type: 'mrt' },
  { id: 'EWL', name: 'East-West', color: '#009645', alertCodes: ['EWL'], type: 'mrt' },
  { id: 'NEL', name: 'North East', color: '#9900AA', alertCodes: ['NEL'], type: 'mrt' },
  { id: 'CCL', name: 'Circle', color: '#FA9E0D', alertCodes: ['CCL'], type: 'mrt' },
  { id: 'DTL', name: 'Downtown', color: '#005EC4', alertCodes: ['DTL'], type: 'mrt' },
  { id: 'TEL', name: 'Thomson-EC', color: '#9D5B25', alertCodes: ['TEL'], type: 'mrt' },
  // LRT Lines
  { id: 'BP', name: 'Bt Panjang', color: '#748477', alertCodes: ['BPL', 'BP'], type: 'lrt', searchKey: 'Bukit Panjang' },
  { id: 'SK', name: 'Sengkang', color: '#748477', alertCodes: ['SKLRT', 'STL', 'SK', 'SLRT'], type: 'lrt', searchKey: 'Sengkang' },
  { id: 'PG', name: 'Punggol', color: '#748477', alertCodes: ['PGLRT', 'PTL', 'PG', 'PLRT'], type: 'lrt', searchKey: 'Punggol' },
];

export default function MetroStatusCard({
  trainAlerts,
  onSelectLine,
}) {
  const affectedSegments = trainAlerts?.AffectedSegments || [];

  // Check if any disrupted segment has bridging buses
  const hasBridgingBus = affectedSegments.some(
    (s) => s.FreePublicBus || s.FreeMRTShuttle
  );
  // Build a brief bridging bus summary
  const bridgingLines = affectedSegments
    .filter((s) => s.FreePublicBus || s.FreeMRTShuttle)
    .map((s) => s.Line);

  return (
    <View style={styles.container}>
      {/* Section Header */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>LINE STATUS</Text>
        <View style={styles.liveIndicator}>
          <RotateCw size={11} color="#64748B" />
          <Text style={styles.liveText}>Live (1m ago)</Text>
        </View>
      </View>

      {/* Unified Grid */}
      <View style={styles.grid}>
        {ALL_LINES.map((line) => {
          const isAffected = affectedSegments.some((s) =>
            line.alertCodes.includes(s.Line)
          );
          const segment = isAffected
            ? affectedSegments.find((s) => line.alertCodes.includes(s.Line))
            : null;
          const hasBridging = segment && (segment.FreePublicBus || segment.FreeMRTShuttle);
          const isLrt = line.type === 'lrt';

          return (
            <TouchableOpacity
              key={line.id}
              style={[
                styles.lineCard,
                isAffected ? styles.cardDisrupted : styles.cardNormal,
                isAffected && { opacity: 0.6 },
              ]}
              onPress={() => onSelectLine && onSelectLine(line)}
              activeOpacity={0.7}
            >
              <View style={styles.lineLeft}>
                <View style={[styles.colorDot, { backgroundColor: line.color }]} />
                <View>
                  <Text style={styles.lineCode}>{line.id}</Text>
                  {isLrt && <Text style={styles.lrtTag}>LRT</Text>}
                </View>
              </View>

              <View style={styles.lineRight}>
                {isAffected && hasBridging && (
                  <View style={styles.bridgingIcon}>
                    <Bus size={10} color="#DC2626" />
                  </View>
                )}
                <View
                  style={[
                    styles.statusBadge,
                    isAffected ? styles.badgeDisrupted : styles.badgeNormal,
                  ]}
                >
                  <View
                    style={[
                      styles.statusDot,
                      isAffected ? styles.statusDotDisrupted : styles.statusDotNormal,
                    ]}
                  />
                  <Text
                    style={[
                      styles.statusText,
                      isAffected ? styles.statusTextDisrupted : styles.statusTextNormal,
                    ]}
                  >
                    {isAffected ? 'Delayed' : 'Normal'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Bridging Bus Banner (shown when any line has active bridging) */}
      {hasBridgingBus && (
        <View style={styles.bridgingBanner}>
          <Bus size={13} color="#DC2626" />
          <Text style={styles.bridgingText}>
            Free bridging bus & MRT shuttle active
            {bridgingLines.length > 0 ? ` (${bridgingLines.join(', ')})` : ''}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 14,
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  liveIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  liveText: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '500',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  lineCard: {
    flexBasis: '31%',
    flexGrow: 1,
    flexShrink: 0,
    minWidth: 100,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 9,
    borderRadius: 12,
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  cardNormal: {
    borderColor: '#E2E8F0',
  },
  cardDisrupted: {
    borderColor: '#FCA5A5',
    backgroundColor: '#FFF5F5',
  },
  lineLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  colorDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  lineCode: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.2,
  },
  lrtTag: {
    fontSize: 8,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.3,
    marginTop: -1,
  },
  lineRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  bridgingIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#FEF2F2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 8,
  },
  badgeNormal: {
    backgroundColor: '#F0FDF4',
  },
  badgeDisrupted: {
    backgroundColor: '#FEF2F2',
  },
  statusDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
  },
  statusDotNormal: {
    backgroundColor: '#16A34A',
  },
  statusDotDisrupted: {
    backgroundColor: '#DC2626',
  },
  statusText: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.1,
  },
  statusTextNormal: {
    color: '#15803D',
  },
  statusTextDisrupted: {
    color: '#DC2626',
  },
  bridgingBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 8,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 7,
  },
  bridgingText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#991B1B',
    flexShrink: 1,
  },
});
