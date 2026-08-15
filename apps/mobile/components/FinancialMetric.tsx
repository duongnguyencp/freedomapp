import { StyleSheet, Text, View } from 'react-native';

import { colors, spacing, typography } from '@/constants/theme';

type FinancialMetricProps = {
  label: string;
  value: string;
  delta?: string;
  deltaTone?: 'positive' | 'neutral';
  size?: 'large' | 'medium';
};

export function FinancialMetric({
  label,
  value,
  delta,
  deltaTone = 'positive',
  size = 'medium',
}: FinancialMetricProps) {
  return (
    <View>
      <Text style={styles.label}>{label}</Text>
      <Text style={[styles.value, size === 'large' && styles.valueLarge]}>{value}</Text>
      {delta ? (
        <Text style={[styles.delta, deltaTone === 'positive' && styles.deltaPositive]}>
          {delta}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  label: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  value: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  valueLarge: {
    ...typography.hero,
    marginTop: spacing.sm,
  },
  delta: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.xs,
  },
  deltaPositive: {
    color: colors.success,
  },
});
