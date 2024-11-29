import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { deletePet } from "@/lib/actions/pet.action";

export const useDeletePet = () => {
  const { session } = useSession();
  const queryClient = useQueryClient();

  const deletePetById = async ({
    petId,
    userId,
  }: {
    petId: string;
    userId: string;
  }) => {
    const sessionToken = await session?.getToken();
    if (!sessionToken) {
      throw new Error(
        "No session token available, cannot proceed with deleting pet"
      );
    }
    return deletePet(petId, sessionToken, userId);
  };

  return useMutation<
    { message: string },
    Error,
    { petId: string; userId: string }
  >(deletePetById, {
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["allPets"] });
      queryClient.invalidateQueries({ queryKey: ["petData"] });
    },
  });
};
