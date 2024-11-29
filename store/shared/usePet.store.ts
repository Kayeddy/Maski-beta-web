import { IPet } from "@/lib/types/pet/interfaces.types";
import { create } from "zustand";

interface PetState {
  pets: IPet[];
  selectedPet: IPet | null;
  setPets: (pets: IPet[]) => void;
  setSelectedPet: (pet: IPet) => void;
  addPet: (pet: IPet) => void;
  clearSelectedPet: () => void;
}

export const usePetStore = create<PetState>((set) => ({
  pets: [],
  selectedPet: null,
  setPets: (pets) => set({ pets }),
  setSelectedPet: (pet) => set({ selectedPet: pet }),
  addPet: (pet) => set((state) => ({ pets: [...state.pets, pet] })),
  clearSelectedPet: () => set({ selectedPet: null }),
}));
