import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Asset, AssetCategory } from 'financial-engine';

import { generateId } from '@/services/id';

import { storageKeys } from './storageKeys';

export interface AssetInput {
  name: string;
  category: AssetCategory;
  value: number;
}

async function readAll(): Promise<Asset[]> {
  const raw = await AsyncStorage.getItem(storageKeys.assets);
  return raw ? (JSON.parse(raw) as Asset[]) : [];
}

async function writeAll(assets: Asset[]): Promise<void> {
  await AsyncStorage.setItem(storageKeys.assets, JSON.stringify(assets));
}

export const assetRepository = {
  getAssets: readAll,

  async addAsset(input: AssetInput): Promise<Asset> {
    const now = new Date().toISOString();
    const asset: Asset = { id: generateId(), createdAt: now, updatedAt: now, ...input };
    const assets = await readAll();
    await writeAll([...assets, asset]);
    return asset;
  },

  async updateAsset(id: string, updates: Partial<AssetInput>): Promise<Asset> {
    const assets = await readAll();
    const index = assets.findIndex((asset) => asset.id === id);
    if (index === -1) {
      throw new Error(`Asset not found: ${id}`);
    }
    const updated: Asset = { ...assets[index], ...updates, updatedAt: new Date().toISOString() };
    assets[index] = updated;
    await writeAll(assets);
    return updated;
  },

  async deleteAsset(id: string): Promise<void> {
    const assets = await readAll();
    await writeAll(assets.filter((asset) => asset.id !== id));
  },
};
