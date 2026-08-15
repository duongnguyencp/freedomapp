import { ScrollView, StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, spacing, typography } from '@/constants/theme';

// Placeholder for Phase 1. Editing profile assumptions (income, spending,
// SWR, expected return) lands in Phase 3.
export function SettingsScreen() {
  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <SectionHeader title="Settings" subtitle="Coming in Phase 3" />
      <Card>
        <Text style={styles.body}>
          Your financial assumptions — income, spending, safe withdrawal rate and expected
          return — will be editable here.
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
