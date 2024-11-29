import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { createMessage } from "@/lib/actions/message.action";
import { IMessage } from "@/lib/types/hub/chat/interfaces.types";
import { useMessageStore } from "@/store/shared/useMessage.store";

interface CreateMessageParams {
  sender: string;
  recipient: string;
  messageBody: string;
  messageMedia: string;
  conversationId: string;
}

export const useCreateMessage = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const addMessage = useMessageStore((state) => state.addMessage);

  const createNewMessage = async ({
    sender,
    recipient,
    messageBody,
    messageMedia,
    conversationId,
  }: CreateMessageParams) => {
    const sessionToken = await session?.getToken();
    if (!sessionToken) {
      throw new Error(
        "No session token available, cannot proceed with creating a message"
      );
    }
    return createMessage({
      sessionToken,
      sender,
      recipient,
      messageBody,
      messageMedia,
      conversationId,
    });
  };

  return useMutation<IMessage, Error, CreateMessageParams>(createNewMessage, {
    onSuccess: (data) => {
      addMessage(data);
      queryClient.invalidateQueries({
        queryKey: ["messages", data.conversationId],
      });
      queryClient.invalidateQueries({
        queryKey: ["conversations", data.conversationId],
      });
    },
  });
};
