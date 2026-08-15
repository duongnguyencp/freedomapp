import type { Liability } from 'financial-engine';
import { create } from 'zustand';

import { liabilityRepository, type LiabilityInput } from '@/repositories/liabilityRepository';

type Status = 'idle' | 'loading' | 'ready';

interface LiabilitiesState {
  status: Status;
  liabilities: Liability[];
  load: () => Promise<void>;
  add: (input: LiabilityInput) => Promise<void>;
  update: (id: string, updates: Partial<LiabilityInput>) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useLiabilitiesStore = create<LiabilitiesState>((set, get) => ({
  status: 'idle',
  liabilities: [],

  load: async () => {
    set({ status: 'loading' });
    const liabilities = await liabilityRepository.getLiabilities();
    set({ liabilities, status: 'ready' });
  },

  add: async (input) => {
    const liability = await liabilityRepository.addLiability(input);
    set({ liabilities: [...get().liabilities, liability] });
  },

  update: async (id, updates) => {
    const updated = await liabilityRepository.updateLiability(id, updates);
    set({
      liabilities: get().liabilities.map((liability) =>
        liability.id === id ? updated : liability,
      ),
    });
  },

  remove: async (id) => {
    await liabilityRepository.deleteLiability(id);
    set({ liabilities: get().liabilities.filter((liability) => liability.id !== id) });
  },
}));
