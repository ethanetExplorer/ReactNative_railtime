// Kiasu Transit SG - Smart Commuter Companion Mobile Web App
// Built with React Native for Web & Expo SDK 57.
// Proactive decision support for Singapore planned and unplanned events.

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import {
  StyleSheet,
  View,
  SafeAreaView,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import RouteDiagramScreen from './src/screens/RouteDiagramScreen';
import SettingsModal from './src/components/SettingsModal';
import { SCENARIOS } from './src/data/scenarios';
import { POPULAR_DESTINATIONS } from './src/data/destinations';
import { DEFAULT_COMMUTER_ORIGIN, requestUserLocation } from './src/services/locationService';
import { COMMUTER_PERSONAS, getPersonaById } from './src/data/personas';
import {
  setActiveScenario,
  getTrainServiceAlerts,
  getLiveApiMode,
} from './src/services/ltaService';
import { planCommuteRoute } from './src/services/routingEngine';

const RECENT_STORAGE_KEY = 'KIASU_TRANSIT_RECENT_SEARCHES_V1';

export default function App() {
  const { width } = useWindowDimensions();
  const isMobileViewport = width <= 500;

  // Navigation & Screen State ('home' | 'route_diagram')
  const [currentScreen, setCurrentScreen] = useState('home');

  // Scenario State
  const [activeScenarioId, setActiveScenarioId] = useState('NSL_UNPLANNED_FAULT');
  const [isLiveApi, setIsLiveApi] = useState(false);

  // Commuter Persona State ('none' | 'persona_alex' | 'persona_kay')
  const [activePersonaId, setActivePersonaId] = useState('none');
  const [simulatedTime, setSimulatedTime] = useState(null);
  const [routePreference, setRoutePreference] = useState('fastest');

  // Train Service Alerts & Crowding
  const [trainAlerts, setTrainAlerts] = useState(SCENARIOS.NSL_UNPLANNED_FAULT.trainServiceAlerts);

  // Locations & Routing
  const [commuterOrigin, setCommuterOrigin] = useState(DEFAULT_COMMUTER_ORIGIN);
  const [isGpsActive, setIsGpsActive] = useState(false);
  const [selectedDestination, setSelectedDestination] = useState(null);

  // Recent Searches
  const [recentSearches, setRecentSearches] = useState([]);

  // Settings Modal (incorporating disruption simulation menu & LTA DataMall credentials)
  const [isSettingsModalOpen, setIsSettingsModalOpen] = useState(false);

  // Load saved recent searches & active scenario on mount
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        const savedRecents = window.localStorage.getItem(RECENT_STORAGE_KEY);
        if (savedRecents) {
          setRecentSearches(JSON.parse(savedRecents));
        } else {
          // Pre-populate with a few popular hubs
          setRecentSearches([
            POPULAR_DESTINATIONS[0], // Raffles Place
            POPULAR_DESTINATIONS[3], // Orchard
          ]);
        }
      } catch (e) {
        console.warn('Failed reading localStorage recents', e);
      }
    }
    if (typeof document !== 'undefined') {
      try {
        document.documentElement.style.overflowX = 'hidden';
        document.body.style.overflowX = 'hidden';
        document.body.style.margin = '0';
        document.body.style.padding = '0';
      } catch (e) {}
    }
    setIsLiveApi(getLiveApiMode());

    // Auto-detect user's actual location on mount (replacing Bukit Batok placeholder)
    requestUserLocation().then(res => {
      if (res.success && res.location) {
        setCommuterOrigin(res.location);
        setIsGpsActive(true);
      }
    }).catch(() => {});
  }, []);

  // Sync active scenario
  useEffect(() => {
    setActiveScenario(activeScenarioId);
    getTrainServiceAlerts().then(alerts => setTrainAlerts(alerts));
  }, [activeScenarioId, isLiveApi]);

  // Handle GPS location request
  const handleRequestGps = useCallback(async () => {
    const res = await requestUserLocation();
    if (res.success) {
      setCommuterOrigin(res.location);
      setIsGpsActive(true);
    } else {
      setCommuterOrigin(res.location);
      setIsGpsActive(false);
    }
  }, []);

  // Handle selecting a persona (Alex, Kay, None)
  const handleSelectPersona = useCallback((personaId) => {
    setActivePersonaId(personaId);
    const persona = getPersonaById(personaId);

    if (personaId === 'none' || !persona || !persona.origin) {
      // Revert to user's actual GPS location and current live time
      setSimulatedTime(null);
      setRoutePreference('fastest');
      handleRequestGps();
    } else {
      // Apply persona origin, destination, simulated time, and route preference
      setCommuterOrigin(persona.origin);
      setSelectedDestination(persona.destination);
      setSimulatedTime(persona.simulatedTime);
      setRoutePreference(persona.preference || 'fastest');
      setIsGpsActive(false);
      setCurrentScreen('route_diagram');
      setIsSettingsModalOpen(false);
    }
  }, [handleRequestGps]);

  // Handle selecting a destination
  const handleSelectDestination = useCallback((destination) => {
    setSelectedDestination(destination);
    setCurrentScreen('route_diagram');

    // Update recent searches
    setRecentSearches((prev) => {
      const filtered = prev.filter((item) => item.id !== destination.id);
      const updated = [destination, ...filtered].slice(0, 6);
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.setItem(RECENT_STORAGE_KEY, JSON.stringify(updated));
        } catch (e) {}
      }
      return updated;
    });
  }, []);

  // Handle clearing recent searches
  const handleClearRecent = useCallback(() => {
    setRecentSearches([]);
    if (typeof window !== 'undefined' && window.localStorage) {
      try {
        window.localStorage.removeItem(RECENT_STORAGE_KEY);
      } catch (e) {}
    }
  }, []);

  // Compute the single best route with simulated time and preference
  const currentScenario = SCENARIOS[activeScenarioId] || SCENARIOS.NSL_UNPLANNED_FAULT;
  const routePlan = useMemo(() => {
    if (!selectedDestination) return null;
    return planCommuteRoute(
      commuterOrigin,
      selectedDestination,
      currentScenario,
      routePreference,
      simulatedTime
    );
  }, [commuterOrigin, selectedDestination, currentScenario, routePreference, simulatedTime]);

  // Sync document theme-color for iOS Safari / Chrome top bar
  useEffect(() => {
    if (typeof document !== 'undefined') {
      try {
        let meta = document.querySelector('meta[name="theme-color"]');
        if (!meta) {
          meta = document.createElement('meta');
          meta.name = 'theme-color';
          document.head.appendChild(meta);
        }
        meta.content = '#083B38';
      } catch (e) {}
    }
  }, []);

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: currentScreen === 'home' ? '#083B38' : '#083B38' }]}>
      <StatusBar barStyle="light-content" backgroundColor="#083B38" />

      {/* Main Adaptive App Container (No phone borders) */}
      <View style={styles.appContainer}>
        {/* Main Content Area (Homepage vs Route Diagram View) */}
        <View style={styles.contentArea}>
          {currentScreen === 'home' ? (
            <HomeScreen
              commuterOrigin={commuterOrigin}
              trainAlerts={trainAlerts}
              crowdLevels={currentScenario.pcdCrowdLevels}
              recentSearches={recentSearches}
              onSelectDestination={handleSelectDestination}
              onClearRecent={handleClearRecent}
              onRequestGps={handleRequestGps}
              isGpsActive={isGpsActive}
              onOpenSettings={() => setIsSettingsModalOpen(true)}
            />
          ) : (
            <RouteDiagramScreen
              origin={commuterOrigin}
              destination={selectedDestination}
              onUpdateOrigin={setCommuterOrigin}
              onUpdateDestination={setSelectedDestination}
              routePlan={routePlan}
              onBack={() => setCurrentScreen('home')}
            />
          )}
        </View>

        {/* Settings Modal (Regular Places + Disruption Simulation + LTA DataMall Keys) */}
        <SettingsModal
          visible={isSettingsModalOpen}
          activeScenarioId={activeScenarioId}
          onSelectScenario={(newId) => setActiveScenarioId(newId)}
          activePersonaId={activePersonaId}
          onSelectPersona={handleSelectPersona}
          onClose={() => setIsSettingsModalOpen(false)}
          onConfigChanged={({ liveMode }) => setIsLiveApi(liveMode)}
          onSelectDestination={handleSelectDestination}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    width: '100%',
    height: '100%',
  },
  appContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
    height: '100%',
    overflow: 'hidden',
  },
  contentArea: {
    flex: 1,
    width: '100%',
    overflow: 'hidden',
  },
});
