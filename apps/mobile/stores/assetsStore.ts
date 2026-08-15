import type { Asset } from 'financial-engine';
import { create } from 'zustand';

import { assetRepository, type AssetInput } from '@/repositories/assetRepository';

type Status = 'idle' | 'loading' | 'ready';

interface AssetsState {
  status: Status;
  assets: Asset[];
  load: () => Promise<void>;
  add: (input: AssetInput) => Promise<void>;
  update: (id: string, updates: Partial<AssetInput>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useAssetsStore = create<AssetsState>((set, get) => ({
  status: 'idle',
  assets: [],

  load: async () => {
    set({ status: 'loading' });
    const assets = await assetRepository.getAssets();
    set({ assets, status: 'ready' });
  },

  add: async (input) => {
    const asset = await assetRepository.addAsset(input);
    set({ assets: [...get().assets, asset] });
  },

  update: async (id, updates) => {
    const updated = await assetRepository.updateAsset(id, updates);
    set({ assets: get().assets.map((asset) => (asset.id === id ? updated : asset)) });
  },

  remove: async (id) => {
    await assetRepository.deleteAsset(id);
    set({ assets: get().assets.filter((asset) => asset.id !== id) });
  },
}));
