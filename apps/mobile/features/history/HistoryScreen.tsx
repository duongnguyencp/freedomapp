import { ScrollView, StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, spacing, typography } from '@/constants/theme';

// Placeholder for Phase 1. Net worth & FI progress charts land in Phase 5.
export function HistoryScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader title="History" subtitle="Coming in Phase 5" />
      <Card>
        <Text style={styles.body}>
          Your net worth and FI progress charts will appear here once snapshots exist.
        </Text>
      </Card>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: spacing.lg,
    paddingBottom: spacing.xxl,
  },
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
