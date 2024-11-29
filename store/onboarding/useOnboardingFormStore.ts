import {
  AdopterFormData,
  HolderFormData,
  UserProfile,
  UserState,
} from "@/lib/types/onboarding.types";

import { create } from "zustand";

// Extend UserProfile with form data

interface FormStore {
  userState: UserState;
  setUserProfileType: (type: UserProfile["profileType"]) => void;
  setFormAndTab: (form: UserProfile["currentForm"], tab: string) => void;
  markTabAsCompleted: (tab: string) => void;
  updateFormData: (
    formType: "adopter" | "holder" | "explorer" | string,
    field:
      | keyof AdopterFormData
      | keyof HolderFormData
      | Partial<AdopterFormData>
      | Partial<HolderFormData>,
    value?: string
  ) => void;
}

export const useOnboardingFormStore = create<FormStore>((set) => ({
  userState: {
    profileType: "",
    adopterFormTabsCompleted: [],
    holderFormTabsCompleted: [],
    currentForm: "profileTypeSelection",
    currentTab: null,
    adopterFormData: {
      email: "",
      firstName: "",
      middleName: "",
      lastName: "",
      bio: "",
      dateOfBirth: null,
      location: "",
      adoptionPreferences: null,
    },
    holderFormData: {
      email: "",
      name: "",
      //TODO: initialize other fields
    },
  },
  setUserProfileType: (profileType) =>
    set((state) => ({
      userState: { ...state.userState, profileType },
    })),
  setFormAndTab: (form, tab) =>
    set((state) => ({
      userState: { ...state.userState, currentForm: form, currentTab: tab },
    })),
  markTabAsCompleted: (tab) =>
    set((state) => {
      if (state.userState.profileType === "adopter") {
        // Check if the tab is not already in the adopterFormTabsCompleted list
        if (!state.userState.adopterFormTabsCompleted.includes(tab)) {
          return {
            userState: {
              ...state.userState,
              adopterFormTabsCompleted: [
                ...state.userState.adopterFormTabsCompleted,
                tab,
              ],
            },
          };
        }
      } else if (state.userState.profileType === "holder") {
        // Check if the tab is not already in the holderFormTabsCompleted list
        if (!state.userState.holderFormTabsCompleted.includes(tab)) {
          return {
            userState: {
              ...state.userState,
              holderFormTabsCompleted: [
                ...state.userState.holderFormTabsCompleted,
                tab,
              ],
            },
          };
        }
      }
      // Return the state unchanged if the condition does not match or the tab is already added
      return state;
    }),
  updateFormData: (formType, field, value) =>
    set((state) => {
      const isSingleField = typeof field === "string";

      if (formType === "adopter") {
        const formData = state.userState.adopterFormData;
        return {
          userState: {
            ...state.userState,
            adopterFormData: isSingleField
              ? { ...formData, [field]: value }
              : { ...formData, ...(field as Partial<AdopterFormData>) },
          },
        };
      } else if (formType === "holder") {
        const formData = state.userState.holderFormData;
        return {
          userState: {
            ...state.userState,
            holderFormData: isSingleField
              ? { ...formData, [field]: value }
              : { ...formData, ...(field as Partial<HolderFormData>) },
          },
        };
      }

      return state;
    }),
}));
