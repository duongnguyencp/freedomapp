import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { Card } from '@/components/Card';
import { FinancialMetric } from '@/components/FinancialMetric';
import { MiniLineChart } from '@/components/MiniLineChart';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography } from '@/constants/theme';
import { formatCompactVND, formatPercent } from '@/services/format';

import { useDashboardData } from './useDashboardData';

export function DashboardScreen() {
  const { status, data } = useDashboardData();

  if (status !== 'ready' || !data) {
    return (
      <Screen contentContainerStyle={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  const {
    netWorth,
    fiNumber,
    fiProgress,
    remaining,
    savingsRate,
    monthlyInvestment,
    projectedFIDate,
    netWorthHistory,
  } = data;

  return (
    <Screen>
      <Card tinted>
        <Text style={styles.label}>FINANCIAL FREEDOM</Text>
        <Text style={styles.progressValue}>{formatPercent(fiProgress)}</Text>

        <View style={styles.progressBar}>
          <ProgressIndicator progress={fiProgress} height={12} />
        </View>

        <View style={styles.row}>
          <Text style={styles.rangeText}>
            {formatCompactVND(netWorth)} / {formatCompactVND(fiNumber)}
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.rowBetween}>
          <View>
            <Text style={styles.caption}>You need</Text>
            <Text style={[styles.remaining, remaining > 0 && styles.remainingWarm]}>
              {remaining > 0 ? `${formatCompactVND(remaining)} more` : "You're there 🎉"}
            </Text>
          </View>
          <View style={styles.alignEnd}>
            <Text style={styles.caption}>Estimated FI</Text>
            <Text style={styles.remaining}>
              {projectedFIDate ? projectedFIDate.year : 'N/A'}
            </Text>
          </View>
        </View>

        {!projectedFIDate ? (
          <Text style={styles.warning}>
            FI date cannot be estimated with current assumptions.
          </Text>
        ) : null}
      </Card>

      <Card style={styles.spaced}>
        <FinancialMetric label="Net worth" value={formatCompactVND(netWorth)} size="large" />
      </Card>

      <View style={styles.metricRow}>
        <Card style={styles.metricCard}>
          <FinancialMetric label="Savings rate" value={formatPercent(savingsRate, 0)} />
        </Card>
        <Card style={styles.metricCard}>
          <FinancialMetric
            label="Monthly investment"
            value={formatCompactVND(monthlyInvestment)}
          />
        </Card>
      </View>

      {netWorthHistory.length >= 2 ? (
        <Card>
          <Text style={styles.progressTitle}>Your progress</Text>
          <MiniLineChart
            labels={netWorthHistory.map((point) => point.label)}
            values={netWorthHistory.map((point) => point.value)}
            formatValue={formatCompactVND}
            height={140}
          />
        </Card>
      ) : null}

      <Link href="/what-if" asChild>
        <Pressable>
          {({ pressed }) => (
            <Card style={[styles.whatIfCard, pressed && styles.whatIfCardPressed]}>
              <Text style={styles.whatIfLabel}>What if I invest more?</Text>
              <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
            </Card>
          )}
        </Pressable>
      </Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  progressValue: {
    ...typography.hero,
    color: colors.textPrimary,
    marginTop: spacing.sm,
  },
  progressBar: {
    marginTop: spacing.lg,
  },
  row: {
    marginTop: spacing.sm,
  },
  rangeText: {
    ...typography.body,
    color: colors.textSecondary,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: 'rgba(22, 21, 40, 0.1)',
    marginVertical: spacing.lg,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  caption: {
    ...typography.caption,
    color: colors.textSecondary,
  },
  remaining: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  remainingWarm: {
    color: colors.warm,
  },
  warning: {
    ...typography.caption,
    color: colors.textMuted,
    marginTop: spacing.md,
  },
  spaced: {
    marginTop: 0,
  },
  metricRow: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  metricCard: {
    flex: 1,
  },
  progressTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  whatIfCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
  },
  whatIfCardPressed: {
    opacity: 0.7,
  },
  whatIfLabel: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
});
