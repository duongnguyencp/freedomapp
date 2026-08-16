import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Link } from 'expo-router';

import { AnimatedEntrance } from '@/components/AnimatedEntrance';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { Card } from '@/components/Card';
import { FinancialMetric } from '@/components/FinancialMetric';
import { MiniLineChart } from '@/components/MiniLineChart';
import { ProgressRing } from '@/components/ProgressRing';
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

  const showChart = netWorthHistory.length >= 2;
  const whatIfIndex = showChart ? 4 : 3;

  return (
    <Screen>
      <AnimatedEntrance index={0}>
        <Card tinted>
          <Text style={styles.label}>FINANCIAL FREEDOM</Text>

          <View style={styles.ringWrap}>
            <ProgressRing progress={fiProgress} size={176} strokeWidth={14}>
              <AnimatedNumber
                value={fiProgress}
                formatValue={(value) => formatPercent(value)}
                style={styles.ringValue}
              />
            </ProgressRing>
          </View>

          <Text style={styles.rangeText}>
            {formatCompactVND(netWorth)} / {formatCompactVND(fiNumber)}
          </Text>

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
              <Text style={styles.remaining}>{projectedFIDate ? projectedFIDate.year : 'N/A'}</Text>
            </View>
          </View>

          {!projectedFIDate ? (
            <Text style={styles.warning}>FI date cannot be estimated with current assumptions.</Text>
          ) : null}
        </Card>
      </AnimatedEntrance>

      <AnimatedEntrance index={1}>
        <Card>
          <Text style={styles.label}>NET WORTH</Text>
          <AnimatedNumber
            value={netWorth}
            formatValue={formatCompactVND}
            style={styles.netWorthValue}
          />
        </Card>
      </AnimatedEntrance>

      <AnimatedEntrance index={2}>
        <View style={styles.metricRow}>
          <Card style={styles.metricCard}>
            <FinancialMetric label="Savings rate" value={formatPercent(savingsRate, 0)} />
          </Card>
          <Card style={styles.metricCard}>
            <FinancialMetric label="Monthly investment" value={formatCompactVND(monthlyInvestment)} />
          </Card>
        </View>
      </AnimatedEntrance>

      {showChart ? (
        <AnimatedEntrance index={3}>
          <Card>
            <Text style={styles.progressTitle}>Your progress</Text>
            <MiniLineChart
              labels={netWorthHistory.map((point) => point.label)}
              values={netWorthHistory.map((point) => point.value)}
              formatValue={formatCompactVND}
              height={140}
            />
          </Card>
        </AnimatedEntrance>
      ) : null}

      <AnimatedEntrance index={whatIfIndex}>
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
      </AnimatedEntrance>
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
  ringWrap: {
    alignItems: 'center',
    marginTop: spacing.lg,
  },
  ringValue: {
    ...typography.hero,
    fontSize: 32,
    color: colors.textPrimary,
    textAlign: 'center',
    padding: 0,
  },
  rangeText: {
    ...typography.body,
    color: colors.textSecondary,
    textAlign: 'center',
    marginTop: spacing.lg,
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
  netWorthValue: {
    ...typography.hero,
    color: colors.textPrimary,
    marginTop: spacing.sm,
    padding: 0,
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
