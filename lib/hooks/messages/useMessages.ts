import { useQuery } from "react-query";
import { useSession } from "@clerk/nextjs";
import { getMessages } from "@/lib/actions/message.action";
import { IMessage } from "@/lib/types/hub/chat/interfaces.types";
import { useMessageStore } from "@/store/shared/useMessage.store";

export const useMessages = (conversationId: string) => {
  const { session } = useSession();
  const setMessages = useMessageStore((state) => state.setMessages);

  const fetchMessages = async () => {
    if (!session || !conversationId) {
      throw new Error("Session token or conversation ID is not available");
    }

    const sessionToken = await session?.getToken();
    if (conversationId && sessionToken) {
      return getMessages(conversationId, sessionToken);
    }
    throw new Error("Session token or conversation ID is not available");
  };

  return useQuery<IMessage[], Error>(
    ["messages", conversationId],
    fetchMessages,
    {
      enabled: !!conversationId && !!session,
      onSuccess: (data) => {
        setMessages(data);
      },
    }
  );
};
