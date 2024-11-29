import { useQuery } from "react-query";
import { useSession } from "@clerk/nextjs";
import { getProfile } from "@/lib/actions/profile.action";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { useUserStore } from "@/store/shared/useUser.store";

export const useUserProfile = (
  profileId: string,
  shouldUpdateStore: boolean = false
) => {
  const { session } = useSession();
  const userData = useUserStore((state) => state.user);
  const { profile, setProfile } = useUserProfileStore();

  const fetchUserProfile = async () => {
    if (!profileId || !session) {
      throw new Error("Session token or profile ID is not available");
    }
    return getProfile({ profileId, sessionToken: await session.getToken() });
  };

  return useQuery(["userProfile", profileId], fetchUserProfile, {
    enabled: !!profileId && !!session,
    onSuccess: (data) => {
      if (shouldUpdateStore) {
        setProfile(data);
      } else {
        if (!profile) {
          setProfile(data);
        }
        if (data.userId === userData?._id) {
          setProfile(data);
        }
      }
    },
  });
};
