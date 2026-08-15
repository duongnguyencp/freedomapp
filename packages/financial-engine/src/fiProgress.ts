/**
 * FI Progress = Current Net Worth / FI Number x 100, capped at 100.
 *
 * Example: net worth 1.5B, FI number 6B -> 25%.
 */
export function calculateFIProgress(netWorth: number, fiNumber: number): number {
  if (fiNumber <= 0 || !Number.isFinite(fiNumber)) {
    return 0;
  }
  const progress = (netWorth / fiNumber) * 100;
  return Math.min(100, Math.max(0, progress));
}
