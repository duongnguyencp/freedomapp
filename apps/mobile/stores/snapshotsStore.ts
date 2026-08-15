import type { FinancialSnapshot } from 'financial-engine';
import { create } from 'zustand';

import { snapshotRepository, type SnapshotInput } from '@/repositories/snapshotRepository';

type Status = 'idle' | 'loading' | 'ready';

interface SnapshotsState {
  status: Status;
  snapshots: FinancialSnapshot[];
  load: () => Promise<void>;
  record: (input: SnapshotInput) => Promise<void>;
  remove: (id: string) => Promise<void>;
}

export const useSnapshotsStore = create<SnapshotsState>((set, get) => ({
  status: 'idle',
  snapshots: [],

  load: async () => {
    set({ status: 'loading' });
    const snapshots = await snapshotRepository.getSnapshots();
    set({ snapshots, status: 'ready' });
  },

  record: async (input) => {
    const snapshot = await snapshotRepository.recordSnapshot(input);
    const others = get().snapshots.filter((existing) => existing.date !== snapshot.date);
    const snapshots = [...others, snapshot].sort((a, b) => a.date.localeCompare(b.date));
    set({ snapshots });
  },

  remove: async (id) => {
    await snapshotRepository.deleteSnapshot(id);
    set({ snapshots: get().snapshots.filter((snapshot) => snapshot.id !== id) });
  },
}));
