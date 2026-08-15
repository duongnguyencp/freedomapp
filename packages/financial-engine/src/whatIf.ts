import { calculateYearsToFI, type YearsToFIParams } from './projection';

export interface WhatIfAdjustment {
  /** Added on top of the base monthlyInvestment. Can be negative. */
  additionalMonthlyInvestment?: number;
  /** Overrides the base annualReturnRate entirely, if provided. */
  newAnnualReturnRate?: number;
}

export interface WhatIfResult {
  currentYearsToFI: number | null;
  newYearsToFI: number | null;
  /** Positive = FI arrives sooner. `null` if either side is unreachable. */
  yearsSaved: number | null;
}

/**
 * "What if I invest more?" — compares time-to-FI under the current plan
 * against an adjusted monthly investment and/or expected return.
 */
export function calculateWhatIf(
  base: YearsToFIParams,
  adjustment: WhatIfAdjustment,
): WhatIfResult {
  const currentYearsToFI = calculateYearsToFI(base);

  const newYearsToFI = calculateYearsToFI({
    ...base,
    monthlyInvestment: base.monthlyInvestment + (adjustment.additionalMonthlyInvestment ?? 0),
    annualReturnRate: adjustment.newAnnualReturnRate ?? base.annualReturnRate,
  });

  const yearsSaved =
    currentYearsToFI !== null && newYearsToFI !== null
      ? Math.round((currentYearsToFI - newYearsToFI) * 100) / 100
      : null;

  return { currentYearsToFI, newYearsToFI, yearsSaved };
}
