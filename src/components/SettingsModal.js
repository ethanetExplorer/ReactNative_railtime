// SettingsModal Component
// Unified Settings dialog incorporating:
// 1. Disruption Simulation Menu (Event scenarios, unplanned faults, weather, crowd forecasts)
// 2. LTA DataMall API Credentials & Live API Mode toggle
// Uses Lucide icons (no emojis).

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  Switch,
} from 'react-native';
import {
  X,
  Check,
  Info,
  Key,
  SlidersHorizontal,
  Zap,
  Settings as SettingsIcon,
} from 'lucide-react';
import { getEffectiveCredentials, saveEffectiveCredentials } from '../../keys/ltaKeys';
import { setLiveApiMode, getLiveApiMode } from '../services/ltaService';
import { SCENARIOS } from '../data/scenarios';
import { THEME } from '../theme/colors';

export default function SettingsModal({
  visible,
  activeScenarioId,
  onSelectScenario,
  onClose,
  onConfigChanged,
}) {
  // Navigation within settings: 'simulation' | 'keys'
  const [activeTab, setActiveTab] = useState('simulation');

  // Credentials & Live API Mode
  const [accountKey, setAccountKey] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [liveMode, setLiveMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const scenarioList = Object.values(SCENARIOS);

  useEffect(() => {
    if (visible) {
      const creds = getEffectiveCredentials();
      setAccountKey(creds.accountKey || '');
      setApiKey(creds.apiKey || '');
      setLiveMode(getLiveApiMode());
      setSavedSuccess(false);
    }
  }, [visible]);

  const handleSaveKeys = () => {
    saveEffectiveCredentials({
      accountKey: accountKey.trim(),
      apiKey: apiKey.trim(),
    });
    setLiveApiMode(liveMode);
    setSavedSuccess(true);
    if (onConfigChanged) {
      onConfigChanged({ accountKey: accountKey.trim(), apiKey: apiKey.trim(), liveMode });
    }
    setTimeout(() => {
      setSavedSuccess(false);
    }, 2000);
  };

  const getBadgeStyle = (type) => {
    switch (type) {
      case 'unplanned': return { backgroundColor: '#FEE2E2', textColor: '#991B1B' };
      case 'weather': return { backgroundColor: '#E0F2FE', textColor: '#0369A1' };
      case 'planned': return { backgroundColor: '#FEF3C7', textColor: '#92400E' };
      default: return { backgroundColor: '#DCFCE7', textColor: '#166534' };
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          {/* Modal Header */}
          <View style={styles.dialogHeader}>
            <View style={styles.titleRow}>
              <SettingsIcon size={18} color="#0F172A" strokeWidth={2.4} />
              <Text style={styles.dialogTitle}>Settings</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn} activeOpacity={0.7}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          {/* Menu Navigation Segmented Control */}
          <View style={styles.segmentedControl}>
            <TouchableOpacity
              style={[styles.segmentBtn, activeTab === 'simulation' && styles.segmentBtnActive]}
              onPress={() => setActiveTab('simulation')}
              activeOpacity={0.8}
            >
              <SlidersHorizontal size={13} color={activeTab === 'simulation' ? '#0F172A' : '#64748B'} />
              <Text style={[styles.segmentText, activeTab === 'simulation' && styles.segmentTextActive]}>
                Disruption Simulation
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[styles.segmentBtn, activeTab === 'keys' && styles.segmentBtnActive]}
              onPress={() => setActiveTab('keys')}
              activeOpacity={0.8}
            >
              <Key size={13} color={activeTab === 'keys' ? '#0F172A' : '#64748B'} />
              <Text style={[styles.segmentText, activeTab === 'keys' && styles.segmentTextActive]}>
                LTA DataMall Keys
              </Text>
            </TouchableOpacity>
          </View>

          {/* Tab 1: Disruption Simulation Menu */}
          {activeTab === 'simulation' ? (
            <View style={styles.tabContent}>
              <Text style={styles.sectionSubtitle}>
                Select an event scenario to simulate live and test proactive rerouting:
              </Text>

              <ScrollView style={styles.scenarioList} showsVerticalScrollIndicator={false}>
                {scenarioList.map(scenario => {
                  const isActive = scenario.id === activeScenarioId;
                  const badge = getBadgeStyle(scenario.type);

                  return (
                    <TouchableOpacity
                      key={scenario.id}
                      style={[styles.scenarioCard, isActive && styles.scenarioCardActive]}
                      onPress={() => {
                        onSelectScenario(scenario.id);
                      }}
                      activeOpacity={0.7}
                    >
                      <View style={styles.scenarioTopLine}>
                        <View style={styles.scenarioNameRow}>
                          <Text style={[styles.scenarioName, isActive && styles.scenarioNameActive]}>
                            {scenario.name}
                          </Text>
                          <View style={[styles.typeBadge, { backgroundColor: badge.backgroundColor }]}>
                            <Text style={[styles.typeBadgeText, { color: badge.textColor }]}>
                              {scenario.badge}
                            </Text>
                          </View>
                        </View>
                        {isActive && (
                          <View style={styles.selectedPill}>
                            <Check size={12} color={THEME.forestDark} strokeWidth={2.4} />
                            <Text style={styles.selectedText}>Active</Text>
                          </View>
                        )}
                      </View>

                      <Text style={styles.scenarioDesc}>{scenario.description}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          ) : (
            /* Tab 2: LTA DataMall Credentials */
            <View style={styles.tabContent}>
              <Text style={styles.sectionSubtitle}>
                Enter your LTA DataMall credentials. Keys are saved to git-ignored keys/ltaKeys.js and browser storage.
              </Text>

              {/* Key 1: AccountKey */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>LTA DATAMALL ACCOUNTKEY (PRIMARY)</Text>
                <TextInput
                  style={styles.keyInput}
                  placeholder="Paste your LTA AccountKey"
                  placeholderTextColor="#94A3B8"
                  value={accountKey}
                  onChangeText={setAccountKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Key 2: Secondary API Key */}
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>LTA API KEY / SECONDARY KEY (OPTIONAL)</Text>
                <TextInput
                  style={styles.keyInput}
                  placeholder="Paste your secondary API Key"
                  placeholderTextColor="#94A3B8"
                  value={apiKey}
                  onChangeText={setApiKey}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>

              {/* Live API Mode Toggle */}
              <View style={styles.toggleRow}>
                <View style={styles.toggleLabelGroup}>
                  <Text style={styles.toggleTitle}>Live API Mode</Text>
                  <Text style={styles.toggleSub}>Query live LTA DataMall endpoints directly</Text>
                </View>
                <Switch
                  value={liveMode}
                  onValueChange={setLiveMode}
                  trackColor={{ false: '#CBD5E1', true: THEME.forestDark }}
                  thumbColor={liveMode ? '#FFFFFF' : '#F8FAFC'}
                />
              </View>

              <View style={styles.infoBox}>
                <View style={styles.infoTitleRow}>
                  <Info size={13} color={THEME.forestText} />
                  <Text style={styles.infoTitle}>Note</Text>
                </View>
                <Text style={styles.infoBody}>
                  With Live API mode enabled, the app queries live LTA TrainServiceAlerts, PCD crowdedness, and BusArrival endpoints.
                </Text>
              </View>

              {savedSuccess && (
                <View style={styles.successBanner}>
                  <Check size={14} color="#15803D" />
                  <Text style={styles.successText}>Credentials saved successfully</Text>
                </View>
              )}

              <View style={styles.btnRow}>
                <TouchableOpacity style={styles.saveBtn} onPress={handleSaveKeys} activeOpacity={0.8}>
                  <Text style={styles.saveBtnText}>Save Credentials</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Modal Footer Done Button */}
          <View style={styles.footer}>
            <TouchableOpacity style={styles.doneBtn} onPress={onClose} activeOpacity={0.8}>
              <Text style={styles.doneBtnText}>Done</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.55)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dialog: {
    width: '100%',
    maxWidth: 480,
    maxHeight: '88%',
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 18,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    flexDirection: 'column',
  },
  dialogHeader: {
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
  dialogTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#0F172A',
    letterSpacing: -0.3,
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  segmentedControl: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: 9,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 7,
    borderRadius: 7,
  },
  segmentBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
  segmentText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#64748B',
  },
  segmentTextActive: {
    color: THEME.forestDark,
    fontWeight: '700',
  },
  tabContent: {
    flex: 1,
    overflow: 'hidden',
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#475569',
    marginBottom: 10,
    lineHeight: 16,
  },
  scenarioList: {
    flex: 1,
  },
  scenarioCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    padding: 11,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scenarioCardActive: {
    borderColor: THEME.forestDark,
    backgroundColor: '#F0FDF9',
  },
  scenarioTopLine: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  scenarioNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    flexWrap: 'wrap',
    flex: 1,
  },
  scenarioName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  scenarioNameActive: {
    color: THEME.forestDark,
  },
  typeBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1.5,
    borderRadius: 4,
  },
  typeBadgeText: {
    fontSize: 10,
    fontWeight: '700',
  },
  selectedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: THEME.forestLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedText: {
    fontSize: 10,
    fontWeight: '700',
    color: THEME.forestDark,
  },
  scenarioDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 6,
  },
  actionPreviewBox: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 6,
    borderLeftWidth: 2.5,
    borderLeftColor: THEME.forestDark,
    marginTop: 2,
  },
  actionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  actionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: THEME.forestAccent,
    letterSpacing: 0.5,
  },
  actionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  tradeoffText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.4,
  },
  keyInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 6,
    paddingHorizontal: 10,
    height: 38,
    fontSize: 13,
    color: '#0F172A',
  },
  toggleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
    marginVertical: 4,
  },
  toggleLabelGroup: {
    flex: 1,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  toggleSub: {
    fontSize: 11,
    color: '#64748B',
  },
  infoBox: {
    backgroundColor: THEME.forestLight,
    borderRadius: 6,
    padding: 8,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#D1EBE6',
  },
  infoTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  infoTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: THEME.forestText,
  },
  infoBody: {
    fontSize: 11,
    color: '#334155',
    lineHeight: 15,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#DCFCE7',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  successText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  btnRow: {
    marginTop: 6,
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: THEME.forestDark,
    alignItems: 'center',
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  footer: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 10,
    marginTop: 8,
    alignItems: 'flex-end',
  },
  doneBtn: {
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 6,
    backgroundColor: '#F1F5F9',
  },
  doneBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
});

