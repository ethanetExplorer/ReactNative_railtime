// BottomNavBar Component
// Native 4-tab bottom navigation bar matching the reference screenshot aesthetic.

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { Home, Map, Bell, User } from 'lucide-react';
import { THEME } from '../theme/colors';

export default function BottomNavBar({
  activeTab = 'home',
  hasAlerts = false,
  onSelectTab,
  onOpenSettings,
}) {
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab && onSelectTab('home')}
        activeOpacity={0.7}
      >
        <Home
          size={20}
          color={activeTab === 'home' ? THEME.forestDark : '#94A3B8'}
          strokeWidth={activeTab === 'home' ? 2.5 : 2}
        />
        <Text style={[styles.tabLabel, activeTab === 'home' && styles.tabLabelActive]}>
          Home
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab && onSelectTab('planner')}
        activeOpacity={0.7}
      >
        <Map
          size={20}
          color={activeTab === 'planner' ? THEME.forestDark : '#94A3B8'}
          strokeWidth={activeTab === 'planner' ? 2.5 : 2}
        />
        <Text style={[styles.tabLabel, activeTab === 'planner' && styles.tabLabelActive]}>
          Planner
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={() => onSelectTab && onSelectTab('alerts')}
        activeOpacity={0.7}
      >
        <View style={styles.iconWrapper}>
          <Bell
            size={20}
            color={activeTab === 'alerts' ? THEME.forestDark : '#94A3B8'}
            strokeWidth={activeTab === 'alerts' ? 2.5 : 2}
          />
          {hasAlerts && <View style={styles.alertDot} />}
        </View>
        <Text style={[styles.tabLabel, activeTab === 'alerts' && styles.tabLabelActive]}>
          Alerts
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.tabItem}
        onPress={onOpenSettings}
        activeOpacity={0.7}
      >
        <User
          size={20}
          color="#94A3B8"
          strokeWidth={2}
        />
        <Text style={styles.tabLabel}>
          Profile
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    height: 58,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: 8,
    userSelect: 'none',
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    gap: 3,
  },
  tabLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: '#94A3B8',
  },
  tabLabelActive: {
    color: THEME.forestDark,
    fontWeight: '700',
  },
  iconWrapper: {
    position: 'relative',
  },
  alertDot: {
    position: 'absolute',
    top: -1,
    right: -2,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#DC2626',
  },
});

