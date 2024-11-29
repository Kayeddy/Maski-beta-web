import { create } from "zustand";
import { IConversation } from "@/lib/types/hub/chat/interfaces.types";

interface ConversationState {
  conversations: IConversation[];
  setConversations: (conversations: IConversation[]) => void;
  addConversation: (conversation: IConversation) => void;
}

export const useConversationStore = create<ConversationState>((set) => ({
  conversations: [],
  setConversations: (conversations) => set({ conversations }),
  addConversation: (conversation) =>
    set((state) => ({
      conversations: [...state.conversations, conversation],
    })),
}));
