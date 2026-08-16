import { describe, expect, it } from 'vitest';

import { calculateRuleOf72Years } from '../src';

describe('calculateRuleOf72Years', () => {
  it('matches the classic mental-math example: 8% -> 9 years', () => {
    expect(calculateRuleOf72Years(0.08)).toBe(9);
  });

  it('matches 7% -> a bit over 10 years', () => {
    expect(calculateRuleOf72Years(0.07)).toBeCloseTo(10.29, 2);
  });

  it('returns null for a 0% or negative return (edge case)', () => {
    expect(calculateRuleOf72Years(0)).toBeNull();
    expect(calculateRuleOf72Years(-0.02)).toBeNull();
  });
});
