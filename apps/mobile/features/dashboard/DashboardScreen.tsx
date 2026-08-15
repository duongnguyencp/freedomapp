import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { Card } from '@/components/Card';
import { FinancialMetric } from '@/components/FinancialMetric';
import { ProgressIndicator } from '@/components/ProgressIndicator';
import { colors, spacing, typography } from '@/constants/theme';
import { formatCompactVND, formatPercent } from '@/services/format';

import { mockDashboard } from './mockData';

export function DashboardScreen() {
  const {
    netWorth,
    fiNumber,
    fiProgress,
    netWorthDeltaThisMonth,
    savingsRate,
    monthlyInvestment,
    estimatedFiYear,
  } = mockDashboard;

  const remaining = Math.max(0, fiNumber - netWorth);

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
    >
      <Card>
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
            <Text style={styles.remaining}>{formatCompactVND(remaining)} more</Text>
          </View>
          <View style={styles.alignEnd}>
            <Text style={styles.caption}>Estimated FI</Text>
            <Text style={styles.remaining}>{estimatedFiYear}</Text>
          </View>
        </View>
      </Card>

      <Card style={styles.spaced}>
        <FinancialMetric
          label="Net worth"
          value={formatCompactVND(netWorth)}
          delta={`+${formatCompactVND(netWorthDeltaThisMonth)} this month`}
          size="large"
        />
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
    gap: spacing.md,
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
    backgroundColor: colors.border,
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
});
