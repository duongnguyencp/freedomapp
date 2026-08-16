import { describe, expect, it } from 'vitest';

import { calculateCoastFINumber } from '../src';

describe('calculateCoastFINumber', () => {
  it('discounts the FI number back by the years remaining', () => {
    // 6B FI number, 7% return, 10 years out.
    const coastNumber = calculateCoastFINumber({
      fiNumber: 6_000_000_000,
      annualReturnRate: 0.07,
      yearsToTarget: 10,
    });
    expect(coastNumber).toBeCloseTo(6_000_000_000 / Math.pow(1.07, 10), 5);
    expect(coastNumber).toBeLessThan(6_000_000_000);
  });

  it('equals the FI number when the target is now (0 years out)', () => {
    expect(
      calculateCoastFINumber({ fiNumber: 6_000_000_000, annualReturnRate: 0.07, yearsToTarget: 0 }),
    ).toBe(6_000_000_000);
  });

  it('equals the FI number for a past/negative target (edge case)', () => {
    expect(
      calculateCoastFINumber({ fiNumber: 6_000_000_000, annualReturnRate: 0.07, yearsToTarget: -5 }),
    ).toBe(6_000_000_000);
  });
});
