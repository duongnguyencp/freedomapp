import { describe, expect, it } from 'vitest';

import { calculateFutureValue, calculateProjectedFIDate, calculateYearsToFI } from '../src';

describe('calculateFutureValue', () => {
  it('grows a lump sum by exactly the annual rate over 12 months', () => {
    // Monthly rate is derived so that 12 compounds equal the annual rate
    // exactly: (1 + monthlyRate)^12 === 1 + annualRate.
    const fv = calculateFutureValue({
      presentValue: 1_000_000,
      monthlyContribution: 0,
      annualReturnRate: 0.12,
      months: 12,
    });
    expect(fv).toBeCloseTo(1_120_000, 2);
  });

  it('is a simple sum when the rate is 0%', () => {
    const fv = calculateFutureValue({
      presentValue: 100_000,
      monthlyContribution: 10_000,
      annualReturnRate: 0,
      months: 12,
    });
    expect(fv).toBe(100_000 + 10_000 * 12);
  });

  it('returns the present value unchanged for 0 months', () => {
    const fv = calculateFutureValue({
      presentValue: 500_000,
      monthlyContribution: 50_000,
      annualReturnRate: 0.07,
      months: 0,
    });
    expect(fv).toBe(500_000);
  });
});

describe('calculateYearsToFI', () => {
  it('is 0 when already at or above the FI number', () => {
    expect(
      calculateYearsToFI({
        currentNetWorth: 6_000_000_000,
        monthlyInvestment: 20_000_000,
        annualReturnRate: 0.07,
        fiNumber: 6_000_000_000,
      }),
    ).toBe(0);
  });

  it('reaches a 0%-growth target by simple accumulation', () => {
    const years = calculateYearsToFI({
      currentNetWorth: 0,
      monthlyInvestment: 1_000,
      annualReturnRate: 0,
      fiNumber: 12_000,
    });
    expect(years).toBe(1);
  });

  it('returns null when FI is unreachable within the horizon (edge case)', () => {
    const years = calculateYearsToFI({
      currentNetWorth: 0,
      monthlyInvestment: 0,
      annualReturnRate: 0,
      fiNumber: 1_000,
      maxYears: 1,
    });
    expect(years).toBeNull();
  });

  it('reaches FI faster with a higher monthly investment', () => {
    const base = {
      currentNetWorth: 100_000_000,
      annualReturnRate: 0.07,
      fiNumber: 6_000_000_000,
    };
    const slower = calculateYearsToFI({ ...base, monthlyInvestment: 20_000_000 })!;
    const faster = calculateYearsToFI({ ...base, monthlyInvestment: 30_000_000 })!;
    expect(faster).toBeLessThan(slower);
  });
});

describe('calculateProjectedFIDate', () => {
  const fromDate = new Date(Date.UTC(2026, 0, 1)); // January 2026

  it('returns the starting month when already at FI', () => {
    const result = calculateProjectedFIDate(
      {
        currentNetWorth: 6_000_000_000,
        monthlyInvestment: 20_000_000,
        annualReturnRate: 0.07,
        fiNumber: 6_000_000_000,
      },
      fromDate,
    );
    expect(result).toEqual({ year: 2026, month: 1 });
  });

  it('projects a future year/month when FI is years away', () => {
    const result = calculateProjectedFIDate(
      {
        currentNetWorth: 0,
        monthlyInvestment: 1_000,
        annualReturnRate: 0,
        fiNumber: 24_000,
      },
      fromDate,
    );
    // 24 months of 1,000 with 0% growth -> exactly 2 years later.
    expect(result).toEqual({ year: 2028, month: 1 });
  });

  it('returns null ("cannot be estimated") when unreachable (edge case)', () => {
    const result = calculateProjectedFIDate(
      {
        currentNetWorth: 0,
        monthlyInvestment: 0,
        annualReturnRate: 0,
        fiNumber: 1_000,
        maxYears: 1,
      },
      fromDate,
    );
    expect(result).toBeNull();
  });
});
