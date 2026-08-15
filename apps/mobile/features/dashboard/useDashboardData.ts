import { useEffect, useMemo } from 'react';
import { calculateProjectedFIDate, calculateSavingsRate, type ProjectedFIDate } from 'financial-engine';

import { useFinancialSummary } from '@/hooks/useFinancialSummary';
import { monthLabel } from '@/services/date';
import { useSnapshotsStore } from '@/stores/snapshotsStore';

export interface DashboardData {
  netWorth: number;
  fiNumber: number;
  fiProgress: number;
  remaining: number;
  savingsRate: number;
  monthlyInvestment: number;
  projectedFIDate: ProjectedFIDate | null;
  netWorthHistory: { label: string; value: number }[];
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

    return {
      netWorth,
      fiNumber,
      fiProgress,
      remaining,
      savingsRate,
      monthlyInvestment,
      projectedFIDate,
      netWorthHistory,
    };
  }, [allReady, summary, profile, snapshots]);

  return { status: allReady ? 'ready' : 'loading', data };
}
