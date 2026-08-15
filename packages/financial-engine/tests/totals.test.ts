import { describe, expect, it } from 'vitest';

import { calculateNetWorth, calculateTotalAssets, calculateTotalLiabilities } from '../src';
import type { Asset, Liability } from '../src';

function asset(value: number): Asset {
  return {
    id: crypto.randomUUID(),
    name: 'Test asset',
    category: 'cash',
    value,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };
}

function liability(value: number): Liability {
  return {
    id: crypto.randomUUID(),
    name: 'Test liability',
    category: 'loan',
    value,
    createdAt: '2026-01-01',
    updatedAt: '2026-01-01',
  };
}

describe('calculateTotalAssets', () => {
  it('sums asset values', () => {
    const assets = [asset(120_000_000), asset(170_000_000), asset(80_000_000)];
    expect(calculateTotalAssets(assets)).toBe(370_000_000);
  });

  it('returns 0 for an empty list', () => {
    expect(calculateTotalAssets([])).toBe(0);
  });
});

describe('calculateTotalLiabilities', () => {
  it('sums liability values', () => {
    const liabilities = [liability(50_000_000), liability(20_000_000)];
    expect(calculateTotalLiabilities(liabilities)).toBe(70_000_000);
  });

  it('returns 0 for an empty list', () => {
    expect(calculateTotalLiabilities([])).toBe(0);
  });
});

describe('calculateNetWorth', () => {
  it('subtracts liabilities from assets', () => {
    expect(calculateNetWorth(520_000_000, 50_000_000)).toBe(470_000_000);
  });

  it('can be negative when liabilities exceed assets', () => {
    expect(calculateNetWorth(10_000_000, 50_000_000)).toBe(-40_000_000);
  });
});
