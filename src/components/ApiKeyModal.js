// ApiKeyModal Component
// Simple, utilitarian modal for configuring LTA DataMall AccountKey and secondary API key.
// Uses Lucide icons (no emojis).

import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Modal, Switch } from 'react-native';
import { X, Check, Info, Key } from 'lucide-react';
import { getEffectiveCredentials, saveEffectiveCredentials } from '../../keys/ltaKeys';
import { setLiveApiMode, getLiveApiMode } from '../services/ltaService';

export default function ApiKeyModal({
  visible,
  onClose,
  onConfigChanged,
}) {
  const [accountKey, setAccountKey] = useState('');
  const [apiKey, setApiKey] = useState('');
  const [liveMode, setLiveMode] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  useEffect(() => {
    if (visible) {
      const creds = getEffectiveCredentials();
      setAccountKey(creds.accountKey || '');
      setApiKey(creds.apiKey || '');
      setLiveMode(getLiveApiMode());
      setSavedSuccess(false);
    }
  }, [visible]);

  const handleSave = () => {
    saveEffectiveCredentials({
      accountKey: accountKey.trim(),
      apiKey: apiKey.trim(),
    });
    setLiveApiMode(liveMode);
    setSavedSuccess(true);
    if (onConfigChanged) onConfigChanged({ accountKey: accountKey.trim(), apiKey: apiKey.trim(), liveMode });
    setTimeout(() => {
      onClose();
    }, 600);
  };

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.dialog}>
          <View style={styles.dialogHeader}>
            <View style={styles.titleRow}>
              <Key size={16} color="#0F172A" />
              <Text style={styles.dialogTitle}>LTA DataMall Keys</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <X size={16} color="#64748B" />
            </TouchableOpacity>
          </View>

          <Text style={styles.description}>
            Enter your LTA DataMall credentials. Keys are stored in the git-ignored keys/ltaKeys.js and browser storage.
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

          <View style={styles.toggleRow}>
            <View style={styles.toggleLabelGroup}>
              <Text style={styles.toggleTitle}>Live API Mode</Text>
              <Text style={styles.toggleSub}>Query live LTA servers directly</Text>
            </View>
            <Switch
              value={liveMode}
              onValueChange={setLiveMode}
              trackColor={{ false: '#CBD5E1', true: '#0284C7' }}
              thumbColor={liveMode ? '#FFFFFF' : '#F8FAFC'}
            />
          </View>

          <View style={styles.infoBox}>
            <View style={styles.infoTitleRow}>
              <Info size={13} color="#0369A1" />
              <Text style={styles.infoTitle}>Note</Text>
            </View>
            <Text style={styles.infoBody}>
              Leave blank to use the built-in scenario simulation feeds (disruption alerts, crowd densities, bus occupancies).
            </Text>
          </View>

          {savedSuccess && (
            <View style={styles.successBanner}>
              <Check size={14} color="#15803D" />
              <Text style={styles.successText}>Keys saved successfully</Text>
            </View>
          )}

          <View style={styles.btnRow}>
            <TouchableOpacity style={styles.cancelBtn} onPress={onClose}>
              <Text style={styles.cancelBtnText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
              <Text style={styles.saveBtnText}>Save</Text>
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
    backgroundColor: 'rgba(15, 23, 42, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  dialog: {
    width: '100%',
    maxWidth: 420,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    padding: 18,
    borderWidth: 1,
    borderColor: '#CBD5E1',
  },
  dialogHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dialogTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0F172A',
  },
  closeBtn: {
    padding: 4,
  },
  description: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 16,
    marginBottom: 12,
  },
  fieldGroup: {
    marginBottom: 10,
  },
  fieldLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: '#64748B',
    marginBottom: 4,
    letterSpacing: 0.3,
  },
  keyInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 4,
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
    marginVertical: 6,
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
    backgroundColor: '#F0F9FF',
    borderRadius: 4,
    padding: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#BAE6FD',
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
    color: '#0369A1',
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
    borderRadius: 4,
    marginBottom: 10,
  },
  successText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#166534',
  },
  btnRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
  },
  cancelBtn: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 4,
    backgroundColor: '#F1F5F9',
  },
  cancelBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  saveBtn: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    backgroundColor: '#0F172A',
  },
  saveBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});
