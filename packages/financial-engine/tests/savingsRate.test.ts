import { describe, expect, it } from 'vitest';

import { calculateSavingsRate } from '../src';

describe('calculateSavingsRate', () => {
  it('computes the percentage of income saved', () => {
    expect(calculateSavingsRate(50_000_000, 29_000_000)).toBeCloseTo(42, 5);
  });

  it('is 0% when spending equals income', () => {
    expect(calculateSavingsRate(30_000_000, 30_000_000)).toBe(0);
  });

  it('goes negative when spending exceeds income', () => {
    expect(calculateSavingsRate(20_000_000, 25_000_000)).toBeCloseTo(-25, 5);
  });

  it('returns 0 for 0 income instead of dividing by zero', () => {
    expect(calculateSavingsRate(0, 10_000_000)).toBe(0);
  });
});
