"use client";

import {
  createContext,
  useContext,
  useMemo,
  ReactNode,
  useEffect,
} from "react";
import { useSession } from "@clerk/nextjs";
import { useUser } from "@/lib/hooks/user/useUser";
import { useConversations } from "@/lib/hooks/conversations/useConversations";
import { useAllPets } from "@/lib/hooks/pet/useAllPets";
import { useUserStore } from "@/store/shared/useUser.store";

import PageTransitionLoader from "@/components/shared/loaders/PageTransitionLoader";
import "../app/globals.scss";
import { useUserProfile } from "@/lib/hooks/profile/useUserProfile";
import { useSocketContext } from "./socketContext";
import { useMatches } from "@/lib/hooks/match/useMatches";
import { usePetData } from "@/lib/hooks/pet/usePetData";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { usePetStore } from "@/store/shared/usePet.store";
import { usePathname, useRouter } from "next/navigation";

interface DataContextProps {
  children: ReactNode;
}

type ProfileType = "adopter" | "explorer" | "holder";

const DataContext = createContext<null | {}>(null);

// Define the routes each profile type can access
const profileRoutes: Record<ProfileType, string[]> = {
  adopter: [
    "/onboarding",
    "/hub/adopter/adopt",
    "/hub/chat",
    "/hub/hall-of-fame",
    "/hub/profile",
  ],
  explorer: [
    "/hub/explorer/explore",
    "/hub/hall-of-fame",
    "/hub/profile",
    "/onboarding",
  ],
  holder: [
    "/hub/holder/dashboard",
    "/hub/chat",
    "/hub/hall-of-fame",
    "/hub/profile",
    "/onboarding",
  ],
};
export const DataProvider = ({ children }: DataContextProps) => {
  const router = useRouter();
  const pathname = usePathname();

  const { session, isLoaded: isSessionLoaded } = useSession();

  // Memoize email to avoid unnecessary re-renders
  const email = useMemo(
    () => session?.publicUserData.identifier ?? "",
    [session]
  );

  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);
  const { pets } = usePetStore();
  // || userProfileData.type === "explorer"

  // React query hooks
  const { isLoading: userLoading } = useUser({ email });
  const { isLoading: userProfileLoading } = useUserProfile(
    userData?.currentProfile ?? "",
    true
  );
  const { isLoading: petsLoading } = useAllPets();

  const { isLoading: conversationsLoading } = useConversations(
    userData?._id ?? ""
  );
  const { isLoading: userMatchesLoading } = useMatches(
    userData?._id ?? "",
    userProfileData?.type ?? ""
  );

  useSocketContext();

  const isLoading =
    !isSessionLoaded ||
    userLoading ||
    userProfileLoading ||
    petsLoading ||
    conversationsLoading ||
    userMatchesLoading;

  // useEffect(() => {
  //   if (!isLoading) {
  //     if (!userProfileData || !userProfileData.type) {
  //       // Redirect to sign-in if user profile is not available
  //       router.push("/onboarding");
  //     } else {
  //       const currentPath = pathname;
  //       const allowedRoutes =
  //         profileRoutes[userProfileData.type as ProfileType] || [];

  //       // Check if the current route is allowed for the user's profile type
  //       if (!allowedRoutes.some((route) => currentPath.startsWith(route))) {
  //         router.push("/");
  //       }
  //     }
  //   }
  // }, [isLoading, userProfileData, router]);

  if (isLoading) return <PageTransitionLoader />;

  return <DataContext.Provider value={{}}>{children}</DataContext.Provider>;
};

export const useData = () => {
  return useContext(DataContext);
};
