import { useQuery } from "react-query";
import { useSession } from "@clerk/nextjs";
import { getConversations } from "@/lib/actions/conversation.action";
import { IConversation } from "@/lib/types/hub/chat/interfaces.types";
import { useConversationStore } from "@/store/shared/useConversation.store";

export const useConversations = (userId: string) => {
  const { session } = useSession();
  const setConversations = useConversationStore(
    (state) => state.setConversations
  );

  const fetchConversations = async () => {
    if (!session || !userId) {
      throw new Error("Session token or user ID is not available");
    }

    const sessionToken = await session?.getToken();
    if (userId && sessionToken) {
      return getConversations(userId, sessionToken);
    }
    throw new Error("Session token or user ID is not available");
  };

  return useQuery<IConversation[], Error>(
    ["conversations", userId],
    fetchConversations,
    {
      enabled: !!userId && !!session,
      onSuccess: (data) => {
        setConversations(data);
      },
    }
  );
};
