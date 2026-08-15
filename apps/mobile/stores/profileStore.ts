import type { UserProfile } from 'financial-engine';
import { create } from 'zustand';

import { profileRepository } from '@/repositories/profileRepository';

type Status = 'idle' | 'loading' | 'ready';

interface ProfileState {
  status: Status;
  profile: UserProfile | null;
  load: () => Promise<void>;
  save: (profile: UserProfile) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  status: 'idle',
  profile: null,

  load: async () => {
    set({ status: 'loading' });
    const profile = await profileRepository.getProfile();
    set({ profile, status: 'ready' });
  },

  save: async (profile) => {
    await profileRepository.saveProfile(profile);
    set({ profile, status: 'ready' });
  },
}));
