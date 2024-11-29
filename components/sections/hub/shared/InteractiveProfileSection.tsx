"use client";
import React, { useMemo } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import ProfileLampDecoration from "@/components/other/hub/ProfileLampDecoration";

import { useSession } from "@clerk/nextjs";

import { CustomTabsSelector } from "@/components/customUI/CustomTabsSelector";
import LikesTab from "@/components/tabs/hub/shared/profile/LikesTab";

import PersonalDetailsTab from "@/components/tabs/hub/shared/profile/PersonalDetailsTab";
import AdoptionPreferencesTab from "@/components/tabs/hub/shared/profile/AdoptionPreferencesTab";
import PageTransitionLoader from "@/components/shared/loaders/PageTransitionLoader";

import { initialLoadVariants } from "@/config/motion/hub";
import MatchesTab from "@/components/tabs/hub/shared/profile/MatchesTab";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";

export const InteractiveProfileSection = () => {
  const adopterTabs = [
    {
      title: "Likes",
      value: "likes",
      content: <LikesTab />,
    },
    {
      title: "Matches",
      value: "matches",
      content: <MatchesTab />,
    },
    {
      title: "Personal details",
      value: "details",
      content: <PersonalDetailsTab />,
    },
    {
      title: "Adoption preferences",
      value: "preferences",
      content: <AdoptionPreferencesTab />,
    },
  ];
  const explorerTabs = [
    {
      title: "Personal details",
      value: "details",
      content: <PersonalDetailsTab />,
    },
    // {
    //   title: "Likes",
    //   value: "likes",
    //   content: <LikesTab />,
    // },
  ];
  const holderTabs = [
    {
      title: "Personal details",
      value: "details",
      content: <PersonalDetailsTab />,
    },
  ];

  const { isLoaded: isUserSessionLoaded, session } = useSession();

  // Memoize email to avoid unnecessary re-renders
  const email = useMemo(
    () => session?.publicUserData.identifier ?? "",
    [session]
  );

  // Zustand store
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);

  const getDynamicTabs = () => {
    if (userProfileData && userProfileData?.type === "explorer") {
      return explorerTabs;
    }

    if (userProfileData && userProfileData?.type === "adopter") {
      return adopterTabs;
    }

    if (userProfileData && userProfileData?.type === "holder") {
      return holderTabs;
    }
  };

  // If the session is not loaded yet, show a loading indicator
  if (!isUserSessionLoaded) {
    return <PageTransitionLoader />;
  }

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={initialLoadVariants}
      className={cn(
        "relative flex w-screen h-screen flex-col items-center justify-center overflow-y-auto overflow-hidden"
      )}
    >
      {/* User welcome section */}
      <section className="relative w-full ">
        <div className="absolute top-0 z-50 flex flex-row items-center justify-center w-full gap-4">
          <motion.h1
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: -270 }}
            transition={{
              delay: 0.3,
              duration: 0.8,
              ease: "easeInOut",
            }}
            className="px-4 text-center text-black/80 lg:text-heading1-semibold text-heading2-semibold dark:text-white"
          >
            {`Welcome back, ${userData?.firstName ?? ""}`}
          </motion.h1>
        </div>
      </section>

      {/* User Lamp decoration */}
      <section className="w-full -translate-y-[40px] lg:-translate-y-[80px] relative">
        <ProfileLampDecoration />
      </section>

      {/* Content */}
      <section className="relative w-full -translate-y-[150px] lg:-translate-y-[170px]">
        {/*@ts-ignore*/}
        <CustomTabsSelector tabs={getDynamicTabs()} />
      </section>
    </motion.div>
  );
};
