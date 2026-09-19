// iOS Native Home Indicator Component
// Signature pill bar at the bottom of modern mobile devices

import React from 'react';
import { StyleSheet, View } from 'react-native';

export default function HomeIndicator({ light = false }) {
  return (
    <View style={styles.container}>
      <View style={[styles.bar, light && styles.barLight]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    userSelect: 'none',
  },
  bar: {
    width: 134,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#0F172A25',
  },
  barLight: {
    backgroundColor: '#FFFFFF60',
  },
});

