// useUserData.ts
import { useQuery } from "react-query";
import { useSession } from "@clerk/nextjs";
import { getAllUsers } from "@/lib/actions/user.action";

export const useAllUsers = () => {
  const { session } = useSession();

  const fetchUsers = async () => {
    if (!session) {
      throw new Error("Session token is not available");
    }

    const sessionToken = await session?.getToken();
    if (sessionToken) {
      const users = await getAllUsers(sessionToken);
      // console.log("Fetched users:", users); // Log the fetched data
      return users;
    }
    throw new Error("Session token is not available");
  };

  return useQuery<
    {
      _id: string;
      firstName: string;
      lastName: string;
      profilePicture: string;
      messages: {}[];
    }[],
    Error
  >(["users"], fetchUsers, {
    enabled: !!session,
  });
};
