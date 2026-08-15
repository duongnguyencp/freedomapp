import { ScrollView, StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, spacing, typography } from '@/constants/theme';

// Placeholder for Phase 1. Real add/edit/delete flows for assets and
// liabilities land in Phase 3.
export function AssetsScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader title="Assets & Liabilities" subtitle="Coming in Phase 3" />
      <Card>
        <Text style={styles.body}>
          You&apos;ll be able to add cash, bank, gold, stocks, ETFs, crypto, real estate and
          liabilities here.
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
