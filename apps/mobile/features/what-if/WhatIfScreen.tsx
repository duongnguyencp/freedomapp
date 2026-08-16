import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { calculateProjectedFIDate, calculateWhatIf } from 'financial-engine';

import { Card } from '@/components/Card';
import { FormField } from '@/components/FormField';
import { Screen } from '@/components/Screen';
import { colors, spacing, typography } from '@/constants/theme';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { formatCompactVND } from '@/services/format';

const MAX_ADDITIONAL_INVESTMENT = 50_000_000;
const SLIDER_STEP = 1_000_000;

export function WhatIfScreen() {
  const { status, summary, profile } = useFinancialSummary();
  const [additionalInvestment, setAdditionalInvestment] = useState(0);
  const [returnInput, setReturnInput] = useState('');

  const baseMonthlyInvestment =
    profile && profile.monthlyIncome - profile.monthlySpending > 0
      ? profile.monthlyIncome - profile.monthlySpending
      : 0;

  const parsedReturn = toNumber(returnInput);
  const effectiveReturnRate =
    parsedReturn !== null ? parsedReturn / 100 : profile?.expectedAnnualReturn ?? 0;

  const result = useMemo(() => {
    if (!summary || !profile) return null;

    const baseParams = {
      currentNetWorth: summary.netWorth,
      monthlyInvestment: baseMonthlyInvestment,
      annualReturnRate: profile.expectedAnnualReturn,
      fiNumber: summary.fiNumber,
    };

    const whatIf = calculateWhatIf(baseParams, {
      additionalMonthlyInvestment: additionalInvestment,
      newAnnualReturnRate: effectiveReturnRate,
    });

    const currentDate = calculateProjectedFIDate(baseParams, new Date());
    const newDate = calculateProjectedFIDate(
      {
        ...baseParams,
        monthlyInvestment: baseMonthlyInvestment + additionalInvestment,
        annualReturnRate: effectiveReturnRate,
      },
      new Date(),
    );

    return { whatIf, currentDate, newDate };
  }, [summary, profile, baseMonthlyInvestment, additionalInvestment, effectiveReturnRate]);

  if (status !== 'ready' || !summary || !profile || !result) {
    return (
      <Screen edges={[]} contentContainerStyle={styles.center}>
        <ActivityIndicator color={colors.accent} />
      </Screen>
    );
  }

  const { whatIf, currentDate, newDate } = result;
  const difference = describeDifference(whatIf.yearsSaved);

  return (
    <Screen edges={[]}>
      <Text style={styles.intro}>See how extra monthly investment changes your FI date.</Text>

      <Card style={styles.card}>
        <Text style={styles.label}>Current monthly investment</Text>
        <Text style={styles.value}>{formatCompactVND(baseMonthlyInvestment)}</Text>

        <View style={styles.sliderHeader}>
          <Text style={styles.label}>Add per month</Text>
          <Text style={styles.sliderValue}>+{formatCompactVND(additionalInvestment)}</Text>
        </View>
        <Slider
          minimumValue={0}
          maximumValue={MAX_ADDITIONAL_INVESTMENT}
          step={SLIDER_STEP}
          value={additionalInvestment}
          onValueChange={setAdditionalInvestment}
          minimumTrackTintColor={colors.accent}
          maximumTrackTintColor={colors.track}
          thumbTintColor={colors.accent}
        />
        <View style={styles.sliderBounds}>
          <Text style={styles.boundLabel}>+0</Text>
          <Text style={styles.boundLabel}>+{formatCompactVND(MAX_ADDITIONAL_INVESTMENT)}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <FormField
          label="Expected annual return"
          value={returnInput}
          onChangeText={setReturnInput}
          keyboardType="numeric"
          placeholder={String(profile.expectedAnnualReturn * 100)}
          suffix="%"
        />
      </Card>

      <Card style={styles.resultCard}>
        <View style={styles.resultRow}>
          <View>
            <Text style={styles.label}>Current FI date</Text>
            <Text style={styles.resultValue}>{currentDate ? currentDate.year : 'N/A'}</Text>
          </View>
          <View style={styles.alignEnd}>
            <Text style={styles.label}>New FI date</Text>
            <Text style={[styles.resultValue, styles.resultValueAccent]}>
              {newDate ? newDate.year : 'N/A'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Difference</Text>
        <Text style={styles.difference}>{difference}</Text>
      </Card>
    </Screen>
  );
}

function toNumber(value: string): number | null {
  if (value.trim() === '') return null;
  const parsed = Number(value.replace(',', '.'));
  return Number.isFinite(parsed) ? parsed : null;
}

function describeDifference(yearsSaved: number | null): string {
  if (yearsSaved === null) {
    return 'N/A';
  }
  const rounded = Math.round(Math.abs(yearsSaved));
  if (rounded === 0) {
    return 'No change';
  }
  const unit = rounded === 1 ? 'year' : 'years';
  return yearsSaved > 0 ? `${rounded} ${unit} earlier` : `${rounded} ${unit} later`;
}

const styles = StyleSheet.create({
  center: {
    flexGrow: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  intro: {
    ...typography.body,
    color: colors.textSecondary,
  },
  card: {
    gap: spacing.sm,
  },
  label: {
    ...typography.label,
    color: colors.textSecondary,
    textTransform: 'uppercase',
  },
  value: {
    ...typography.title,
    color: colors.textPrimary,
    marginBottom: spacing.md,
  },
  sliderHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  sliderValue: {
    ...typography.title,
    color: colors.accent,
  },
  sliderBounds: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: -spacing.xs,
  },
  boundLabel: {
    ...typography.caption,
    color: colors.textMuted,
  },
  resultCard: {
    gap: spacing.sm,
  },
  resultRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  alignEnd: {
    alignItems: 'flex-end',
  },
  resultValue: {
    ...typography.title,
    color: colors.textPrimary,
    marginTop: spacing.xs,
  },
  resultValueAccent: {
    color: colors.accent,
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  difference: {
    ...typography.hero,
    fontSize: 32,
    color: colors.warm,
    marginTop: spacing.xs,
  },
});
