// HomeScreen Component
// Implements exact visual aesthetic of reference screenshot:
// Dark pine green header, time-based greeting, profile/settings circle button,
// 2-column MRT line status grid, grouped destinations, and bottom service messages.

import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import { Settings, AlertTriangle } from 'lucide-react';
import SearchBar from '../components/SearchBar';
import MetroStatusCard from '../components/MetroStatusCard';
import NearbyBusCard from '../components/NearbyBusCard';
import PopularDestinations from '../components/PopularDestinations';
import ServiceMessages from '../components/ServiceMessages';
import { searchLocations, searchSingaporeLocationsLive } from '../data/postalLookup';
import { POPULAR_DESTINATIONS } from '../data/destinations';
import { THEME } from '../theme/colors';

// Compute time-based greeting
function getGreeting() {
  try {
    const now = new Date();
    const hour = parseInt(
      now.toLocaleTimeString('en-SG', {
        timeZone: 'Asia/Singapore',
        hour: 'numeric',
        hour12: false,
      }),
      10
    );
    if (hour >= 5 && hour < 12) return 'Good morning';
    if (hour >= 12 && hour < 18) return 'Good afternoon';
    return 'Good evening';
  } catch (e) {
    return 'Good morning';
  }
}

export default function HomeScreen({
  commuterOrigin,
  trainAlerts,
  crowdLevels,
  recentSearches,
  onSelectDestination,
  onClearRecent,
  onRequestGps,
  isGpsActive,
  onOpenSettings,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(POPULAR_DESTINATIONS);
  const [isSearchingOnline, setIsSearchingOnline] = useState(false);
  const inputRef = useRef(null);

  const greeting = getGreeting();
  const isDisrupted = trainAlerts?.Status === 2;

  // Instant local results + debounced live OneMap/OSM search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length === 0) {
      setSearchResults(POPULAR_DESTINATIONS);
      setIsSearchingOnline(false);
      return;
    }

    const clean = searchQuery.trim();
    const local = searchLocations(clean);
    setSearchResults(local);

    if (clean.length >= 2) {
      setIsSearchingOnline(true);
      const timer = setTimeout(async () => {
        try {
          const live = await searchSingaporeLocationsLive(clean);
          setSearchResults(live);
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
  }, [searchQuery]);

  const handleClear = () => {
    setSearchQuery('');
    setSearchResults(POPULAR_DESTINATIONS);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  return (
    <View style={styles.container}>
      {/* Dark Forest Teal Top Header */}
      <View style={styles.heroHeader}>
        <View style={styles.greetingRow}>
          <View>
            <Text style={styles.greetingText}>{greeting}</Text>
            <View style={styles.networkStatusPill}>
              <View style={[styles.networkStatusDot, isDisrupted && styles.networkStatusDotDisrupted]} />
              <Text style={styles.networkStatusText}>
                {isDisrupted ? 'Disruption reported on MRT network' : 'All MRT lines operational'}
              </Text>
            </View>
          </View>
          <TouchableOpacity
            style={styles.profileCircle}
            onPress={onOpenSettings}
            activeOpacity={0.7}
            accessibilityLabel="Settings"
            title="Settings & Profile"
          >
            <Settings size={18} color="#FFFFFF" strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        {/* Embedded SearchBar */}
        <View style={styles.searchWrapper}>
          <SearchBar
            inputRef={inputRef}
            value={searchQuery}
            onChangeText={setSearchQuery}
            onClear={handleClear}
            onRequestGps={onRequestGps}
            isGpsActive={isGpsActive}
          />
        </View>
      </View>

      {/* Online Geocoding Status Indicator */}
      {isSearchingOnline && (
        <View style={styles.searchingRow}>
          <ActivityIndicator size="small" color={THEME.forestDark} />
          <Text style={styles.searchingText}>Searching Singapore locations & postal codes...</Text>
        </View>
      )}

      {/* Main Content Area */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* MAJOR DISRUPTION NOTICE: Shown at the TOP only when there is a major disruption */}
        {isDisrupted && (
          <View style={styles.majorDisruptionBanner}>
            <View style={styles.disruptionTop}>
              <AlertTriangle size={16} color="#DC2626" strokeWidth={2.4} />
              <Text style={styles.disruptionTitle}>MAJOR DISRUPTION DETECTED</Text>
            </View>
            <Text style={styles.disruptionDesc}>
              {trainAlerts?.Message?.[0]?.Content ||
                'North-South Line services disrupted between Jurong East and Choa Chu Kang. Free bus bridging active.'}
            </Text>
          </View>
        )}

        {searchQuery.length > 0 ? (
          <PopularDestinations
            searchResults={searchResults}
            isSearching={true}
            recentSearches={recentSearches}
            onSelectDestination={onSelectDestination}
            onClearRecent={onClearRecent}
          />
        ) : (
          <>
            {/* 2-Column MRT Line Status Grid */}
            <MetroStatusCard
              trainAlerts={trainAlerts}
              onSelectLine={(line) => {
                setSearchQuery(line.searchKey || line.id);
              }}
            />

            {/* Real-Time Nearby Buses & Arrivals */}
            <NearbyBusCard
              commuterOrigin={commuterOrigin}
              onSelectDestination={onSelectDestination}
            />

            {/* Destinations: Recent & Suggested */}
            <PopularDestinations
              searchResults={POPULAR_DESTINATIONS}
              isSearching={false}
              recentSearches={recentSearches}
              onSelectDestination={onSelectDestination}
              onClearRecent={onClearRecent}
            />

            {/* SERVICE MESSAGES: Shown at the bottom, unless there is a major disruption */}
            {!isDisrupted && (
              <ServiceMessages
                messages={
                  trainAlerts?.Message?.length > 0
                    ? trainAlerts.Message.map((m, i) => ({
                        id: `msg_${i}`,
                        title: m.Line ? `${m.Line} service notice` : 'Track Advisory',
                        timeAgo: m.CreatedDate || 'Live',
                        content: m.Content,
                      }))
                    : undefined
                }
              />
            )}
          </>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  heroHeader: {
    backgroundColor: THEME.forestDark, // Rich dark forest green
    paddingTop: 16,
    paddingHorizontal: 16,
    paddingBottom: 16,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  greetingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  greetingText: {
    fontSize: 26,
    fontWeight: '700',
    color: '#FFFFFF',
    letterSpacing: -0.4,
  },
  networkStatusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(255, 255, 255, 0.12)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
    alignSelf: 'flex-start',
    marginTop: 4,
  },
  networkStatusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#34D399',
  },
  networkStatusDotDisrupted: {
    backgroundColor: '#F87171',
  },
  networkStatusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#F1F5F9',
    letterSpacing: -0.1,
  },
  profileCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchWrapper: {
    marginTop: 2,
  },
  searchingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 6,
    gap: 8,
    backgroundColor: '#E6F4F1',
    borderBottomWidth: 1,
    borderBottomColor: '#D1EBE6',
  },
  searchingText: {
    fontSize: 11,
    color: THEME.forestDark,
    fontWeight: '600',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  majorDisruptionBanner: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FCA5A5',
    borderWidth: 1.5,
    borderRadius: 12,
    marginHorizontal: 16,
    marginTop: 12,
    marginBottom: 4,
    padding: 12,
  },
  disruptionTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  disruptionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#B91C1C',
    letterSpacing: 0.4,
  },
  disruptionDesc: {
    fontSize: 12,
    color: '#7F1D1D',
    lineHeight: 16,
    fontWeight: '500',
  },
});
