"use client";

import React, { useMemo } from "react";

import { useSession } from "@clerk/nextjs";
import PageTransitionLoader from "@/components/shared/loaders/PageTransitionLoader";

import { motion } from "framer-motion";

import TestDesktopPetSlider from "@/components/other/hub/TestDesktopPetSlider";

import TestMobilePetSlider from "@/components/other/hub/TestMobilePetSlider";
import { useWindowSize } from "@/lib/hooks/shared/useWindowSize";
import { useUser } from "@/lib/hooks/user/useUser";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { useUserProfile } from "@/lib/hooks/profile/useUserProfile";
import { usePetStore } from "@/store/shared/usePet.store";
import { useAllPets } from "@/lib/hooks/pet/useAllPets";

export default function InteractiveSliderSection() {
  const { width } = useWindowSize();
  const breakpoint = 1024; // Breakpoint for mobile vs desktop
  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5, delay: 0.5 } },
  };

  const { isLoaded: isUserSessionLoaded, session } = useSession();

  // Zustand store
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);
  const petsData = usePetStore((state) => state.pets);

  // Memoize email to avoid unnecessary re-renders
  const email = useMemo(
    () => session?.publicUserData.identifier ?? "",
    [session]
  );

  // React query hooks
  const { isLoading: userDataLoading } = useUser({ email });

  const { isLoading: isUserProfileLoading } = useUserProfile(
    userData?.currentProfile ?? ""
  );

  const { isLoading: petDataLoading } = useAllPets();

  // If the session is not loaded yet, show a loading indicator
  if (
    !isUserSessionLoaded ||
    userDataLoading ||
    isUserProfileLoading ||
    petDataLoading
  ) {
    return <PageTransitionLoader />;
  }

  const petsArray = Array.isArray(petsData)
    ? petsData
    : petsData
    ? [petsData]
    : [];

  // Render the actual content once the session is loaded
  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={pageVariants}
      className="w-full h-full"
    >
      {width >= breakpoint ? (
        <div className="w-full h-full">
          {petsArray.length && (
            <TestDesktopPetSlider
              pets={petsArray}
              //@ts-ignore
              userData={userData}
              userProfileData={userProfileData}
            />
          )}
        </div>
      ) : (
        <div className="w-full h-full">
          <TestMobilePetSlider
            pets={petsArray}
            //@ts-ignore
            userData={userData}
            userProfileData={userProfileData}
          />
        </div>
      )}
    </motion.div>
  );
}
