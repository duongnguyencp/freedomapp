import AsyncStorage from '@react-native-async-storage/async-storage';
import type { UserProfile } from 'financial-engine';

import { storageKeys } from './storageKeys';

// Data-access layer for UserProfile. UI/stores never touch AsyncStorage
// directly — this is the only place that knows the storage key/shape.
export const profileRepository = {
  async getProfile(): Promise<UserProfile | null> {
    const raw = await AsyncStorage.getItem(storageKeys.profile);
    return raw ? (JSON.parse(raw) as UserProfile) : null;
  },

  async saveProfile(profile: UserProfile): Promise<void> {
    await AsyncStorage.setItem(storageKeys.profile, JSON.stringify(profile));
  },

  async clearProfile(): Promise<void> {
    await AsyncStorage.removeItem(storageKeys.profile);
  },
};
