// Base conversation interfaces

/**
 * =====================================
 * Conversation Interface
 * =====================================
 * This interface defines the structure
 * for a conversation.
 */
export interface IConversation {
  _id: string;
  createdAt: Date;
  lastMessageAt: Date;
  name: string;
  isGroup: boolean;
  messages: any[];
  integrants: any[];
  pet: string;
}

/**
 * =====================================
 * Message Interface
 * =====================================
 * This interface defines the structure
 * for a message within a conversation.
 */
export interface IMessage {
  sender: string;
  recipient: string;
  messageBody: string;
  messageMedia?: string;
  seen?: string[];
  conversationId: string;
}
