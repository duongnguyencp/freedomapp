/**
 * FI Number = Annual Spending / Safe Withdrawal Rate
 *
 * Example: 20,000,000 VND/month spending -> 240,000,000/year.
 * At a 4% SWR: 240,000,000 / 0.04 = 6,000,000,000 (6B).
 */
export function calculateFINumber(annualSpending: number, safeWithdrawalRate: number): number {
  if (safeWithdrawalRate <= 0) {
    // A 0% (or negative) withdrawal rate implies an unreachable, infinite
    // FI number rather than a division error.
    return Infinity;
  }
  return annualSpending / safeWithdrawalRate;
}
