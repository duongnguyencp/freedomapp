import { StyleSheet, Text } from 'react-native';

import { Card } from '@/components/Card';
import { Screen } from '@/components/Screen';
import { SectionHeader } from '@/components/SectionHeader';
import { colors, typography } from '@/constants/theme';

// Placeholder for Phase 1. Editing profile assumptions (income, spending,
// SWR, expected return) lands in Phase 3.
export function SettingsScreen() {
  return (
    <Screen>
      <SectionHeader title="Settings" subtitle="Coming in Phase 3" />
      <Card>
        <Text style={styles.body}>
          Your financial assumptions — income, spending, safe withdrawal rate and expected
          return — will be editable here.
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
