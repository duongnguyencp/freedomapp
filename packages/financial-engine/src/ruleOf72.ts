/**
 * Rule of 72 — a quick mental-math estimate for how many years it takes
 * an amount to double at a given annual rate of return.
 *
 * Years to double ≈ 72 / (annual return rate as a whole percent)
 */
export function calculateRuleOf72Years(annualReturnRate: number): number | null {
  if (annualReturnRate <= 0) {
    return null;
  }
  return 72 / (annualReturnRate * 100);
}
