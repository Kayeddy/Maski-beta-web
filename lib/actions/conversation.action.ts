/**
 * Fetches the conversations for a given user.
 *
 * @param {string} userId - The ID of the user.
 * @param {string | null} sessionToken - The session token for authentication.
 * @returns {Promise<object>} The user's conversations or an error message.
 */
export async function getConversations(
  userId: string,
  sessionToken: string | null
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHAT_SERVICE_BASE_URL}/${userId}/conversations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return { error: "Conversation not found", user: null };
    }

    const conversations = await response.json();
    // console.log("User conversations fetched", conversations);
    return conversations;
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Creates a new conversation.
 *
 * @param {object} params - The parameters for creating a conversation.
 * @param {string[]} params.integrants - The participants of the conversation.
 * @param {string} params.sessionToken - The session token for authentication.
 * @returns {Promise<object>} The created conversation or an error message.
 */
export async function createConversation({
  integrants,
  pet,
  sessionToken,
}: {
  integrants: string[];
  pet: string;
  sessionToken: string;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHAT_SERVICE_BASE_URL}/conversations/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({ integrants, pet }),
      }
    );

    if (!response.ok) {
      return { error: "Conversation could not be created", user: null };
    }

    const conversation = await response.json();
    return conversation;
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Deletes a conversation by ID.
 *
 * @param {string} conversationId - The ID of the conversation to be deleted.
 * @param {string | null} sessionToken - The session token for authentication.
 * @returns {Promise<object>} The deleted conversation or an error message.
 */
export async function deleteConversation(
  conversationId: string,
  sessionToken: string | null
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHAT_SERVICE_BASE_URL}/conversations/delete/${conversationId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return { error: "Conversation could not be deleted" };
    }

    const deletedConversation = await response.json();
    console.log("Conversation deleted successfully", deletedConversation);
    return deletedConversation;
  } catch (error: any) {
    return { error: error.message };
  }
}
