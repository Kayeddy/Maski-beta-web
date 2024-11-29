import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { createConversation } from "@/lib/actions/conversation.action";

import { IConversation } from "@/lib/types/hub/chat/interfaces.types";
import { useConversationStore } from "@/store/shared/useConversation.store";

interface CreateConversationParams {
  integrants: string[];
  pet: string;
}

export const useCreateConversation = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const addConversation = useConversationStore(
    (state) => state.addConversation
  );

  const createNewConversation = async ({
    integrants,
    pet,
  }: CreateConversationParams) => {
    const sessionToken = await session?.getToken();
    if (!sessionToken) {
      throw new Error(
        "No session token available, cannot proceed with creating a conversation"
      );
    }
    return createConversation({ integrants, pet, sessionToken });
  };

  return useMutation<IConversation, Error, CreateConversationParams>(
    createNewConversation,
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
