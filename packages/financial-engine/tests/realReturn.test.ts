import { describe, expect, it } from 'vitest';

import { calculateRealReturnRate } from '../src';

describe('calculateRealReturnRate', () => {
  it('matches formula.md\'s worked example: nominal 7%, inflation 3% -> ~3.88%', () => {
    expect(calculateRealReturnRate(0.07, 0.03)).toBeCloseTo(0.0388, 3);
  });

  it('is NOT the naive nominal-minus-inflation shortcut', () => {
    const real = calculateRealReturnRate(0.07, 0.03);
    expect(real).not.toBeCloseTo(0.04, 3); // 7% - 3% would be 4%
  });

  it('is 0 when nominal return equals inflation', () => {
    expect(calculateRealReturnRate(0.03, 0.03)).toBeCloseTo(0, 5);
  });

  it('can be negative when inflation outpaces nominal return (edge case)', () => {
    expect(calculateRealReturnRate(0.02, 0.05)).toBeLessThan(0);
  });
});
