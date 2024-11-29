import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { updateProfile } from "@/lib/actions/profile.action";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { UpdateProfileData } from "@/lib/types/user/interfaces.types";

export const useUpdateUserProfile = (invalidateQueries: boolean = true) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const setProfile = useUserProfileStore((state) => state.setProfile);

  return useMutation(
    async (updateData: Omit<UpdateProfileData, "sessionToken">) => {
      const sessionToken = await session?.getToken();
      if (!sessionToken) {
        throw new Error("Session token is required for updating profile");
      }
      return updateProfile({ ...updateData, sessionToken });
    },
    {
      onSettled: (data, error) => {
        if (!error && data) {
          setProfile(data);
          if (invalidateQueries) {
            queryClient.invalidateQueries({ queryKey: ["userProfile"] });
          }
        }
      },
    }
  );
};
