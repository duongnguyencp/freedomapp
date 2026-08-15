import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, typography } from '@/constants/theme';

// Placeholder for Phase 1. Net worth & FI progress charts land in Phase 5.
export function HistoryScreen() {
  return (
    <Screen>
      <SectionHeader title="History" subtitle="Coming in Phase 5" />
      <Card>
        <Text style={styles.body}>
          Your net worth and FI progress charts will appear here once snapshots exist.
        </Text>
      </Card>
    </Screen>
  );
}

const styles = StyleSheet.create({
  body: {
    ...typography.body,
    color: colors.textSecondary,
  },
});
