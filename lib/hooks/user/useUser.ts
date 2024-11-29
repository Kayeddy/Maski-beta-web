import { useQuery } from "react-query";
import { useSession } from "@clerk/nextjs";
import { getUserByEmail, getUserById } from "@/lib/actions/user.action";
import { useUserStore } from "@/store/shared/useUser.store";
import { IUser } from "@/lib/types/user/interfaces.types";

interface UseUserDataParams {
  email?: string;
  id?: string;
}

export const useUser = ({ email, id }: UseUserDataParams) => {
  const { session } = useSession();
  const setUser = useUserStore((state) => state.setUser);
  const currentUser = useUserStore((state) => state.user);

  const fetchUserData = async () => {
    if (!session || (!email && !id)) {
      throw new Error("Session token or user email/ID is not available");
    }

    const sessionToken = await session?.getToken();
    if (sessionToken) {
      if (id) {
        return getUserById(id, sessionToken);
      } else if (email) {
        return getUserByEmail(email, sessionToken);
      }
    }
    throw new Error("Session token or user email/ID is not available");
  };

  return useQuery<IUser, Error>(["userData", email, id], fetchUserData, {
    enabled: !!session && (!!email || !!id),
    onSuccess: (data) => {
      if (!currentUser) {
        setUser(data);
      }
      if (data._id === currentUser?._id) {
        setUser(data);
      }
    },
  });
};
