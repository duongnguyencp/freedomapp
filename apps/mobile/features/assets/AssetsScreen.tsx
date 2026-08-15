import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, typography } from '@/constants/theme';

// Placeholder for Phase 1. Real add/edit/delete flows for assets and
// liabilities land in Phase 3.
export function AssetsScreen() {
  return (
    <Screen>
      <SectionHeader title="Assets & Liabilities" subtitle="Coming in Phase 3" />
      <Card>
        <Text style={styles.body}>
          You&apos;ll be able to add cash, bank, gold, stocks, ETFs, crypto, real estate and
          liabilities here.
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
