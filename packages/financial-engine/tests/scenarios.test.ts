import { describe, expect, it } from 'vitest';

import { calculateFIScenarios } from '../src';

describe('calculateFIScenarios', () => {
  it('returns the 3 standard SWR scenarios (4%, 3.5%, 3%) in order', () => {
    const scenarios = calculateFIScenarios(240_000_000, 1_500_000_000);
    expect(scenarios.map((s) => s.safeWithdrawalRate)).toEqual([0.04, 0.035, 0.03]);
  });

  it('matches the prompt.md worked example at 4%', () => {
    const scenarios = calculateFIScenarios(240_000_000, 1_500_000_000);
    const at4Percent = scenarios[0];
    expect(at4Percent.fiNumber).toBe(6_000_000_000);
  });

  it('a lower SWR means a higher FI number (more conservative)', () => {
    const [at4, at35, at3] = calculateFIScenarios(240_000_000, 1_500_000_000);
    expect(at35.fiNumber).toBeGreaterThan(at4.fiNumber);
    expect(at3.fiNumber).toBeGreaterThan(at35.fiNumber);
  });

  it('withdrawal amount scales with net worth and SWR', () => {
    const scenarios = calculateFIScenarios(240_000_000, 6_000_000_000);
    expect(scenarios[0].annualWithdrawal).toBe(240_000_000);
    expect(scenarios[0].monthlyWithdrawal).toBeCloseTo(20_000_000, 5);
  });
});
