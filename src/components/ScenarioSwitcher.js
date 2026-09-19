// ScenarioSwitcher Modal Component
// Simple, clean modal with Lucide icons for selecting transit scenarios.

import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, Modal, ScrollView } from 'react-native';
import { X, Zap, Check } from 'lucide-react';
import { SCENARIOS } from '../data/scenarios';

export default function ScenarioSwitcher({
  visible,
  activeScenarioId,
  onSelectScenario,
  onClose,
}) {
  const scenarioList = Object.values(SCENARIOS);

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View style={styles.modalSheet}>
          <View style={styles.modalHeader}>
            <View>
              <Text style={styles.modalTitle}>Transit Scenarios</Text>
              <Text style={styles.modalSubtitle}>Select an event scenario to test proactive routing</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={onClose}>
              <X size={18} color="#64748B" />
            </TouchableOpacity>
          </View>

          <ScrollView style={styles.scenarioList}>
            {scenarioList.map(scenario => {
              const isActive = scenario.id === activeScenarioId;

              return (
                <TouchableOpacity
                  key={scenario.id}
                  style={[styles.scenarioCard, isActive && styles.scenarioCardActive]}
                  onPress={() => {
                    onSelectScenario(scenario.id);
                    onClose();
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.nameGroup}>
                      <Text style={[styles.scenarioName, isActive && styles.scenarioNameActive]}>
                        {scenario.name}
                      </Text>
                      <View style={[styles.badge, getBadgeStyle(scenario.type)]}>
                        <Text style={[styles.badgeText, getBadgeTextStyle(scenario.type)]}>
                          {scenario.badge}
                        </Text>
                      </View>
                    </View>
                    {isActive && (
                      <View style={styles.activeCheckRow}>
                        <Check size={14} color="#0284C7" />
                        <Text style={styles.activeCheck}>Selected</Text>
                      </View>
                    )}
                  </View>

                  <Text style={styles.scenarioDesc}>{scenario.description}</Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function getBadgeStyle(type) {
  switch (type) {
    case 'unplanned': return { backgroundColor: '#FEE2E2' };
    case 'weather': return { backgroundColor: '#E0F2FE' };
    case 'planned': return { backgroundColor: '#FEF3C7' };
    default: return { backgroundColor: '#DCFCE7' };
  }
}

function getBadgeTextStyle(type) {
  switch (type) {
    case 'unplanned': return { color: '#991B1B' };
    case 'weather': return { color: '#0369A1' };
    case 'planned': return { color: '#92400E' };
    default: return { color: '#166534' };
  }
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalSheet: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    maxWidth: 460,
    maxHeight: '85%',
    paddingBottom: 16,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0F172A',
  },
  modalSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  scenarioList: {
    paddingHorizontal: 14,
    paddingTop: 10,
  },
  scenarioCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 6,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  scenarioCardActive: {
    borderColor: '#0284C7',
    backgroundColor: '#F0F9FF',
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  nameGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 6,
    flex: 1,
  },
  scenarioName: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  scenarioNameActive: {
    color: '#0284C7',
  },
  badge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '600',
  },
  activeCheckRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  activeCheck: {
    fontSize: 11,
    fontWeight: '600',
    color: '#0284C7',
  },
  scenarioDesc: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 6,
  },
  decisionPreview: {
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderRadius: 4,
    borderLeftWidth: 2,
    borderLeftColor: '#0284C7',
    marginTop: 2,
  },
  decisionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  decisionLabel: {
    fontSize: 9,
    fontWeight: '700',
    color: '#0284C7',
    letterSpacing: 0.5,
  },
  decisionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#0F172A',
    marginTop: 2,
  },
  tradeoffText: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 2,
  },
});
