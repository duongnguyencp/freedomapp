/**
 * Safe Withdrawal amount = Net worth x Safe Withdrawal Rate.
 *
 * Example: net worth 6B, SWR 4% -> 240,000,000/year (20,000,000/month).
 */
export function calculateAnnualWithdrawal(netWorth: number, safeWithdrawalRate: number): number {
  return Math.max(0, netWorth) * Math.max(0, safeWithdrawalRate);
}

export function calculateMonthlyWithdrawal(netWorth: number, safeWithdrawalRate: number): number {
  return calculateAnnualWithdrawal(netWorth, safeWithdrawalRate) / 12;
}
