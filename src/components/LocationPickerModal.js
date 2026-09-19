// LocationPickerModal Component
// Allows commuters to edit their starting point or destination with live search,
// 6-digit Singapore postal code geocoding, and real neighborhood names (no generic "Your current location").

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import {
  X,
  Search,
  MapPin,
  LocateFixed,
  ChevronRight,
  Clock,
} from 'lucide-react';
import { searchLocations, searchSingaporeLocationsLive } from '../data/postalLookup';
import { POPULAR_DESTINATIONS } from '../data/destinations';
import { requestUserLocation } from '../services/locationService';
import { THEME } from '../theme/colors';

export default function LocationPickerModal({
  visible,
  mode = 'origin', // 'origin' | 'destination'
  currentLocation,
  onSelect,
  onClose,
}) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState(POPULAR_DESTINATIONS);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (visible) {
      setQuery('');
      setResults(POPULAR_DESTINATIONS);
      setIsSearchingOnline(false);
      setTimeout(() => {
        if (inputRef.current) inputRef.current.focus();
      }, 100);
    }
  }, [visible]);

  // Live online geocoding + local postal search
  useEffect(() => {
    if (!query || query.trim().length === 0) {
      setResults(POPULAR_DESTINATIONS);
      setIsSearchingOnline(false);
      return;
    }

    const clean = query.trim();
    // 1. Fast local match (stations, landmarks, postal sectors)
    const local = searchLocations(clean);
    setResults(local);

    // 2. Debounced online geocoding
    if (clean.length >= 2) {
      setIsSearchingOnline(true);
      const timer = setTimeout(async () => {
        try {
          const live = await searchSingaporeLocationsLive(clean);
          setResults(live);
        } catch (_e) {
          // Graceful fallback to local results already populated
        } finally {
          setIsSearchingOnline(false);
        }
      }, 250);

      return () => clearTimeout(timer);
    } else {
      setIsSearchingOnline(false);
    }
  }, [query]);

  // Handle GPS location request with real place name
  const handleUseGps = async () => {
    setIsLocating(true);
    try {
      const res = await requestUserLocation();
      if (res && res.location) {
        onSelect(res.location);
        onClose();
      }
    } catch (e) {
      console.warn('GPS location error:', e);
    } finally {
      setIsLocating(false);
    }
  };

  const isOrigin = mode === 'origin';
  const titleText = isOrigin ? 'Edit Starting Point' : 'Edit Destination';

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleRow}>
              <View style={[styles.dotIndicator, isOrigin ? styles.dotOrigin : styles.dotDest]} />
              <Text style={styles.title}>{titleText}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Search Input */}
          <View style={styles.searchBarContainer}>
            <Search size={16} color="#64748B" strokeWidth={2.2} style={styles.searchIcon} />
            <TextInput
              ref={inputRef}
              style={styles.searchInput}
              placeholder="Search Singapore place or 6-digit postal code..."
              placeholderTextColor="#94A3B8"
              value={query}
              onChangeText={setQuery}
              autoCorrect={false}
              returnKeyType="search"
            />
            {query.length > 0 && (
              <TouchableOpacity onPress={() => setQuery('')} style={styles.clearBtn} activeOpacity={0.7}>
                <View style={styles.clearCircle}>
                  <X size={10} color="#FFFFFF" strokeWidth={2.6} />
                </View>
              </TouchableOpacity>
            )}
          </View>

          {/* Quick GPS button with real name */}
          <TouchableOpacity
            style={styles.gpsRow}
            onPress={handleUseGps}
            disabled={isLocating}
            activeOpacity={0.7}
          >
            <View style={styles.gpsIconCircle}>
              {isLocating ? (
                <ActivityIndicator size="small" color={THEME.forestDark} />
              ) : (
                <LocateFixed size={16} color={THEME.forestDark} strokeWidth={2.2} />
              )}
            </View>
            <View style={styles.gpsInfo}>
              <Text style={styles.gpsTitle}>Use Detected GPS Location</Text>
              <Text style={styles.gpsSubtitle}>Identifies actual neighborhood & nearest MRT station</Text>
            </View>
          </TouchableOpacity>

          {/* Online geocoding indicator */}
          {isSearchingOnline && (
            <View style={styles.searchingRow}>
              <ActivityIndicator size="small" color={THEME.forestDark} />
              <Text style={styles.searchingText}>Searching Singapore SLA OneMap & OpenStreetMap...</Text>
            </View>
          )}

          {/* Results List */}
          <ScrollView
            style={styles.listScroll}
            contentContainerStyle={styles.listContent}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Text style={styles.sectionLabel}>
              {query.length > 0 ? 'MATCHING LOCATIONS' : 'POPULAR DESTINATIONS'}
            </Text>

            <View style={styles.resultsGroup}>
              {results.map((item, idx) => {
                const isLast = idx === results.length - 1;
                return (
                  <TouchableOpacity
                    key={item.id || idx}
                    style={[styles.resultRow, !isLast && styles.rowDivider]}
                    onPress={() => {
                      onSelect(item);
                      onClose();
                    }}
                    activeOpacity={0.65}
                  >
                    <View style={styles.pinCircle}>
                      <MapPin size={14} color="#FFFFFF" />
                    </View>

                    <View style={styles.itemInfo}>
                      <View style={styles.itemTop}>
                        <Text style={styles.itemName} numberOfLines={1}>
                          {item.shortName || item.name}
                        </Text>
                        {item.postalCode ? (
                          <View style={styles.postalBadge}>
                            <Text style={styles.postalText}>S({item.postalCode})</Text>
                          </View>
                        ) : null}
                      </View>
                      <Text style={styles.itemAddress} numberOfLines={1}>
                        {item.address || item.category || 'Singapore'}
                      </Text>
                    </View>

                    <ChevronRight size={16} color="#94A3B8" />
                  </TouchableOpacity>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '85%',
    minHeight: '60%',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dotIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  dotOrigin: {
    backgroundColor: '#10B981',
  },
  dotDest: {
    backgroundColor: '#EF4444',
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
    borderRadius: 10,
    height: 42,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 10,
  },
  searchIcon: {
    marginRight: 6,
  },
  searchInput: {
    flex: 1,
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '500',
    outlineStyle: 'none',
  },
  clearBtn: {
    padding: 4,
  },
  clearCircle: {
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    backgroundColor: THEME.forestLight,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1EBE6',
    marginBottom: 10,
    gap: 10,
  },
  gpsIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsInfo: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: THEME.forestText,
  },
  gpsSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 4,
    marginBottom: 6,
  },
  searchingText: {
    fontSize: 11,
    color: THEME.forestDark,
    fontWeight: '600',
  },
  listScroll: {
    flex: 1,
  },
  listContent: {
    paddingBottom: 20,
  },
  sectionLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
    marginBottom: 6,
    marginTop: 4,
  },
  resultsGroup: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    overflow: 'hidden',
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  rowDivider: {
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  pinCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.forestDark,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemInfo: {
    flex: 1,
    paddingRight: 6,
  },
  itemTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  itemName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  postalBadge: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  postalText: {
    fontSize: 10,
    fontWeight: '600',
    color: '#475569',
  },
  itemAddress: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});

