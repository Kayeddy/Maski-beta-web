import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { addPet } from "@/lib/actions/pet.action";
import { usePetStore } from "@/store/shared/usePet.store";
import { IPet, PetCreation } from "@/lib/types/pet/interfaces.types";

export const useAddPet = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const addPetToStore = usePetStore((state) => state.addPet);

  const addPetDetails = async (data: PetCreation["data"]) => {
    const sessionToken = await session?.getToken();
    if (!sessionToken) {
      throw new Error(
        "No session token available, cannot proceed with adding pet"
      );
    }
    return addPet({ data, sessionToken });
  };

  return useMutation<IPet, Error, PetCreation["data"]>(addPetDetails, {
    onSettled: (data, error) => {
      if (!error && data) {
        addPetToStore(data);
        queryClient.invalidateQueries({ queryKey: ["allPets"] });
        queryClient.invalidateQueries({ queryKey: ["petData"] });
      }
    },
  });
};
