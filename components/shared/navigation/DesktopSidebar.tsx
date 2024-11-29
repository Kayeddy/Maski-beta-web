"use client";

// Global
import React, { useState, useRef, useEffect } from "react";

// Framer motion
import { AnimatePresence, motion } from "framer-motion";

// configs
import {
  sidebarVariants,
  sidebarImageVariants,
  sidebarItemVariants,
} from "@/config/motion/sidebar";

// constants
import {
  adopterLeftSidebarItems,
  explorerLeftSidebarItems,
  holderLeftSidebarItems,
} from "@/constants/navigation";
import SidebarImage from "@/components/other/navigation/SidebarImage";

// components
import SidebarItem from "@/components/other/navigation/SidebarItem";

// Icon
import { FaSignOutAlt as SignoutIcon } from "react-icons/fa";

// Clerk
import { SignOutButton, UserProfile, useSession } from "@clerk/nextjs";

// NextUI
import { User } from "@nextui-org/react";

// next intl
import { useLocale } from "next-intl";
import Link from "next/link";
import HubThemeSwitcher from "@/components/other/navigation/HubThemeSwitcher";

// Next
import { redirect, useRouter } from "next/navigation";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import PageTransitionLoader from "../loaders/PageTransitionLoader";

const DesktopSidebar = () => {
  const [isExpanded, setExpanded] = useState(false);
  const [isSignoutLoading, setIsSignoutLoading] = useState(false);
  const isHovering = useRef(false);

  const currentLocale = useLocale();
  const router = useRouter();

  const { isLoaded: isUserSessionLoaded, session } = useSession();

  // Zustand stores
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);

  const handleMouseEnter = () => {
    isHovering.current = true;
    setExpanded(true);
  };

  const handleMouseLeave = () => {
    isHovering.current = false;
    // Wait for the hover animation to finish before collapsing
    setTimeout(() => {
      if (!isHovering.current) {
        setExpanded(false);
      }
    }, 100); // Adjust the timeout to match your longest transition duration
  };

  const getSidebarItems = (profileType: string) => {
    switch (profileType) {
      case "adopter":
        return adopterLeftSidebarItems;
      case "explorer":
        return explorerLeftSidebarItems;
      case "holder":
        return holderLeftSidebarItems;
      default:
        return []; // Return an empty array or a default set of items if profile type is unknown
    }
  };

  useEffect(() => {
    // Ensure the state is collapsed when the component mounts
    setExpanded(false);
  }, []);

  if (!isUserSessionLoaded || !userProfileData) {
    return;
  }

  const sidebarItems = userProfileData
    ? getSidebarItems(userProfileData.type)
    : [];

  return (
    <AnimatePresence>
      <motion.aside
        className={`sidebar bg-glass-2 dark:bg-glass-2-dark fixed left-0 top-0 z-[999] lg:flex hidden h-screen flex-col items-center justify-center overflow-hidden`}
        variants={sidebarVariants}
        initial="collapsed"
        whileInView="visible"
        animate={isExpanded ? "expanded" : "collapsed"}
        onHoverStart={handleMouseEnter}
        onHoverEnd={handleMouseLeave}
      >
        <motion.nav className="flex flex-col items-start justify-around h-full px-4">
          <section className="flex items-center justify-center w-full h-auto translate-y-[20px]">
            <Link href={`/${currentLocale}`}>
              <SidebarImage
                src={
                  isExpanded
                    ? "/assets/core/logo_lg_dark.webp"
                    : "/assets/core/logo_sm_dark.webp"
                }
                alt="Sidebar-logo"
                isExpanded={isExpanded}
              />
            </Link>
          </section>

          <div className={`contentSeparator w-full`} />

          <section className="flex flex-col items-center justify-center w-full gap-4">
            <motion.div
              className="flex items-center justify-center w-full overflow-hidden whitespace-nowrap"
              variants={sidebarImageVariants}
              initial="collapsed"
              animate={isExpanded ? "expanded" : "collapsed"}
              transition={{ duration: 0.2, ease: "easeInOut" }}
            >
              <Link href={`/${currentLocale}/hub/profile`}>
                <User
                  name={
                    <p className="text-base-regular">
                      {isExpanded ? userData?.firstName : ""}
                    </p>
                  }
                  description={
                    <p className="text-white text-small-medium">
                      {isExpanded ? userProfileData?.type : ""}
                    </p>
                  }
                  avatarProps={{
                    src: session?.publicUserData.imageUrl,
                    size: "md",
                  }}
                  className="text-white capitalize object-contain text-[20px]"
                />
              </Link>
            </motion.div>
            <div className="flex flex-row items-center justify-center w-full gap-1">
              <HubThemeSwitcher />
              <motion.p
                variants={sidebarItemVariants}
                initial="collapsed"
                animate={isExpanded ? "expanded" : "collapsed"}
                transition={{ duration: 0.2, ease: "easeInOut" }}
                className="text-white"
              >
                Theme
              </motion.p>
            </div>
          </section>

          <div className={`contentSeparator w-full`} />

          <section
            className={`${isExpanded ? "mx-auto" : "flex w-full items-center"}`}
          >
            <div
              className={`flex flex-col ${
                isExpanded ? "mx-auto items-start" : "items-center"
              } justify-center  w-full h-auto gap-12`}
            >
              {sidebarItems.map((item) => (
                <Link
                  key={item.name}
                  href={`/${currentLocale}/${item.link}`}
                  className="capitalize"
                >
                  <SidebarItem
                    //@ts-ignore
                    Icon={item.icon}
                    title={item.name}
                    isSidebarExpanded={isExpanded}
                    //children={item.children}
                  />
                </Link>
              ))}
            </div>
          </section>

          <div className={`contentSeparator w-full`} />

          <section className="flex items-center justify-center w-full">
            <SignOutButton
              signOutCallback={() => {
                setIsSignoutLoading(true);
                router.replace(`/${currentLocale}`);
                setIsSignoutLoading(false);
              }}
            >
              <motion.button
                className="flex flex-row items-center justify-center gap-2 text-white"
                variants={sidebarItemVariants}
                initial="collapsed"
                animate="expanded"
              >
                <motion.span
                  className={`transition-all duration-75 ease-in-out text-heading4-medium`}
                >
                  <SignoutIcon />
                </motion.span>
                <motion.p
                  className="relative flex-shrink-0 w-full overflow-hidden whitespace-nowrap text-heading4-medium"
                  variants={sidebarItemVariants}
                  initial={"collapsed"}
                  animate={isExpanded ? "expanded" : "collapsed"}
                >
                  Sign out
                </motion.p>
              </motion.button>
            </SignOutButton>
          </section>
        </motion.nav>
      </motion.aside>
      {isSignoutLoading && <PageTransitionLoader />}
    </AnimatePresence>
  );
};

export default React.memo(DesktopSidebar);
