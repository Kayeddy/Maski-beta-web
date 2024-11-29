import { create } from "zustand";
import { IMatch } from "@/lib/types/match/interfaces";

interface MatchState {
  matches: IMatch[];
  setMatches: (matches: IMatch[]) => void;
  addMatch: (match: IMatch) => void;
  updateMatch: (updatedMatch: IMatch) => void;
  deleteMatch: (matchId: string) => void;
}

export const useMatchStore = create<MatchState>((set) => ({
  matches: [],
  setMatches: (matches) => set({ matches }),
  addMatch: (match) =>
    set((state) => ({
      matches: [...state.matches, match],
    })),
  updateMatch: (updatedMatch) =>
    set((state) => ({
      matches: state.matches.map((match) =>
        match._id === updatedMatch._id ? updatedMatch : match
      ),
    })),
  deleteMatch: (matchId) =>
    set((state) => ({
      matches: state.matches.filter((match) => match._id !== matchId),
    })),
}));
