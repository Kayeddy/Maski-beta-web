import { IUser } from "@/lib/types/user/interfaces.types";
import { create } from "zustand";

interface UserState {
  user: IUser | null;
  setUser: (user: IUser) => void;
  clearUser: () => void;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}));
