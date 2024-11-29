import { useQuery } from "react-query";
import { useSession } from "@clerk/nextjs";
import { getAllPets } from "@/lib/actions/pet.action";
import { usePetStore } from "@/store/shared/usePet.store";
import { IPet } from "@/lib/types/pet/interfaces.types";

export const useAllPets = () => {
  const { session } = useSession();
  const setPets = usePetStore((state) => state.setPets);

  const fetchAllPets = async () => {
    if (!session) {
      throw new Error("Session token is not available");
    }

    const sessionToken = await session?.getToken();
    if (sessionToken) {
      return getAllPets(sessionToken);
    }
    throw new Error("Session token is not available");
  };

  return useQuery<IPet[], Error>("allPets", fetchAllPets, {
    enabled: !!session,
    onSuccess: (data) => {
      setPets(data);
    },
  });
};
