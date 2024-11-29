/**
 * Creates a new message in a conversation.
 *
 * @param {object} params - The parameters for creating a message.
 * @param {string} params.sessionToken - The session token for authentication.
 * @param {string} params.sender - The ID of the message sender.
 * @param {string} params.messageBody - The body of the message.
 * @param {string} params.messageMedia - The media attached to the message.
 * @param {string} params.conversationId - The ID of the conversation.
 * @returns {Promise<object>} The created message or an error message.
 */
export async function createMessage({
  sessionToken,
  sender,
  recipient,
  messageBody,
  messageMedia,
  conversationId,
}: {
  sessionToken: string;
  sender: string;
  recipient: string;
  messageBody: string;
  messageMedia: string;
  conversationId: string;
}) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHAT_SERVICE_BASE_URL}/messages/create`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
        body: JSON.stringify({
          sender,
          recipient,
          messageBody,
          messageMedia,
          conversationId,
        }),
      }
    );

    if (!response.ok) {
      return { error: "Message could not be created", user: null };
    }

    const conversation = await response.json();
    // console.log("Message created successfully", conversation);
    return conversation;
  } catch (error: any) {
    return { error: error.message };
  }
}

/**
 * Fetches the messages for a given conversation.
 *
 * @param {string} conversationId - The ID of the conversation.
 * @param {string | null} sessionToken - The session token for authentication.
 * @returns {Promise<object>} The messages data or an error message.
 */
export async function getMessages(
  conversationId: string,
  sessionToken: string | null
) {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_CHAT_SERVICE_BASE_URL}/${conversationId}/messages/`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(sessionToken ? { Authorization: `Bearer ${sessionToken}` } : {}),
        },
      }
    );

    if (!response.ok) {
      return { error: "Messages not found", messages: null };
    }

    const messagesData = await response.json();
    // console.log("Messages data fetched successfully", messagesData);
    return messagesData;
  } catch (error: any) {
    return { error: error.message };
  }
}
