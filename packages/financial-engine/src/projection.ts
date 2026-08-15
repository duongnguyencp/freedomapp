/**
 * Deterministic compound-growth projections.
 *
 * Assumptions (documented, not hidden):
 * - Growth compounds monthly. An annual rate `r` is converted to a monthly
 *   rate as (1 + r)^(1/12) - 1, not r/12 — this compounds correctly over a
 *   year instead of slightly overstating growth.
 * - Contributions are added at the end of each month, after that month's
 *   growth is applied.
 * - No inflation adjustment, no taxes, no market volatility — this is a
 *   straight-line planning estimate, not a forecast.
 */

export interface FutureValueParams {
  presentValue: number;
  monthlyContribution: number;
  /** Decimal annual return, e.g. 0.07 for 7%. */
  annualReturnRate: number;
  months: number;
}

export function calculateFutureValue({
  presentValue,
  monthlyContribution,
  annualReturnRate,
  months,
}: FutureValueParams): number {
  const monthlyRate = annualRateToMonthlyRate(annualReturnRate);

  if (months <= 0) {
    return presentValue;
  }

  if (monthlyRate === 0) {
    return presentValue + monthlyContribution * months;
  }

  const growthFactor = Math.pow(1 + monthlyRate, months);
  const futureValueOfPresent = presentValue * growthFactor;
  const futureValueOfContributions =
    monthlyContribution * ((growthFactor - 1) / monthlyRate);

  return futureValueOfPresent + futureValueOfContributions;
}

export interface YearsToFIParams {
  currentNetWorth: number;
  monthlyInvestment: number;
  /** Decimal annual return, e.g. 0.07 for 7%. */
  annualReturnRate: number;
  fiNumber: number;
  /** Planning horizon. Beyond this, FI is treated as unreachable. Default 100. */
  maxYears?: number;
}

const DEFAULT_MAX_YEARS = 100;

/**
 * Simulates month by month until net worth reaches the FI number.
 * Returns years (to two decimal places), or `null` if FI is not reached
 * within `maxYears`.
 */
export function calculateYearsToFI({
  currentNetWorth,
  monthlyInvestment,
  annualReturnRate,
  fiNumber,
  maxYears = DEFAULT_MAX_YEARS,
}: YearsToFIParams): number | null {
  if (fiNumber <= 0) {
    return 0;
  }
  if (currentNetWorth >= fiNumber) {
    return 0;
  }

  const monthlyRate = annualRateToMonthlyRate(annualReturnRate);
  const maxMonths = Math.round(maxYears * 12);

  let balance = currentNetWorth;
  for (let month = 1; month <= maxMonths; month++) {
    balance = balance * (1 + monthlyRate) + monthlyInvestment;
    if (balance >= fiNumber) {
      return roundToTwoDecimals(month / 12);
    }
  }

  return null;
}

export interface ProjectedFIDate {
  year: number;
  /** 1-12 */
  month: number;
}

/**
 * Projects the calendar year/month FI is reached, relative to `fromDate`.
 * Returns `null` when FI cannot be estimated under the current assumptions
 * — the caller should show:
 * "FI date cannot be estimated with current assumptions."
 */
export function calculateProjectedFIDate(
  params: YearsToFIParams,
  fromDate: Date,
): ProjectedFIDate | null {
  const years = calculateYearsToFI(params);
  if (years === null) {
    return null;
  }

  const totalMonths = Math.round(years * 12);
  const projected = new Date(
    Date.UTC(fromDate.getUTCFullYear(), fromDate.getUTCMonth() + totalMonths, 1),
  );

  return {
    year: projected.getUTCFullYear(),
    month: projected.getUTCMonth() + 1,
  };
}

function annualRateToMonthlyRate(annualRate: number): number {
  return Math.pow(1 + annualRate, 1 / 12) - 1;
}

function roundToTwoDecimals(value: number): number {
  return Math.round(value * 100) / 100;
}
