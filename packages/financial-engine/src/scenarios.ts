import { calculateFINumber } from './fiNumber';
import { calculateAnnualWithdrawal, calculateMonthlyWithdrawal } from './withdrawal';

/**
 * The three conventional safe-withdrawal-rate scenarios: 4% (standard,
 * ~30-year retirement), 3.5% and 3% (more conservative — longer/earlier
 * retirement horizons).
 */
export const STANDARD_SWR_SCENARIOS = [0.04, 0.035, 0.03] as const;

export interface FIScenario {
  safeWithdrawalRate: number;
  fiNumber: number;
  annualWithdrawal: number;
  monthlyWithdrawal: number;
}

/**
 * FI number and withdrawal amount at each of the standard SWR scenarios,
 * for the same annual spending and net worth. Lets the user see how much
 * more conservative (or aggressive) assumptions change both numbers side
 * by side, instead of only ever seeing their one chosen SWR.
 */
export function calculateFIScenarios(annualSpending: number, netWorth: number): FIScenario[] {
  return STANDARD_SWR_SCENARIOS.map((safeWithdrawalRate) => ({
    safeWithdrawalRate,
    fiNumber: calculateFINumber(annualSpending, safeWithdrawalRate),
    annualWithdrawal: calculateAnnualWithdrawal(netWorth, safeWithdrawalRate),
    monthlyWithdrawal: calculateMonthlyWithdrawal(netWorth, safeWithdrawalRate),
  }));
}
