// Native iOS Status Bar Component
// Renders live Singapore time, Dynamic Island pill, and system indicators (Signal, Wi-Fi, Battery)

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Wifi } from 'lucide-react';

export default function NativeStatusBar({ darkContent = true }) {
  const [timeStr, setTimeStr] = useState('09:41');

  useEffect(() => {
    const updateTime = () => {
      try {
        const now = new Date();
        const formatted = now.toLocaleTimeString('en-SG', {
          timeZone: 'Asia/Singapore',
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
        });
        setTimeStr(formatted);
      } catch (e) {
        setTimeStr('09:41');
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 10000);
    return () => clearInterval(interval);
  }, []);

  const textColor = darkContent ? '#0F172A' : '#FFFFFF';

  return (
    <View style={styles.statusBar}>
      {/* Left: Live Time */}
      <View style={styles.timeContainer}>
        <Text style={[styles.timeText, { color: textColor }]}>{timeStr}</Text>
      </View>

      {/* Center: Dynamic Island Pill */}
      <View style={styles.dynamicIsland}>
        <View style={styles.cameraLens} />
        <View style={styles.sensorDot} />
      </View>

      {/* Right: Cellular, Wi-Fi, Battery */}
      <View style={styles.statusIcons}>
        {/* Cellular 4 bars */}
        <View style={styles.cellularBars}>
          <View style={[styles.bar, styles.bar1, { backgroundColor: textColor }]} />
          <View style={[styles.bar, styles.bar2, { backgroundColor: textColor }]} />
          <View style={[styles.bar, styles.bar3, { backgroundColor: textColor }]} />
          <View style={[styles.bar, styles.bar4, { backgroundColor: textColor }]} />
        </View>

        {/* Wi-Fi */}
        <Wifi size={14} color={textColor} strokeWidth={2.4} />

        {/* Battery with percentage fill */}
        <View style={[styles.batteryShell, { borderColor: textColor }]}>
          <View style={[styles.batteryFill, { backgroundColor: textColor }]} />
          <View style={[styles.batteryCap, { backgroundColor: textColor }]} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  statusBar: {
    height: 38,
    width: '100%',
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    zIndex: 100,
    userSelect: 'none',
  },
  timeContainer: {
    width: 60,
    justifyContent: 'center',
  },
  timeText: {
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: -0.2,
  },
  dynamicIsland: {
    width: 104,
    height: 22,
    borderRadius: 11,
    backgroundColor: '#000000',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingRight: 10,
    gap: 6,
  },
  cameraLens: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#171717',
    borderWidth: 1,
    borderColor: '#262626',
  },
  sensorDot: {
    width: 3.5,
    height: 3.5,
    borderRadius: 2,
    backgroundColor: '#0a0a0a',
  },
  statusIcons: {
    width: 65,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    gap: 6,
  },
  cellularBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 1.5,
    height: 10,
  },
  bar: {
    width: 2.5,
    borderRadius: 1,
  },
  bar1: { height: 4 },
  bar2: { height: 6 },
  bar3: { height: 8 },
  bar4: { height: 10 },
  batteryShell: {
    width: 20,
    height: 10,
    borderRadius: 3,
    borderWidth: 1.2,
    padding: 1,
    position: 'relative',
    justifyContent: 'center',
  },
  batteryFill: {
    width: '80%',
    height: '100%',
    borderRadius: 1.5,
  },
  batteryCap: {
    position: 'absolute',
    right: -3,
    width: 1.5,
    height: 4,
    borderRadius: 0.8,
    top: 2,
  },
});

