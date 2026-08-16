import { useEffect, useMemo } from 'react';
import {
  calculateCoastFINumber,
  calculateFutureValue,
  calculateMonthlyWithdrawal,
  calculateProjectedFIDate,
  calculateRealReturnRate,
  calculateSavingsRate,
  DEFAULT_INFLATION_RATE,
  type ProjectedFIDate,
} from 'financial-engine';

import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { monthLabel } from '@/services/date';
import { useSnapshotsStore } from '@/stores/snapshotsStore';

const MAX_GOAL_CHART_YEARS = 40;

export interface DashboardData {
  netWorth: number;
  fiNumber: number;
  fiProgress: number;
  remaining: number;
  savingsRate: number;
  monthlyInvestment: number;
  projectedFIDate: ProjectedFIDate | null;
  netWorthHistory: { label: string; value: number }[];
  /** Set only when the profile has a targetAge later than the current age. */
  targetAgeProjection: {
    age: number;
    value: number;
    monthlyWithdrawal: number;
    /** Coast FI: net worth needed *today* to reach the FI number by targetAge with no further contributions. */
    coastFINumber: number;
    coastAchieved: boolean;
  } | null;
  /** Forward-looking path from today to the FI goal — year label vs. projected net worth. */
  goalProjection: { label: string; value: number }[];
  /** Nominal return minus inflation (compounded correctly, not a naive subtraction). */
  realReturnRate: number;
  inflationRate: number;
}

/**
 * Everything the Home dashboard shows. financial-engine math lives in
 * useFinancialSummary (shared with History); this hook only adds the
 * projection and shapes the snapshot history for the chart.
 */
export function useDashboardData(): { status: 'loading' | 'ready'; data: DashboardData | null } {
  const { status: summaryStatus, summary, profile } = useFinancialSummary();

  const snapshotsStatus = useSnapshotsStore((state) => state.status);
  const snapshots = useSnapshotsStore((state) => state.snapshots);
  const loadSnapshots = useSnapshotsStore((state) => state.load);

  useEffect(() => {
    if (snapshotsStatus === 'idle') {
      loadSnapshots();
    }
  }, [snapshotsStatus, loadSnapshots]);

  const allReady = summaryStatus === 'ready' && snapshotsStatus === 'ready';

  const data = useMemo<DashboardData | null>(() => {
    if (!allReady || !summary || !profile) {
      return null;
    }

    const { netWorth, fiNumber, fiProgress } = summary;
    const remaining = Math.max(0, fiNumber - netWorth);

    const savingsRate = calculateSavingsRate(profile.monthlyIncome, profile.monthlySpending);
    const monthlyInvestment = Math.max(0, profile.monthlyIncome - profile.monthlySpending);

    const projectedFIDate = calculateProjectedFIDate(
      {
        currentNetWorth: netWorth,
        monthlyInvestment,
        annualReturnRate: profile.expectedAnnualReturn,
        fiNumber,
      },
      new Date(),
    );

    const netWorthHistory = snapshots.map((snapshot) => ({
      label: monthLabel(snapshot.date),
      value: snapshot.netWorth,
    }));

    const inflationRate = profile.inflationRate ?? DEFAULT_INFLATION_RATE;
    // Coast FIRE discounts the FI number — which is stated in TODAY's
    // purchasing power — back to the present. That must use the REAL
    // (inflation-adjusted) return, not the nominal one, or it understates
    // how much is actually needed. (formula.md section 15.)
    const realReturnRate = calculateRealReturnRate(profile.expectedAnnualReturn, inflationRate);

    let targetAgeProjection: DashboardData['targetAgeProjection'] = null;
    if (profile.targetAge !== undefined && profile.targetAge > profile.age) {
      const months = Math.round((profile.targetAge - profile.age) * 12);
      const value = calculateFutureValue({
        presentValue: netWorth,
        monthlyContribution: monthlyInvestment,
        annualReturnRate: profile.expectedAnnualReturn,
        months,
      });
      const monthlyWithdrawal = calculateMonthlyWithdrawal(value, profile.safeWithdrawalRate);
      const coastFINumber = calculateCoastFINumber({
        fiNumber,
        annualReturnRate: realReturnRate,
        yearsToTarget: profile.targetAge - profile.age,
      });
      targetAgeProjection = {
        age: profile.targetAge,
        value,
        monthlyWithdrawal,
        coastFINumber,
        coastAchieved: netWorth >= coastFINumber,
      };
    }

    // Forward path to the goal: one point per year from now until the FI
    // date (capped), so "years" reads on the x-axis and "accumulated
    // money" on the y-axis — a projection, not history like netWorthHistory.
    const goalProjection: { label: string; value: number }[] = [];
    if (projectedFIDate) {
      const currentYear = new Date().getFullYear();
      const totalYears = Math.min(
        Math.max(projectedFIDate.year - currentYear, 1),
        MAX_GOAL_CHART_YEARS,
      );
      for (let year = 0; year <= totalYears; year++) {
        const value = calculateFutureValue({
          presentValue: netWorth,
          monthlyContribution: monthlyInvestment,
          annualReturnRate: profile.expectedAnnualReturn,
          months: year * 12,
        });
        goalProjection.push({ label: String(currentYear + year), value });
      }
    }

    return {
      netWorth,
      fiNumber,
      fiProgress,
      remaining,
      savingsRate,
      monthlyInvestment,
      projectedFIDate,
      netWorthHistory,
      targetAgeProjection,
      goalProjection,
      realReturnRate,
      inflationRate,
    };
  }, [allReady, summary, profile, snapshots]);

  return { status: allReady ? 'ready' : 'loading', data };
}
