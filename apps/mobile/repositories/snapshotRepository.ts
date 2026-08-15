import AsyncStorage from '@react-native-async-storage/async-storage';
import type { FinancialSnapshot } from 'financial-engine';

import { generateId } from '@/services/id';

import { storageKeys } from './storageKeys';

export interface SnapshotInput {
  /** ISO date, YYYY-MM-DD. */
  date: string;
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
  fiNumber: number;
  fiProgress: number;
}

async function readAll(): Promise<FinancialSnapshot[]> {
  const raw = await AsyncStorage.getItem(storageKeys.snapshots);
  const snapshots = raw ? (JSON.parse(raw) as FinancialSnapshot[]) : [];
  return snapshots.sort((a, b) => a.date.localeCompare(b.date));
}

async function writeAll(snapshots: FinancialSnapshot[]): Promise<void> {
  await AsyncStorage.setItem(storageKeys.snapshots, JSON.stringify(snapshots));
}

export const snapshotRepository = {
  getSnapshots: readAll,

  // Upserts by date: recording twice on the same day (e.g. while testing)
  // updates that day's entry instead of cluttering the chart with
  // duplicate points for the same day.
  async recordSnapshot(input: SnapshotInput): Promise<FinancialSnapshot> {
    const snapshots = await readAll();
    const existingIndex = snapshots.findIndex((snapshot) => snapshot.date === input.date);
    const snapshot: FinancialSnapshot = {
      id: existingIndex >= 0 ? snapshots[existingIndex].id : generateId(),
      ...input,
    };
    if (existingIndex >= 0) {
      snapshots[existingIndex] = snapshot;
    } else {
      snapshots.push(snapshot);
    }
    await writeAll(snapshots.sort((a, b) => a.date.localeCompare(b.date)));
    return snapshot;
  },

  async deleteSnapshot(id: string): Promise<void> {
    const snapshots = await readAll();
    await writeAll(snapshots.filter((snapshot) => snapshot.id !== id));
  },
};
