import { describe, expect, it } from 'vitest';

import { calculateFIProgress } from '../src';

describe('calculateFIProgress', () => {
  it('matches the prompt example: 1.5B net worth / 6B FI number = 25%', () => {
    expect(calculateFIProgress(1_500_000_000, 6_000_000_000)).toBe(25);
  });

  it('is 0% at 0 net worth', () => {
    expect(calculateFIProgress(0, 6_000_000_000)).toBe(0);
  });

  it('caps at 100% once FI is reached', () => {
    expect(calculateFIProgress(7_000_000_000, 6_000_000_000)).toBe(100);
  });

  it('is 0% when net worth is negative', () => {
    expect(calculateFIProgress(-1_000_000, 6_000_000_000)).toBe(0);
  });

  it('returns 0 for a 0 or invalid FI number instead of Infinity/NaN', () => {
    expect(calculateFIProgress(1_000_000, 0)).toBe(0);
    expect(calculateFIProgress(1_000_000, Infinity)).toBe(0);
  });
});
