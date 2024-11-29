import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { deleteConversation } from "@/lib/actions/conversation.action";
import { useConversationStore } from "@/store/shared/useConversation.store";

interface DeleteConversationParams {
  conversationId: string;
}

export const useDeleteConversation = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const deleteExistingConversation = async ({
    conversationId,
  }: DeleteConversationParams) => {
    const sessionToken = await session?.getToken();
    if (!sessionToken) {
      throw new Error(
        "No session token available, cannot proceed with deleting a conversation"
      );
    }
    return deleteConversation(conversationId, sessionToken);
  };

  return useMutation<void, Error, DeleteConversationParams>(
    deleteExistingConversation,
    {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: ["conversations"],
        });
        queryClient.invalidateQueries({
          queryKey: ["userProfile"],
        });
      },
    }
  );
};
