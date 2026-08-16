/**
 * Real return: what the nominal (headline) investment return is actually
 * worth after inflation eats into purchasing power.
 *
 * Deliberately NOT `nominal - inflation` (a common but imprecise
 * shortcut) — uses the exact compounding formula:
 *
 * Real Return = (1 + Nominal Return) / (1 + Inflation) - 1
 *
 * Example: nominal 7%, inflation 3% -> real ≈ 3.88% (not 4%).
 */
export function calculateRealReturnRate(nominalReturn: number, inflationRate: number): number {
  return (1 + nominalReturn) / (1 + inflationRate) - 1;
}

/** Used whenever a profile hasn't set an explicit inflation assumption. */
export const DEFAULT_INFLATION_RATE = 0.03;
