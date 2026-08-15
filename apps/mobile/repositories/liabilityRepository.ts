import AsyncStorage from '@react-native-async-storage/async-storage';
import type { Liability, LiabilityCategory } from 'financial-engine';

import { generateId } from '@/services/id';

import { storageKeys } from './storageKeys';

export interface LiabilityInput {
  name: string;
  category: LiabilityCategory;
  value: number;
}

async function readAll(): Promise<Liability[]> {
  const raw = await AsyncStorage.getItem(storageKeys.liabilities);
  return raw ? (JSON.parse(raw) as Liability[]) : [];
}

async function writeAll(liabilities: Liability[]): Promise<void> {
  await AsyncStorage.setItem(storageKeys.liabilities, JSON.stringify(liabilities));
}

export const liabilityRepository = {
  getLiabilities: readAll,

  async addLiability(input: LiabilityInput): Promise<Liability> {
    const now = new Date().toISOString();
    const liability: Liability = { id: generateId(), createdAt: now, updatedAt: now, ...input };
    const liabilities = await readAll();
    await writeAll([...liabilities, liability]);
    return liability;
  },

  async updateLiability(id: string, updates: Partial<LiabilityInput>): Promise<Liability> {
    const liabilities = await readAll();
    const index = liabilities.findIndex((liability) => liability.id === id);
    if (index === -1) {
      throw new Error(`Liability not found: ${id}`);
    }
    const updated: Liability = {
      ...liabilities[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };
    liabilities[index] = updated;
    await writeAll(liabilities);
    return updated;
  },

  async deleteLiability(id: string): Promise<void> {
    const liabilities = await readAll();
    await writeAll(liabilities.filter((liability) => liability.id !== id));
  },
};
