// RegularPlacesView Component
// A 4-column responsive management view for places the commuter regularly visits:
// 1. User-defined name (e.g., "Office", "Gym")
// 2. Destination venue (with instant search/suggestions)
// 3. Arrive-by time (using device-native time picker input on web, fallbacked cleanly)
// 4. Days of week selector (Mon-Sun pills)
// Includes quick action to plan route or set destination directly.

import React, { useState } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
} from 'react-native';
import {
  MapPin,
  Clock,
  Calendar,
  Plus,
  Trash2,
  Navigation,
  Check,
  Search,
} from 'lucide-react';
import { DAYS_OF_WEEK } from '../data/regularPlaces';
import { searchLocations } from '../data/postalLookup';
import { THEME } from '../theme/colors';

export default function RegularPlacesView({
  places,
  onUpdatePlaces,
  onSelectDestination,
  onClose,
}) {
  const [editingId, setEditingId] = useState(null);
  const [customName, setCustomName] = useState('');
  const [venueSearch, setVenueSearch] = useState('');
  const [selectedVenue, setSelectedVenue] = useState(null);
  const [venueSuggestions, setVenueSuggestions] = useState([]);
  const [arriveBy, setArriveBy] = useState('09:00');
  const [selectedDays, setSelectedDays] = useState(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  const [isAddingNew, setIsAddingNew] = useState(false);

  // Search venues dynamically
  const handleVenueSearchChange = (text) => {
    setVenueSearch(text);
    if (!text || text.trim().length === 0) {
      setVenueSuggestions([]);
      return;
    }
    const res = searchLocations(text.trim());
    setVenueSuggestions(res.slice(0, 5));
  };

  const handleSelectSuggestion = (item) => {
    setSelectedVenue(item);
    setVenueSearch(item.name || item.shortName);
    setVenueSuggestions([]);
  };

  const startAddPlace = () => {
    setIsAddingNew(true);
    setEditingId(null);
    setCustomName('');
    setVenueSearch('');
    setSelectedVenue(null);
    setVenueSuggestions([]);
    setArriveBy('08:30');
    setSelectedDays(['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  };

  const startEditPlace = (place) => {
    setIsAddingNew(false);
    setEditingId(place.id);
    setCustomName(place.customName);
    setVenueSearch(place.venueName);
    setSelectedVenue(place.destinationObj || { name: place.venueName });
    setVenueSuggestions([]);
    setArriveBy(place.arriveBy || '08:30');
    setSelectedDays(place.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri']);
  };

  const toggleDay = (dayKey) => {
    if (selectedDays.includes(dayKey)) {
      if (selectedDays.length > 1) {
        setSelectedDays(selectedDays.filter((d) => d !== dayKey));
      }
    } else {
      setSelectedDays([...selectedDays, dayKey]);
    }
  };

  const handleSavePlace = () => {
    if (!customName.trim()) return;
    const finalVenueName = venueSearch.trim() || 'Singapore';
    const finalVenueObj = selectedVenue || {
      name: finalVenueName,
      shortName: finalVenueName,
      lat: 1.3521,
      lng: 103.8198,
    };

    if (isAddingNew) {
      const newPlace = {
        id: `place_${Date.now()}`,
        customName: customName.trim(),
        venueName: finalVenueName,
        destinationObj: finalVenueObj,
        arriveBy: arriveBy || '09:00',
        days: selectedDays,
      };
      const updated = [...places, newPlace];
      onUpdatePlaces(updated);
    } else if (editingId) {
      const updated = places.map((p) => {
        if (p.id === editingId) {
          return {
            ...p,
            customName: customName.trim(),
            venueName: finalVenueName,
            destinationObj: finalVenueObj,
            arriveBy: arriveBy || '09:00',
            days: selectedDays,
          };
        }
        return p;
      });
      onUpdatePlaces(updated);
    }

    // Reset editor
    setIsAddingNew(false);
    setEditingId(null);
  };

  const handleDeletePlace = (id) => {
    const updated = places.filter((p) => p.id !== id);
    onUpdatePlaces(updated);
    if (editingId === id) {
      setEditingId(null);
    }
  };

  const handleNavigateToPlace = (place) => {
    if (place.destinationObj && onSelectDestination) {
      onSelectDestination(place.destinationObj);
      if (onClose) onClose();
    }
  };

  return (
    <View style={styles.container}>
      {/* Table Header Bar & Add Button */}
      <View style={styles.topControlRow}>
        <View style={styles.headerInfo}>
          <Text style={styles.tableTitle}>Regular Commute Schedule</Text>
          <Text style={styles.tableSubtitle}>
            Configure standard arrival targets and active travel days
          </Text>
        </View>

        {!isAddingNew && !editingId && (
          <TouchableOpacity
            style={styles.addBtn}
            onPress={startAddPlace}
            activeOpacity={0.8}
          >
            <Plus size={14} color="#FFFFFF" strokeWidth={2.4} />
            <Text style={styles.addBtnText}>Add Place</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Editor Modal/Panel when adding or editing */}
      {(isAddingNew || editingId) && (
        <View style={styles.editorCard}>
          <Text style={styles.editorTitle}>
            {isAddingNew ? 'Add Regular Schedule' : 'Edit Schedule'}
          </Text>

          {/* Form Row 1: Name and Venue */}
          <View style={styles.formRow}>
            <View style={styles.formCol}>
              <Text style={styles.formLabel}>USER-DEFINED NAME</Text>
              <TextInput
                style={styles.formInput}
                placeholder="e.g. Office, Gym, Campus"
                placeholderTextColor="#94A3B8"
                value={customName}
                onChangeText={setCustomName}
              />
            </View>

            <View style={styles.formCol}>
              <Text style={styles.formLabel}>DESTINATION VENUE</Text>
              <View style={styles.searchWrapper}>
                <TextInput
                  style={styles.formInput}
                  placeholder="Search MRT station or location"
                  placeholderTextColor="#94A3B8"
                  value={venueSearch}
                  onChangeText={handleVenueSearchChange}
                />
                <Search size={14} color="#94A3B8" style={styles.searchIcon} />
              </View>

              {venueSuggestions.length > 0 && (
                <View style={styles.suggestionsBox}>
                  {venueSuggestions.map((item, idx) => (
                    <TouchableOpacity
                      key={item.id || idx}
                      style={styles.suggestionItem}
                      onPress={() => handleSelectSuggestion(item)}
                      activeOpacity={0.7}
                    >
                      <MapPin size={12} color={THEME.forestDark} />
                      <Text style={styles.suggestionText} numberOfLines={1}>
                        {item.name || item.shortName}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Form Row 2: Arrive-by Time & Days of Week */}
          <View style={styles.formRow}>
            <View style={[styles.formCol, { flex: 0.8 }]}>
              <Text style={styles.formLabel}>ARRIVE-BY TIME</Text>
              {Platform.OS === 'web' ? (
                <input
                  type="time"
                  value={arriveBy}
                  onChange={(e) => setArriveBy(e.target.value)}
                  style={{
                    backgroundColor: '#F8FAFC',
                    border: '1px solid #CBD5E1',
                    borderRadius: 6,
                    padding: '7px 10px',
                    fontSize: '13px',
                    fontWeight: '700',
                    color: '#0F172A',
                    outline: 'none',
                    width: '100%',
                    fontFamily: 'inherit',
                  }}
                />
              ) : (
                <TextInput
                  style={styles.formInput}
                  placeholder="HH:MM (24h)"
                  placeholderTextColor="#94A3B8"
                  value={arriveBy}
                  onChangeText={setArriveBy}
                />
              )}
            </View>

            <View style={[styles.formCol, { flex: 1.2 }]}>
              <Text style={styles.formLabel}>DAYS OF WEEK</Text>
              <View style={styles.daysSelectorRow}>
                {DAYS_OF_WEEK.map((day) => {
                  const isSelected = selectedDays.includes(day.key);
                  return (
                    <TouchableOpacity
                      key={day.key}
                      style={[
                        styles.dayPill,
                        isSelected && styles.dayPillSelected,
                      ]}
                      onPress={() => toggleDay(day.key)}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dayPillText,
                          isSelected && styles.dayPillTextSelected,
                        ]}
                      >
                        {day.label}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {/* Editor Action Buttons */}
          <View style={styles.editorBtnRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              onPress={() => {
                setIsAddingNew(false);
                setEditingId(null);
              }}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.savePlaceBtn,
                !customName.trim() && styles.savePlaceBtnDisabled,
              ]}
              onPress={handleSavePlace}
              disabled={!customName.trim()}
              activeOpacity={0.8}
            >
              <Check size={14} color="#FFFFFF" strokeWidth={2.4} />
              <Text style={styles.savePlaceBtnText}>
                {isAddingNew ? 'Add Schedule' : 'Save Changes'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* 4-Column Table */}
      <View style={styles.tableWrapper}>
        {/* Table Column Headers */}
        <View style={styles.tableHeadRow}>
          <Text style={[styles.thCell, styles.col1]}>USER-DEFINED NAME</Text>
          <Text style={[styles.thCell, styles.col2]}>DESTINATION VENUE</Text>
          <Text style={[styles.thCell, styles.col3]}>ARRIVE-BY TIME</Text>
          <Text style={[styles.thCell, styles.col4]}>DAYS OF THE WEEK</Text>
          <View style={styles.colActions} />
        </View>

        {/* Table Body Rows */}
        <ScrollView style={styles.tableBody} showsVerticalScrollIndicator={false}>
          {places.length === 0 ? (
            <View style={styles.emptyState}>
              <MapPin size={24} color="#94A3B8" />
              <Text style={styles.emptyTitle}>No regular places saved yet</Text>
              <Text style={styles.emptySubtitle}>
                Add regular spots like your workplace, gym, or campus with target arrive times.
              </Text>
            </View>
          ) : (
            places.map((place) => {
              return (
                <View key={place.id} style={styles.tableRow}>
                  {/* Col 1: User-defined name */}
                  <TouchableOpacity
                    style={styles.col1}
                    onPress={() => startEditPlace(place)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.customNameText} numberOfLines={1}>
                      {place.customName}
                    </Text>
                  </TouchableOpacity>

                  {/* Col 2: Destination Venue */}
                  <TouchableOpacity
                    style={styles.col2}
                    onPress={() => startEditPlace(place)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.venueCell}>
                      <MapPin size={12} color={THEME.forestAccent} />
                      <Text style={styles.venueNameText} numberOfLines={1}>
                        {place.venueName}
                      </Text>
                    </View>
                  </TouchableOpacity>

                  {/* Col 3: Arrive-by time */}
                  <View style={styles.col3}>
                    <View style={styles.timeBadge}>
                      <Clock size={11} color="#0F172A" />
                      <Text style={styles.timeBadgeText}>{place.arriveBy}</Text>
                    </View>
                  </View>

                  {/* Col 4: Days of the week */}
                  <View style={styles.col4}>
                    <View style={styles.daysListRow}>
                      {DAYS_OF_WEEK.map((d) => {
                        const active = place.days && place.days.includes(d.key);
                        return (
                          <View
                            key={d.key}
                            style={[
                              styles.tableDayDot,
                              active && styles.tableDayDotActive,
                            ]}
                          >
                            <Text
                              style={[
                                styles.tableDayDotText,
                                active && styles.tableDayDotTextActive,
                              ]}
                            >
                              {d.label}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  </View>

                  {/* Actions: Navigate + Delete */}
                  <View style={styles.colActions}>
                    <TouchableOpacity
                      style={styles.rowActionBtn}
                      onPress={() => handleNavigateToPlace(place)}
                      title="Set as destination"
                      activeOpacity={0.7}
                    >
                      <Navigation size={13} color={THEME.forestDark} />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.rowActionBtn}
                      onPress={() => handleDeletePlace(place.id)}
                      title="Delete"
                      activeOpacity={0.7}
                    >
                      <Trash2 size={13} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
        </ScrollView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  topControlRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerInfo: {
    flex: 1,
  },
  tableTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  tableSubtitle: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: THEME.forestDark,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  editorCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: 12,
    marginBottom: 12,
  },
  editorTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: THEME.forestDark,
    marginBottom: 8,
    letterSpacing: 0.2,
  },
  formRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 8,
  },
  formCol: {
    flex: 1,
    position: 'relative',
  },
  formLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  formInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 9,
    paddingVertical: 6,
    fontSize: 12,
    color: '#0F172A',
  },
  searchWrapper: {
    position: 'relative',
    justifyContent: 'center',
  },
  searchIcon: {
    position: 'absolute',
    right: 8,
  },
  suggestionsBox: {
    position: 'absolute',
    top: 50,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 4,
    zIndex: 99,
  },
  suggestionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 8,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  suggestionText: {
    fontSize: 12,
    color: '#0F172A',
    fontWeight: '500',
  },
  daysSelectorRow: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  dayPill: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayPillSelected: {
    backgroundColor: THEME.forestDark,
    borderColor: THEME.forestDark,
  },
  dayPillText: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
  },
  dayPillTextSelected: {
    color: '#FFFFFF',
  },
  editorBtnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 6,
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  savePlaceBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: THEME.forestDark,
  },
  savePlaceBtnDisabled: {
    opacity: 0.5,
  },
  savePlaceBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  tableWrapper: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
    overflow: 'hidden',
  },
  tableHeadRow: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  thCell: {
    fontSize: 9,
    fontWeight: '700',
    color: '#64748B',
    letterSpacing: 0.5,
  },
  tableBody: {
    flex: 1,
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    paddingVertical: 9,
    paddingHorizontal: 10,
    alignItems: 'center',
  },
  col1: {
    flex: 1.1,
  },
  col2: {
    flex: 1.2,
  },
  col3: {
    width: 80,
    alignItems: 'center',
  },
  col4: {
    width: 140,
    alignItems: 'center',
  },
  colActions: {
    width: 55,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 6,
  },
  customNameText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#0F172A',
  },
  venueCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  venueNameText: {
    fontSize: 12,
    color: '#334155',
    fontWeight: '500',
  },
  timeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 4,
  },
  timeBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#0F172A',
  },
  daysListRow: {
    flexDirection: 'row',
    gap: 2,
  },
  tableDayDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableDayDotActive: {
    backgroundColor: '#E0F2FE',
  },
  tableDayDotText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#94A3B8',
  },
  tableDayDotTextActive: {
    color: '#0284C7',
  },
  rowActionBtn: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#475569',
    marginTop: 8,
  },
  emptySubtitle: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    marginTop: 3,
    lineHeight: 15,
  },
});

