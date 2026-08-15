import { useEffect, useMemo } from 'react';
import {
  calculateFINumber,
  calculateFIProgress,
  calculateNetWorth,
  calculateProjectedFIDate,
  calculateSavingsRate,
  calculateTotalAssets,
  calculateTotalLiabilities,
  type ProjectedFIDate,
} from 'financial-engine';

import { useAssetsStore } from '@/stores/assetsStore';
import { useLiabilitiesStore } from '@/stores/liabilitiesStore';
import { useProfileStore } from '@/stores/profileStore';

export interface DashboardData {
  netWorth: number;
  fiNumber: number;
  fiProgress: number;
  remaining: number;
  savingsRate: number;
  monthlyInvestment: number;
  projectedFIDate: ProjectedFIDate | null;
}

/**
 * Combines profile + assets + liabilities with financial-engine to derive
 * everything the dashboard shows. No calculation lives in the screen —
 * this hook is the only place that touches the engine for Home.
 */
export function useDashboardData(): { status: 'loading' | 'ready'; data: DashboardData | null } {
  const profileStatus = useProfileStore((state) => state.status);
  const profile = useProfileStore((state) => state.profile);
  const loadProfile = useProfileStore((state) => state.load);

  const assetsStatus = useAssetsStore((state) => state.status);
  const assets = useAssetsStore((state) => state.assets);
  const loadAssets = useAssetsStore((state) => state.load);

  const liabilitiesStatus = useLiabilitiesStore((state) => state.status);
  const liabilities = useLiabilitiesStore((state) => state.liabilities);
  const loadLiabilities = useLiabilitiesStore((state) => state.load);

  useEffect(() => {
    if (profileStatus === 'idle') loadProfile();
    if (assetsStatus === 'idle') loadAssets();
    if (liabilitiesStatus === 'idle') loadLiabilities();
  }, [profileStatus, assetsStatus, liabilitiesStatus, loadProfile, loadAssets, loadLiabilities]);

  const allReady = profileStatus === 'ready' && assetsStatus === 'ready' && liabilitiesStatus === 'ready';

  const data = useMemo<DashboardData | null>(() => {
    if (!allReady || !profile) {
      return null;
    }

    const totalAssets = calculateTotalAssets(assets);
    const totalLiabilities = calculateTotalLiabilities(liabilities);
    const netWorth = calculateNetWorth(totalAssets, totalLiabilities);

    const annualSpending = profile.monthlySpending * 12;
    const fiNumber = calculateFINumber(annualSpending, profile.safeWithdrawalRate);
    const fiProgress = calculateFIProgress(netWorth, fiNumber);
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

    return { netWorth, fiNumber, fiProgress, remaining, savingsRate, monthlyInvestment, projectedFIDate };
  }, [allReady, profile, assets, liabilities]);

  return { status: allReady ? 'ready' : 'loading', data };
}
