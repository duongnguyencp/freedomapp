// Domain types shared by the financial engine and, later, the mobile app's
// repositories/stores. Kept here (not in apps/mobile) because they have no
// framework dependency and the engine is their natural source of truth.

export interface UserProfile {
  id: string;
  age: number;
  monthlyIncome: number;
  monthlySpending: number;
  /** Decimal, e.g. 0.07 for 7%. */
  expectedAnnualReturn: number;
  /** Decimal, e.g. 0.04 for 4%. */
  safeWithdrawalRate: number;
  currency: string;
  /**
   * Optional target age for a projected-net-worth checkpoint (e.g. "how
   * much will I have by age 35?"). Independent of the FI number/date —
   * just a fixed-age snapshot the user wants to track. Omitted if unset.
   */
  targetAge?: number;
  /**
   * Expected annual inflation, decimal (e.g. 0.03 for 3%). Optional —
   * callers should fall back to a documented default (3%) when unset,
   * and always label it as an assumption.
   */
  inflationRate?: number;
}

export type AssetCategory =
  | 'cash'
  | 'bank'
  | 'gold'
  | 'stocks'
  | 'etf'
  | 'crypto'
  | 'real_estate'
  | 'other';

export interface Asset {
  id: string;
  name: string;
  category: AssetCategory;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export type LiabilityCategory = 'loan' | 'credit_card' | 'mortgage' | 'other';

export interface Liability {
  id: string;
  name: string;
  category: LiabilityCategory;
  value: number;
  createdAt: string;
  updatedAt: string;
}

export interface FinancialSnapshot {
  id: string;
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  fiNumber: number;
  fiProgress: number;
}
