// Presentation-only formatting helpers. No financial math lives here —
// that belongs to packages/financial-engine (Phase 2).
//
// Vietnamese number convention: comma as the decimal separator, dot as
// the thousands separator (e.g. "1.700.000" not "1,700,000").

export function formatCompactVND(value: number): string {
  const billions = value / 1_000_000_000;
  if (Math.abs(billions) >= 1) {
    return `₫${trimZero(billions)} tỷ`;
  }
  const millions = value / 1_000_000;
  return `₫${trimZero(millions)} triệu`;
}

export function formatVND(value: number): string {
  return `₫${Math.round(value).toLocaleString('vi-VN')}`;
}

export function formatPercent(value: number, fractionDigits = 1): string {
  return `${value.toFixed(fractionDigits).replace('.', ',')}%`;
}

function trimZero(n: number): string {
  return n.toFixed(1).replace(/\.0$/, '').replace('.', ',');
}
