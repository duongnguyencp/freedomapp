import { useMemo, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import {
  calculateFIScenarios,
  calculateProjectedFIDate,
  calculateRuleOf72Years,
  calculateWhatIf,
} from 'financial-engine';

import { Card } from '@/components/Card';
import { FormField } from '@/components/FormField';
import { GlassSurface } from '@/components/GlassSurface';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing, typography } from '@/constants/theme';
import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { formatCompactVND, formatPercent } from '@/services/format';

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

  const annualSpending = profile.monthlySpending * 12;
  const scenarios = calculateFIScenarios(annualSpending, summary.netWorth);
  const ruleOf72Years = calculateRuleOf72Years(profile.expectedAnnualReturn);

  return (
    <Screen edges={[]}>
      <Text style={styles.intro}>
        Xem việc đầu tư thêm mỗi tháng thay đổi ngày đạt FI của bạn thế nào.
      </Text>

      <Card style={styles.card}>
        <Text style={styles.label}>Đầu tư hàng tháng hiện tại</Text>
        <Text style={styles.value}>{formatCompactVND(baseMonthlyInvestment)}</Text>

        <View style={styles.sliderHeader}>
          <Text style={styles.label}>Thêm mỗi tháng</Text>
          <Text style={styles.sliderValue}>+{formatCompactVND(additionalInvestment)}</Text>
        </View>
        <GlassSurface tone="light" borderRadius={radius.pill} style={styles.sliderGlass}>
          <Slider
            style={styles.slider}
            minimumValue={0}
            maximumValue={MAX_ADDITIONAL_INVESTMENT}
            step={SLIDER_STEP}
            value={additionalInvestment}
            onValueChange={setAdditionalInvestment}
            minimumTrackTintColor={colors.accent}
            maximumTrackTintColor="transparent"
            thumbTintColor={colors.accent}
          />
        </GlassSurface>
        <View style={styles.sliderBounds}>
          <Text style={styles.boundLabel}>+0</Text>
          <Text style={styles.boundLabel}>+{formatCompactVND(MAX_ADDITIONAL_INVESTMENT)}</Text>
        </View>
      </Card>

      <Card style={styles.card}>
        <FormField
          label="Lợi nhuận đầu tư kỳ vọng/năm"
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
            <Text style={styles.label}>Ngày đạt FI hiện tại</Text>
            <Text style={styles.resultValue}>{currentDate ? currentDate.year : '—'}</Text>
          </View>
          <View style={styles.alignEnd}>
            <Text style={styles.label}>Ngày đạt FI mới</Text>
            <Text style={[styles.resultValue, styles.resultValueAccent]}>
              {newDate ? newDate.year : '—'}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.label}>Chênh lệch</Text>
        <Text style={styles.difference}>{difference}</Text>
      </Card>

      <Card style={styles.card}>
        <Text style={styles.sectionTitle}>Theo tỷ lệ rút an toàn</Text>
        <Text style={styles.sectionSubtitle}>
          Chi tiêu {formatCompactVND(annualSpending)}/năm, tài sản ròng hiện tại{' '}
          {formatCompactVND(summary.netWorth)}
        </Text>

        <View style={styles.tableHeaderRow}>
          <Text style={[styles.tableCell, styles.tableHeaderText]}>SWR</Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.tableCellRight]}>
            Mục tiêu FI
          </Text>
          <Text style={[styles.tableCell, styles.tableHeaderText, styles.tableCellRight]}>
            Rút được/tháng
          </Text>
        </View>
        {scenarios.map((scenario) => (
          <View key={scenario.safeWithdrawalRate} style={styles.tableRow}>
            <Text style={styles.tableCell}>{formatPercent(scenario.safeWithdrawalRate * 100, 1)}</Text>
            <Text style={[styles.tableCell, styles.tableCellRight]}>
              {formatCompactVND(scenario.fiNumber)}
            </Text>
            <Text style={[styles.tableCell, styles.tableCellRight]}>
              {formatCompactVND(scenario.monthlyWithdrawal)}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <Text style={styles.label}>Rule of 72</Text>
        <Text style={styles.sectionSubtitle}>
          {ruleOf72Years !== null
            ? `Với lợi nhuận kỳ vọng ${formatPercent(profile.expectedAnnualReturn * 100, 1)}/năm, tài sản của bạn sẽ tự nhân đôi sau khoảng ${ruleOf72Years.toFixed(1)} năm (không tính góp thêm).`
            : 'Cần lợi nhuận kỳ vọng lớn hơn 0% để ước tính thời gian nhân đôi tài sản.'}
        </Text>
      </Card>

      <View style={styles.disclaimerWrap}>
        <Text style={styles.warningText}>
          ⚠️ Quy tắc rút 4% dựa trên dữ liệu thị trường Mỹ, giả định nghỉ hưu ~30 năm. Nếu bạn
          nghỉ hưu sớm (dưới 45 tuổi), nên cân nhắc tỷ lệ rút thấp hơn (3–3,5%) vì thời gian sống
          sau đó dài hơn.
        </Text>
        <Text style={styles.warningText}>
          ⚠️ "Sequence of returns risk": thị trường sụt mạnh ngay những năm đầu rút tiền nguy hiểm
          hơn nhiều so với sụt muộn, dù lợi nhuận trung bình dài hạn giống nhau.
        </Text>
        <Text style={styles.disclaimerText}>
          Đây là công cụ tính toán tham khảo dựa trên giả định bạn tự nhập, không phải lời khuyên
          đầu tư hay tài chính cá nhân.
        </Text>
      </View>
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
    return '—';
  }
  const rounded = Math.round(Math.abs(yearsSaved));
  if (rounded === 0) {
    return 'Không đổi';
  }
  return yearsSaved > 0 ? `Sớm hơn ${rounded} năm` : `Muộn hơn ${rounded} năm`;
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
  sliderGlass: {
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
  },
  slider: {
    width: '100%',
    height: 40,
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
  sectionTitle: {
    ...typography.body,
    fontWeight: '600',
    color: colors.textPrimary,
  },
  sectionSubtitle: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  tableHeaderRow: {
    flexDirection: 'row',
    marginTop: spacing.sm,
    paddingBottom: spacing.xs,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: spacing.xs,
  },
  tableCell: {
    ...typography.caption,
    color: colors.textPrimary,
    flex: 1,
  },
  tableCellRight: {
    textAlign: 'right',
  },
  tableHeaderText: {
    color: colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  disclaimerWrap: {
    gap: spacing.sm,
    paddingHorizontal: spacing.xs,
  },
  warningText: {
    ...typography.caption,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  disclaimerText: {
    ...typography.caption,
    color: colors.textMuted,
    lineHeight: 18,
    fontStyle: 'italic',
  },
});
