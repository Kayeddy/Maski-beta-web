import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { deleteMatch } from "@/lib/actions/match.action";

export const useDeleteMatch = (invalidateQueries: boolean = true) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<{ matchId: string }, Error, string>(
    async (matchId: string) => {
      const sessionToken = await session?.getToken();
      if (!sessionToken) {
        throw new Error("Session token is required for deleting match");
      }
      return deleteMatch({ matchId, sessionToken });
    },
    {
      onSettled: (data, error) => {
        if (!error && data && invalidateQueries) {
          queryClient.invalidateQueries({ queryKey: ["matches"] });
          queryClient.invalidateQueries({ queryKey: ["conversations"] });
          queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        }
      },
    }
  );
};
