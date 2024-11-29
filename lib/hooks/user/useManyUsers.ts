// useUsersByIds.ts
import { useQuery } from "react-query";
import { useSession } from "@clerk/nextjs";
import { getManyUsers } from "@/lib/actions/user.action";

interface User {
  _id: string;
  firstName: string;
  lastName: string;
  profilePicture: string;
  messages: {}[];
}

export const useManyUsers = (userIds: string[]) => {
  const { session } = useSession();

  const fetchUsersByIds = async () => {
    if (!session) {
      throw new Error("Session token is not available");
    }

    const sessionToken = await session?.getToken();
    if (sessionToken) {
      const users = await getManyUsers(userIds, sessionToken);
      // console.log("Fetched users by IDs:", users); // Log the fetched data
      return users;
    }
    throw new Error("Session token is not available");
  };

  return useQuery<User[], Error>(["usersByIds", userIds], fetchUsersByIds, {
    enabled: !!session && userIds.length > 0,
  });
};
