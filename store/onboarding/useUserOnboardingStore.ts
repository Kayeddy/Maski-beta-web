import { create } from "zustand";

// Define interfaces for the Clerk user data
interface ClerkUserData {
  id?: string | null;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: string | undefined;
  //TODO: Add other relevant fields from Clerk
}

// Define interfaces for the database user data
interface DatabaseUserData {
  userId?: string | null;
  profileData?: {
    profileId?: string;
    type?: string;
    data?: any | {};
  } | null;
  location?: string;
  bio?: string;
  dateOfBirth?: Date | string | null;
  firstName?: string | null;
  lastName?: string | null;
  emailAddress?: string | undefined;
  profilePicture?: string;
  onboarded?: boolean;
  //TODO: Add other specific fields needed
}

// Combine both data types into a user state
interface UserState {
  clerkUserData: ClerkUserData;
  databaseUserData: DatabaseUserData;
}

interface UserStore {
  userState: UserState;
  setClerkUserData: (data: Partial<ClerkUserData>) => void;
  setDatabaseUserData: (data: Partial<DatabaseUserData>) => void;
  clearUserData: () => void;
}

export const useUserOnboardingStore = create<UserStore>((set) => ({
  userState: {
    clerkUserData: {},
    databaseUserData: {},
  },
  setClerkUserData: (data) =>
    set((state) => ({
      userState: {
        ...state.userState,
        clerkUserData: { ...state.userState.clerkUserData, ...data },
      },
    })),
  setDatabaseUserData: (data) =>
    set((state) => ({
      userState: {
        ...state.userState,
        databaseUserData: { ...state.userState.databaseUserData, ...data },
      },
    })),
  clearUserData: () =>
    set(() => ({
      userState: {
        clerkUserData: {},
        databaseUserData: {},
      },
    })),
}));
