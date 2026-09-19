// ServiceMessages Component
// Matches reference screenshot aesthetic with dark forest teal icon badge,
// timestamps, and concise maintenance/closure notices.

import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { Info } from 'lucide-react';
import { THEME } from '../theme/colors';

const DEFAULT_MESSAGES = [
  {
    id: 'msg_1',
    title: 'NSL engineering works',
    timeAgo: '8m ago',
    content: 'Expect longer travel times between Bishan and Toa Payoh after 10 PM due to scheduled track maintenance.',
  },
  {
    id: 'msg_2',
    title: 'EWL platform closure',
    timeAgo: '24m ago',
    content: 'Platform 2 at City Hall is closed for upgrading works. Please use Platform 1 for all EWL services.',
  },
];

export default function ServiceMessages({ messages = [] }) {
  const displayList = messages.length > 0 ? messages : DEFAULT_MESSAGES;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SERVICE MESSAGES</Text>
        <Text style={styles.count}>{displayList.length} updates</Text>
      </View>

      <View style={styles.list}>
        {displayList.map((msg) => (
          <View key={msg.id || msg.Content} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.titleGroup}>
                <View style={styles.iconCircle}>
                  <Info size={14} color="#FFFFFF" strokeWidth={2.4} />
                </View>
                <Text style={styles.msgTitle}>{msg.title || 'Notice'}</Text>
              </View>
              <Text style={styles.timeAgo}>{msg.timeAgo || 'Just now'}</Text>
            </View>

            <Text style={styles.msgContent}>{msg.content || msg.Content}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 10,
    marginBottom: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    letterSpacing: 0.6,
    textTransform: 'uppercase',
  },
  count: {
    fontSize: 11,
    color: '#94A3B8',
  },
  list: {
    gap: 8,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 14,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  iconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: THEME.forestDark, // Dark forest teal circle
    alignItems: 'center',
    justifyContent: 'center',
  },
  msgTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#0F172A',
  },
  timeAgo: {
    fontSize: 11,
    color: '#94A3B8',
  },
  msgContent: {
    fontSize: 12,
    color: '#475569',
    lineHeight: 17,
    paddingLeft: 36, // Align neatly under title
  },
});

