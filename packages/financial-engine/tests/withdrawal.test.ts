import { describe, expect, it } from 'vitest';

import { calculateAnnualWithdrawal, calculateMonthlyWithdrawal } from '../src';

describe('calculateAnnualWithdrawal', () => {
  it('matches the FI number formula in reverse: net worth x SWR', () => {
    expect(calculateAnnualWithdrawal(6_000_000_000, 0.04)).toBe(240_000_000);
  });

  it('is 0 for 0 net worth', () => {
    expect(calculateAnnualWithdrawal(0, 0.04)).toBe(0);
  });

  it('clamps a negative net worth to 0 instead of a negative withdrawal', () => {
    expect(calculateAnnualWithdrawal(-1_000_000, 0.04)).toBe(0);
  });
});

describe('calculateMonthlyWithdrawal', () => {
  it('is the annual withdrawal divided by 12', () => {
    expect(calculateMonthlyWithdrawal(6_000_000_000, 0.04)).toBeCloseTo(20_000_000, 5);
  });
});
