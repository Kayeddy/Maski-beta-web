"use client";

import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { useSession } from "@clerk/nextjs";
import { Button, Chip } from "@nextui-org/react";
import { format } from "date-fns";
import Image from "next/image";
import { useEffect } from "react";

const holderProfileView = () => {};

const explorerProfileView = () => {};

const adopterProfileView = () => {};

export default function PersonalDetailsTab() {
  const { isLoaded: isUserSessionLoaded, session } = useSession();
  // Zustand stores

  const userData = useUserStore((state) => state.user);

  const userProfileData = useUserProfileStore((state) => state.profile);

  if (!isUserSessionLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-6 overflow-hidden overflow-y-auto p-10 pb-[100px] lg:p-10  rounded-2xl bg-glass-3 dark:bg-glass-3-dark backdrop-blur-lg select-none">
      {/* Basic profile info section */}

      <section className="flex flex-col items-center justify-center w-full gap-6">
        {/* Profile image and name sub-section */}

        <div className="flex flex-row items-center justify-center gap-6">
          <Image
            //@ts-ignore
            src={userData?.profilePicture ?? session?.publicUserData.imageUrl}
            alt="user-profile-image"
            width={60}
            height={60}
            className="object-cover rounded-full"
          />
          <div className="flex flex-col items-center justify-center dark:text-white text-black/80 ">
            <h2 className="text-heading2-semibold">{userData?.firstName}</h2>
            <h3 className="translate-x-9 text-heading3-bold">
              {userData?.lastName}
            </h3>
          </div>
        </div>

        {/* Profile type sub-section */}
        <div className="flex flex-row items-center justify-center w-full gap-2">
          <Chip radius="sm" size="lg" variant="flat" color="secondary">
            {userProfileData.type}
          </Chip>
          <Button
            color="primary"
            variant="light"
            size="lg"
            isDisabled={true}
            className="cursor-not-allowed disabled"
          >
            {userProfileData.type === "adopter" && "Switch to Pet holder"}
            {userProfileData.type === "holder" && "Switch to Adopter"}
            {userProfileData.type === "explorer" && "Change profile"}
          </Button>
        </div>
      </section>

      <div className={`contentSeparator w-[50%]`} />

      {/* Profile info fields section */}
      <section className="flex flex-row items-center justify-around w-full">
        {/* Additional user information sub-section */}

        <div className="flex flex-col items-center justify-center">
          <p className="text-body-semibold">Location:</p>
          {userData?.location}
        </div>
        <div className="flex flex-col items-center justify-center">
          <p className="text-body-semibold">Bio:</p>
          {userData?.bio}
        </div>
      </section>

      <section className="mt-auto align-bottom">
        <p className="text-body1-bold">
          {`Member since ${format(
            userData?.createdAt || new Date(),
            "EEEE, MMMM dd, yyyy"
          )}`}
        </p>
      </section>
    </div>
  );
}
