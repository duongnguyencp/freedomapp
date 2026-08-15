import type { Asset, Liability } from './types';

export function calculateTotalAssets(assets: Asset[]): number {
  return assets.reduce((sum, asset) => sum + asset.value, 0);
}

export function calculateTotalLiabilities(liabilities: Liability[]): number {
  return liabilities.reduce((sum, liability) => sum + liability.value, 0);
}

export function calculateNetWorth(totalAssets: number, totalLiabilities: number): number {
  return totalAssets - totalLiabilities;
}
