import type { AssetCategory, LiabilityCategory } from 'financial-engine';

export const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: 'cash', label: 'Cash' },
  { value: 'bank', label: 'Bank' },
  { value: 'gold', label: 'Gold' },
  { value: 'stocks', label: 'Stocks' },
  { value: 'etf', label: 'ETF' },
  { value: 'crypto', label: 'Crypto' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'other', label: 'Other' },
];

export const LIABILITY_CATEGORIES: { value: LiabilityCategory; label: string }[] = [
  { value: 'loan', label: 'Loan' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'mortgage', label: 'Mortgage' },
  { value: 'other', label: 'Other' },
];

export function categoryLabel(
  categories: { value: string; label: string }[],
  value: string,
): string {
  return categories.find((category) => category.value === value)?.label ?? value;
}
