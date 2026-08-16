// Live inflation lookup (World Bank, Vietnam CPI YoY %) — same
// "opt-in, always falls back to manual entry" pattern as goldPrice.ts.

const INFLATION_API_URL =
  'https://api.worldbank.org/v2/country/VNM/indicator/FP.CPI.TOTL.ZG?format=json';

export interface InflationRate {
  /** Decimal, e.g. 0.033 for 3.3%. */
  rate: number;
  /** Year the figure is for — World Bank data lags by ~1 year. */
  year: number;
}

interface WorldBankResponse {
  0: unknown;
  1: { date: string; value: number | null }[];
}

export async function fetchLatestInflationRate(): Promise<InflationRate> {
  const response = await fetch(INFLATION_API_URL);
  if (!response.ok) {
    throw new Error('Không lấy được số liệu lạm phát');
  }

  const json = (await response.json()) as WorldBankResponse;
  const points = json?.[1];
  const latest = Array.isArray(points) ? points.find((point) => point.value !== null) : undefined;

  if (!latest || typeof latest.value !== 'number') {
    throw new Error('Dữ liệu lạm phát không hợp lệ');
  }

  return { rate: latest.value / 100, year: Number(latest.date) };
}
