import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { createProfile } from "@/lib/actions/profile.action";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { ProfileCreationProps } from "@/lib/types/user/interfaces.types";

export const useCreateUserProfile = (invalidateQueries: boolean = true) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const setProfile = useUserProfileStore((state) => state.setProfile);

  return useMutation(
    async (createData: Omit<ProfileCreationProps, "sessionToken">) => {
      const sessionToken = await session?.getToken();
      if (!sessionToken) {
        throw new Error("Session token is required for creating profile");
      }
      return createProfile({ ...createData, sessionToken });
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
