import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { createMatch } from "@/lib/actions/match.action";
import { IMatch } from "@/lib/types/match/interfaces";

export const useCreateMatch = (invalidateQueries: boolean = true) => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const createMatchDetails = async (data: IMatch) => {
    const sessionToken = await session?.getToken();
    if (!sessionToken) {
      throw new Error(
        "No session token available, cannot proceed with match creation"
      );
    }
    return createMatch({ data, sessionToken });
  };

  return useMutation(createMatchDetails, {
    onSettled: (data, error) => {
      if (!error && data && invalidateQueries) {
        queryClient.invalidateQueries({ queryKey: ["matches"] });
        queryClient.invalidateQueries({ queryKey: ["userProfile"] });
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }
    },
  });
};
