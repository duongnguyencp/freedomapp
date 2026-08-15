import { describe, expect, it } from 'vitest';

import { calculateFINumber } from '../src';

describe('calculateFINumber', () => {
  it('matches the prompt example: 240M annual spending at 4% SWR = 6B', () => {
    expect(calculateFINumber(240_000_000, 0.04)).toBe(6_000_000_000);
  });

  it('handles a 0% SWR as unreachable (Infinity), not a crash', () => {
    expect(calculateFINumber(240_000_000, 0)).toBe(Infinity);
  });

  it('handles a negative SWR the same way', () => {
    expect(calculateFINumber(240_000_000, -0.01)).toBe(Infinity);
  });

  it('returns 0 for 0 annual spending', () => {
    expect(calculateFINumber(0, 0.04)).toBe(0);
  });
});
