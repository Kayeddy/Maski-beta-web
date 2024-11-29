import { create } from "zustand";

interface UserProfileState {
  profile: any | null;
  setProfile: (profile: any) => void;
  clearProfile: () => void;
}

export const useUserProfileStore = create<UserProfileState>((set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
