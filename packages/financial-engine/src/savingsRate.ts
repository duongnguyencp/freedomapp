/**
 * Savings Rate = (Monthly Income - Monthly Spending) / Monthly Income x 100
 *
 * Can be negative (spending more than income) — that's a real, useful
 * signal, so it is not clamped.
 */
export function calculateSavingsRate(monthlyIncome: number, monthlySpending: number): number {
  if (monthlyIncome <= 0) {
    return 0;
  }
  return ((monthlyIncome - monthlySpending) / monthlyIncome) * 100;
}
