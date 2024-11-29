import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { updatePet } from "@/lib/actions/pet.action";
import { IPet, PetUpdate } from "@/lib/types/pet/interfaces.types";

export const useUpdatePet = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  return useMutation<IPet, Error, Omit<PetUpdate, "sessionToken">>(
    async (updateData: Omit<PetUpdate, "sessionToken">) => {
      const sessionToken = await session?.getToken();
      if (!sessionToken) {
        throw new Error("Session token is required for updating pet");
      }
      return updatePet({
        ...updateData,
        sessionToken,
      });
    },
    {
      onSettled: () => {
        queryClient.invalidateQueries({ queryKey: ["petData"] });
        queryClient.invalidateQueries({ queryKey: ["allPets"] });
      },
      onError: (error) => {
        console.error("Failed to update pet:", error);
      },
    }
  );
};
