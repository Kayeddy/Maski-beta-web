import { useMutation, useQueryClient } from "react-query";
import { useSession } from "@clerk/nextjs";
import { updateUser } from "@/lib/actions/user.action";
import { useUserStore } from "@/store/shared/useUser.store";
import { IUser, UserUpdate } from "@/lib/types/user/interfaces.types";

export const useUpdateUser = (invalidateQueries: boolean = true) => {
  const { session } = useSession();
  const queryClient = useQueryClient();
  const setUser = useUserStore((state) => state.setUser);

  return useMutation<IUser, Error, Omit<UserUpdate, "sessionToken">>(
    async (updateData: Omit<UserUpdate, "sessionToken">) => {
      const sessionToken = await session?.getToken();
      if (!sessionToken) {
        throw new Error("Session token is required for updating user");
      }
      return updateUser({
        ...updateData,
        sessionToken,
      });
    },
    {
      onSettled: (data, error) => {
        if (!error && data) {
          setUser(data);
          if (invalidateQueries) {
            queryClient.invalidateQueries({ queryKey: ["userData"] });
          }
        }
      },
    }
  );
};
