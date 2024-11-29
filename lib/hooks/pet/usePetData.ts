import { useQuery } from "react-query";
import { useSession } from "@clerk/nextjs";
import { getPetById, getPetsByHolderId } from "@/lib/actions/pet.action";
import { IPet } from "../../types/pet/interfaces.types";
import { usePetStore } from "@/store/shared/usePet.store";

interface UsePetDataParams {
  petId?: string;
  holderId?: string;
}

export const usePetData = ({ petId, holderId }: UsePetDataParams) => {
  const setSelectedPet = usePetStore((state) => state.setSelectedPet);
  const setPets = usePetStore((state) => state.setPets);
  const { session } = useSession();

  const fetchPetData = async () => {
    if (!session) {
      throw new Error("Session token is not available");
    }

    const sessionToken = await session?.getToken();
    if (!sessionToken) {
      throw new Error("Session token is not available");
    }

    if (petId) {
      return getPetById(petId, sessionToken);
    } else if (holderId) {
      return getPetsByHolderId(holderId, sessionToken);
    } else {
      throw new Error("Neither pet ID nor holder ID is provided");
    }
  };

  return useQuery<IPet | IPet[], Error>(
    ["petData", petId || holderId],
    fetchPetData,
    {
      enabled: !!session && (!!petId || !!holderId),
      onSuccess: (data) => {
        if (data) {
          if (Array.isArray(data)) {
            setPets(data);
          } else {
            setSelectedPet(data);
          }
        }
      },
    }
  );
};
