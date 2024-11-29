import { create } from "zustand";
import { IMessage } from "@/lib/types/hub/chat/interfaces.types";

interface MessageState {
  messages: IMessage[];
  setMessages: (messages: IMessage[]) => void;
  addMessage: (message: IMessage) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  messages: [],
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));
