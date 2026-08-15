import { useEffect, useMemo } from 'react';
import {
  calculateFINumber,
  calculateFIProgress,
  calculateNetWorth,
  calculateTotalAssets,
  calculateTotalLiabilities,
  type Asset,
  type Liability,
  type UserProfile,
} from 'financial-engine';

import { useAssetsStore } from '@/stores/assetsStore';
import { useLiabilitiesStore } from '@/stores/liabilitiesStore';
import { useProfileStore } from '@/stores/profileStore';

export interface FinancialSummary {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  fiNumber: number;
  fiProgress: number;
}

export interface FinancialSummaryResult {
  status: 'loading' | 'ready';
  summary: FinancialSummary | null;
  profile: UserProfile | null;
  assets: Asset[];
  liabilities: Liability[];
}

/**
 * Shared source of truth for "where do things stand right now" — the one
 * calculation every screen that touches net worth/FI number should read
 * from (Dashboard, History's "record snapshot"), instead of each
 * re-deriving it from the stores.
 */
export function useFinancialSummary(): FinancialSummaryResult {
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

  const summary = useMemo<FinancialSummary | null>(() => {
    if (!allReady || !profile) {
      return null;
    }

    const totalAssets = calculateTotalAssets(assets);
    const totalLiabilities = calculateTotalLiabilities(liabilities);
    const netWorth = calculateNetWorth(totalAssets, totalLiabilities);
    const fiNumber = calculateFINumber(profile.monthlySpending * 12, profile.safeWithdrawalRate);
    const fiProgress = calculateFIProgress(netWorth, fiNumber);

    return { totalAssets, totalLiabilities, netWorth, fiNumber, fiProgress };
  }, [allReady, profile, assets, liabilities]);

  return { status: allReady ? 'ready' : 'loading', summary, profile, assets, liabilities };
}
