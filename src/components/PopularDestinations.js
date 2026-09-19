// PopularDestinations Component
// Compact capsule chips for Recent and Suggested destinations.
// Horizontally scrollable rows, minimal height, native typography.

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { Clock, Star, MapPin, ChevronRight } from 'lucide-react';
import { THEME } from '../theme/colors';

// ─── Capsule chip for non-searching mode ─────────────────────────────────────
function DestCapsule({ item, icon, onPress }) {
  return (
    <TouchableOpacity
      style={styles.capsule}
      onPress={() => onPress(item)}
      activeOpacity={0.65}
    >
      <View style={styles.capsuleIcon}>{icon}</View>
      <Text style={styles.capsuleText} numberOfLines={1}>
        {item.shortName || item.name}
      </Text>
    </TouchableOpacity>
  );
}

// ─── Full list row for search mode ───────────────────────────────────────────
function SearchRow({ dest, isLast, onPress }) {
  return (
    <TouchableOpacity
      style={[styles.row, !isLast && styles.rowDivider]}
      onPress={() => onPress(dest)}
      activeOpacity={0.65}
    >
      <View style={styles.iconCircle}>
        <MapPin size={13} color="#FFFFFF" />
      </View>

      <View style={styles.rowContent}>
        <View style={styles.titleLine}>
          <Text style={styles.destName} numberOfLines={1}>
            {dest.shortName || dest.name}
          </Text>
          {dest.postalCode ? (
            <View style={styles.postalTag}>
              <Text style={styles.postalTagText}>S({dest.postalCode})</Text>
            </View>
          ) : null}
        </View>
        <Text style={styles.destSubtext} numberOfLines={1}>
          {dest.address || dest.category || 'Singapore'}
        </Text>
      </View>

      <ChevronRight size={15} color="#CBD5E1" />
    </TouchableOpacity>
  );
}

export default function PopularDestinations({
  searchResults = [],
  isSearching = false,
  recentSearches = [],
  onSelectDestination,
  onClearRecent,
}) {
  // ── Search mode ────────────────────────────────────────────────────────────
  if (isSearching) {
    return (
      <View style={styles.container}>
        <View style={styles.mainHeader}>
          <Text style={styles.headerTitle}>RESULTS</Text>
          <Text style={styles.headerRightText}>{searchResults.length} places</Text>
        </View>

        {searchResults.length === 0 ? (
          <View style={styles.emptyCard}>
            <MapPin size={20} color="#94A3B8" />
            <Text style={styles.emptyTitle}>No matching address found</Text>
            <Text style={styles.emptySubtitle}>Try a postal code (e.g. 048616) or station name.</Text>
          </View>
        ) : (
          <View style={styles.groupedCard}>
            {searchResults.map((dest, idx) => (
              <SearchRow
                key={dest.id || idx}
                dest={dest}
                isLast={idx === searchResults.length - 1}
                onPress={onSelectDestination}
              />
            ))}
          </View>
        )}
      </View>
    );
  }

  // ── Default mode: capsule chips ────────────────────────────────────────────
  const recents = recentSearches.length > 0
    ? recentSearches.slice(0, 6)
    : searchResults.slice(0, 3);
  const suggested = searchResults.slice(recents === recentSearches.slice(0, 6) ? 0 : 3, 9);

  // Avoid showing suggested if it duplicates recents
  const recentIds = new Set(recents.map(r => r.id));
  const filteredSuggested = suggested.filter(s => !recentIds.has(s.id)).slice(0, 6);

  return (
    <View style={styles.container}>

      {/* RECENT row */}
      {recents.length > 0 && (
        <View style={styles.chipSection}>
          <View style={styles.chipSectionHeader}>
            <Text style={styles.subgroupTitle}>RECENT</Text>
            {onClearRecent && recentSearches.length > 0 && (
              <TouchableOpacity onPress={onClearRecent} activeOpacity={0.7}>
                <Text style={styles.clearText}>Clear</Text>
              </TouchableOpacity>
            )}
          </View>
          <View style={styles.capsuleGrid}>
            {recents.slice(0, 4).map((item, idx) => (
              <DestCapsule
                key={item.id || idx}
                item={item}
                icon={<Clock size={12} color={THEME.forestDark} strokeWidth={2.2} />}
                onPress={onSelectDestination}
              />
            ))}
          </View>
        </View>
      )}

      {/* SUGGESTED row */}
      {filteredSuggested.length > 0 && (
        <View style={styles.chipSection}>
          <View style={styles.chipSectionHeader}>
            <Text style={styles.subgroupTitle}>SUGGESTED</Text>
          </View>
          <View style={styles.capsuleGrid}>
            {filteredSuggested.slice(0, 4).map((item, idx) => (
              <DestCapsule
                key={item.id || idx}
                item={item}
                icon={<Star size={12} color={THEME.forestDark} strokeWidth={2.2} />}
                onPress={onSelectDestination}
              />
            ))}
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 10,
  },

  // ── Section headers ──────────────────────────────────────────────────────
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  headerRightText: {
    fontSize: 11,
    color: '#94A3B8',
  },

  chipSection: {
    marginBottom: 10,
  },
  chipSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  subgroupTitle: {
    fontSize: 11,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  clearText: {
    fontSize: 11,
    color: '#94A3B8',
    fontWeight: '500',
  },

  // ── Capsule chips ────────────────────────────────────────────────────────
  capsuleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 7,
  },
  capsule: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 11,
    paddingVertical: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  capsuleIcon: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: THEME.forestLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  capsuleText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E293B',
  },

  // ── Search mode list rows ─────────────────────────────────────────────────
  groupedCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 11,
    paddingHorizontal: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.forestDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    flexShrink: 0,
  },
  rowContent: {
    flex: 1,
    paddingRight: 4,
    minWidth: 0,
  },
  titleLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'nowrap',
  },
  destName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0F172A',
    flexShrink: 1,
  },
  destSubtext: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 1,
  },
  postalTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
    flexShrink: 0,
  },
  postalTagText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },

  // ── Empty state ───────────────────────────────────────────────────────────
  emptyCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    gap: 6,
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    textAlign: 'center',
  },
  emptySubtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 17,
  },
});
