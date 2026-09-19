// SearchBar Component
// Matches reference screenshot aesthetic: white rounded card with magnifying glass icon.

import React from 'react';
import { StyleSheet, View, TextInput, TouchableOpacity } from 'react-native';
import { Search, X, LocateFixed } from 'lucide-react';
import { THEME } from '../theme/colors';

export default function SearchBar({
  value,
  onChangeText,
  onFocus,
  onClear,
  onRequestGps,
  isGpsActive,
  inputRef,
}) {
  return (
    <View style={styles.searchContainer}>
      <Search size={17} color="#94A3B8" strokeWidth={2.2} style={styles.searchIcon} />

      <TextInput
        ref={inputRef}
        style={styles.input}
        placeholder="Search places, MRT stations or addresses"
        placeholderTextColor="#94A3B8"
        value={value}
        onChangeText={onChangeText}
        onFocus={onFocus}
        autoCorrect={false}
        returnKeyType="search"
      />

      {value?.length > 0 && (
        <TouchableOpacity style={styles.clearBtn} onPress={onClear} activeOpacity={0.7}>
          <View style={styles.clearCircle}>
            <X size={10} color="#FFFFFF" strokeWidth={2.6} />
          </View>
        </TouchableOpacity>
      )}

      <TouchableOpacity
        style={[styles.gpsBtn, isGpsActive && styles.gpsBtnActive]}
        onPress={onRequestGps}
        activeOpacity={0.7}
        title="Use current GPS location"
      >
        <LocateFixed size={15} color={isGpsActive ? THEME.forestDark : '#94A3B8'} strokeWidth={2.2} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    height: 46,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    height: 42,
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '500',
    outlineStyle: 'none',
  },
  clearBtn: {
    padding: 4,
    marginLeft: 2,
  },
  clearCircle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#94A3B8',
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsBtn: {
    width: 30,
    height: 30,
    borderRadius: 8,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginLeft: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  gpsBtnActive: {
    backgroundColor: THEME.forestLight,
    borderColor: '#BAE6FD',
  },
});
