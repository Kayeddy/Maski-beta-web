"use client";

import { SparklesCore } from "@/components/other/home/HeroParticles";
import { ScrollParallax } from "react-just-parallax";

import { useSession } from "@clerk/nextjs";
import { Button, Card, CardFooter, CardHeader, Image } from "@nextui-org/react";
import { useLocale } from "next-intl";
import Link from "next/link";

// NextUI
import { useTheme } from "next-themes";
import { useUserStore } from "@/store/shared/useUser.store";

import { useUserProfileStore } from "@/store/shared/useUserProfile.store";

export default function HeroSection() {
  const { session } = useSession();
  // Zustand store
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);

  const userLocale = useLocale();

  const getLinkHref = () => {
    if (!userData) {
      return `/${userLocale}/signup`;
    }
    if (!userData.onboarded) {
      return `/${userLocale}/onboarding`;
    }
    if (userProfileData) {
      const profileType = userProfileData.type;
      if (profileType === "adopter") {
        return `/${userLocale}/hub/adopter/adopt`;
      }
      if (profileType === "explorer") {
        return `/${userLocale}/hub/explorer/explore`;
      }
      if (profileType === "holder") {
        return `/${userLocale}/hub/holder/dashboard`;
      }
    }
    return "/onboarding";
  };

  const getButtonText = () => {
    if (!userData) {
      return "Sign up to get started";
    }
    if (!userData.onboarded) {
      return "Continue onboarding";
    }
    if (userProfileData && userData?.onboarded) {
      return "Go to my Hub";
    }
  };

  return (
    <main className="relative flex flex-row flex-wrap items-start justify-start w-screen h-screen gap-10 pb-[300px] overflow-hidden overflow-x-hidden overflow-y-auto lg:pb-0 main-container pt-0 lg:pt-24 bg-inherit">
      <div className="lg:max-w-[30%] text-black/70 dark:text-white/90">
        <h1 className="text-heading1-semibold text-[50px] lg:text-[60px]">
          Find Your New Best Friend with Maski
        </h1>
        <p className="mt-4 text-heading4-medium">
          Welcome to Maski, a tinder-like app designed to make pet adoption an
          enjoyable and intuitive experience. Swipe through profiles of adorable
          pets, just like you would on a dating app, to find the perfect match.
          {/* Our user-friendly interface ensures that connecting with your future
          furry friend is as easy and fun as possible. Whether you're looking
          for a playful pup or a cuddly cat, Maski helps you discover pets that
          fit your lifestyle and preferences. */}
        </p>
        {userData && session?.status === "active" && (
          <Link href={getLinkHref()} className="block mt-4">
            <Button
              className="w-full py-3 text-lg"
              color="primary"
              variant="shadow"
            >
              {getButtonText()}
            </Button>
          </Link>
        )}
      </div>
      <div className="relative lg:w-[60%] mt-24 xl:mt-0">
        <div className="relative">
          <Image
            src="https://ucarecdn.com/66aba84f-5302-4e0f-96d1-63e5ef93a681/-/preview/1000x525/"
            width="100%"
            height="100%"
            className="object-contain"
          />
          <span className="absolute top-[-100px] left-0 z-50 bg-black/50 backdrop-blur-md p-4 max-w-[300px] rounded-[20px] animate-wiggle">
            <h2 className="font-normal text-white text-heading3-bold">
              From Abandoned to Adored: The Journey of a Pet on Maski
            </h2>
          </span>
        </div>
      </div>
    </main>
  );
}
