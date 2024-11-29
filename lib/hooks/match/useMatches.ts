import { useQuery } from "react-query";
import { useSession } from "@clerk/nextjs";
import {
  fetchMatchesByHolderId,
  fetchMatchesByAdopterId,
} from "@/lib/actions/match.action";
import { IMatch } from "@/lib/types/match/interfaces";
import { useMatchStore } from "@/store/shared/useMatchStore";

export const useMatches = (
  id: string,
  fetchType: "adopter" | "holder" = "holder"
) => {
  const { session } = useSession();
  const setMatches = useMatchStore((state) => state.setMatches);

  const fetchMatchDetails = async () => {
    if (!session) {
      throw new Error("Session token is not available");
    }

    const sessionToken = await session?.getToken();
    if (sessionToken && id) {
      if (fetchType === "adopter") {
        return fetchMatchesByAdopterId({ adopterId: id, sessionToken });
      } else {
        return fetchMatchesByHolderId({ holderId: id, sessionToken });
      }
    }
    throw new Error("Session token or ID is not available");
  };

  return useQuery<IMatch[], Error>(
    ["matches", id, fetchType],
    fetchMatchDetails,
    {
      enabled: !!session && !!id,
      onSuccess: (data) => {
        setMatches(data);
      },
    }
  );
};
