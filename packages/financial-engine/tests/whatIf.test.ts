import { describe, expect, it } from 'vitest';

import { calculateWhatIf } from '../src';

describe('calculateWhatIf', () => {
  const base = {
    currentNetWorth: 1_700_000_000,
    monthlyInvestment: 20_000_000,
    annualReturnRate: 0.07,
    fiNumber: 6_000_000_000,
  };

  it('reaches FI sooner with a higher monthly investment', () => {
    const result = calculateWhatIf(base, { additionalMonthlyInvestment: 10_000_000 });

    expect(result.currentYearsToFI).not.toBeNull();
    expect(result.newYearsToFI).not.toBeNull();
    expect(result.newYearsToFI!).toBeLessThan(result.currentYearsToFI!);
    expect(result.yearsSaved!).toBeGreaterThan(0);
  });

  it('reaches FI sooner with a higher expected return', () => {
    const result = calculateWhatIf(base, { newAnnualReturnRate: 0.1 });

    expect(result.newYearsToFI!).toBeLessThan(result.currentYearsToFI!);
    expect(result.yearsSaved!).toBeGreaterThan(0);
  });

  it('is a no-op with no adjustment', () => {
    const result = calculateWhatIf(base, {});
    expect(result.newYearsToFI).toBe(result.currentYearsToFI);
    expect(result.yearsSaved).toBe(0);
  });

  it('propagates null when the plan is unreachable (edge case)', () => {
    const result = calculateWhatIf(
      { ...base, currentNetWorth: 0, monthlyInvestment: 0, annualReturnRate: 0, maxYears: 1 },
      { additionalMonthlyInvestment: 0 },
    );
    expect(result.currentYearsToFI).toBeNull();
    expect(result.newYearsToFI).toBeNull();
    expect(result.yearsSaved).toBeNull();
  });
});
