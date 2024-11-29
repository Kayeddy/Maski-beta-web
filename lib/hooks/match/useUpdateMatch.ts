import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { updateMatch } from "@/lib/actions/match.action";
import { IMatch } from "@/lib/types/match/interfaces";

export const useUpdateMatch = (invalidateQueries: boolean = true) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<IMatch, Error, { matchId: string; data: Partial<IMatch> }>(
    async ({ matchId, data }) => {
      const sessionToken = await session?.getToken();
      if (!sessionToken) {
        throw new Error("Session token is required for updating match");
      }
      return updateMatch({ matchId, data, sessionToken });
    },
    {
      onSettled: (data, error) => {
        if (!error && data && invalidateQueries) {
          queryClient.invalidateQueries({ queryKey: ["matches"] });
        }
      },
    }
  );
};
