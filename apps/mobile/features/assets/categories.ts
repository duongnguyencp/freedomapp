import type { Asset, AssetCategory, LiabilityCategory } from 'financial-engine';

export const ASSET_CATEGORIES: { value: AssetCategory; label: string }[] = [
  { value: 'cash', label: 'Tiền mặt' },
  { value: 'bank', label: 'Ngân hàng' },
  { value: 'gold', label: 'Vàng' },
  { value: 'stocks', label: 'Cổ phiếu' },
  { value: 'etf', label: 'ETF' },
  { value: 'crypto', label: 'Tiền số' },
  { value: 'real_estate', label: 'Bất động sản' },
  { value: 'other', label: 'Khác' },
];

// Validated categorical palette (fixed order — never cycled or reassigned
// per-render). Passes adjacent-pair CVD/contrast checks for up to 8 series.
// One slot per asset category, in the same order as ASSET_CATEGORIES.
const CATEGORY_COLOR_PALETTE = [
  '#2a78d6', // blue
  '#eb6834', // orange
  '#1baf7a', // aqua
  '#eda100', // yellow
  '#e87ba4', // magenta
  '#008300', // green
  '#4a3aa7', // violet
  '#e34948', // red
];

export const ASSET_CATEGORY_COLORS: Record<AssetCategory, string> = ASSET_CATEGORIES.reduce(
  (colorsByCategory, category, index) => {
    colorsByCategory[category.value] = CATEGORY_COLOR_PALETTE[index];
    return colorsByCategory;
  },
  {} as Record<AssetCategory, string>,
);

export interface AllocationSlice {
  name: string;
  value: number;
  color: string;
}

/** Groups assets by category and sums their value — feeds the allocation pie chart. */
export function buildAssetAllocation(assets: Asset[]): AllocationSlice[] {
  const totalsByCategory = new Map<AssetCategory, number>();
  for (const asset of assets) {
    totalsByCategory.set(asset.category, (totalsByCategory.get(asset.category) ?? 0) + asset.value);
  }

  return ASSET_CATEGORIES.filter((category) => totalsByCategory.has(category.value)).map(
    (category) => ({
      name: category.label,
      value: totalsByCategory.get(category.value)!,
      color: ASSET_CATEGORY_COLORS[category.value],
    }),
  );
}

export const LIABILITY_CATEGORIES: { value: LiabilityCategory; label: string }[] = [
  { value: 'loan', label: 'Khoản vay' },
  { value: 'credit_card', label: 'Thẻ tín dụng' },
  { value: 'mortgage', label: 'Vay thế chấp' },
  { value: 'other', label: 'Khác' },
];

export function categoryLabel(
  categories: { value: string; label: string }[],
  value: string,
): string {
  return categories.find((category) => category.value === value)?.label ?? value;
}
