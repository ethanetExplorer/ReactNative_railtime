// Header Component
// Minimal top header: retains only the Settings button aligned to the top-right corner.
// All app title, icon, subtitle, and scenario buttons removed per specification.

import React from 'react';
import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { Settings } from 'lucide-react';

export default function Header({ onOpenSettings }) {
  return (
    <View style={styles.header}>
      <TouchableOpacity
        style={styles.settingsButton}
        onPress={onOpenSettings}
        activeOpacity={0.7}
        accessibilityLabel="Open Settings"
        title="Settings"
      >
        <Settings size={18} color="#475569" strokeWidth={2.2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  settingsButton: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
});
