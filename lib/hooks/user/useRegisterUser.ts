import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { registerUser } from "@/lib/actions/user.action";
import { useUserStore } from "@/store/shared/useUser.store";
import { UserRegistration } from "@/lib/types/user/interfaces.types";

export const useRegisterUser = (invalidateQueries: boolean = true) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  const registerUserDetails = async (data: UserRegistration["data"]) => {
    const sessionToken = await session?.getToken();
    if (!sessionToken) {
      throw new Error(
        "No session token available, cannot proceed with registration"
      );
    }
    return registerUser({ data, sessionToken });
  };

  return useMutation(registerUserDetails, {
    onSettled: (data, error) => {
      if (!error && data) {
        setUser(data);
        if (invalidateQueries) {
          queryClient.invalidateQueries({ queryKey: ["userData"] });
        }
      }
    },
  });
};
