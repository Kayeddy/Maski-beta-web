"use client";

//  React
import React, { useCallback, useEffect, useMemo, useState } from "react";

// Next
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";

// Icons
import { ArrowLeftIcon } from "@radix-ui/react-icons";

// Motion
import { MotionOnboardingAdopterFormWrapper } from "@/wrapper/motionWrapper";

// Next UI
import { Tabs, Tab, Card, CardBody } from "@nextui-org/react";

// Components
import HolderOnboardingPersonalDetailsTab from "@/components/tabs/onboarding/holder/HolderOnboardingPersonalDetailsTab";
import HolderOnboardingOrganizationDetailsTab from "@/components/tabs/onboarding/holder/HolderOnboardingOrganizationDetailsTab";

// Store
import { useOnboardingFormStore } from "@/store/onboarding/useOnboardingFormStore";
import { useUserOnboardingStore } from "@/store/onboarding/useUserOnboardingStore";

// Lib
import { Dayjs } from "dayjs";

// Clerk
import { useSession } from "@clerk/nextjs";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { useUpdateUser } from "@/lib/hooks/user/useUpdateUser";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";

interface PersonalDetailsFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  bio: string;
  dateOfBirth: Date | string | Dayjs | null;
  location: string;
}

interface OrganizationDetailsFormData {
  // Define the structure based on your form fields
}

/**
 * Component within the onboarding process specifically designed for pet holders.
 * It features a tabbed form interface for holders that belong to organizations,
 * to enter their organization details and personal details.
 * A "Go back" option is provided to navigate to the previous step or screen.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {() => void} [props.onReturn] - An optional callback function that is called when the user clicks the "Go back" option. Useful for navigating to the previous step in a multi-step onboarding process.
 *
 * @returns {React.ReactElement} The AdopterOnboardingForm component.
 */
export default function HolderOnboardingForm({
  onReturn,
}: {
  onReturn?: () => void;
}) {
  const [selected, setSelected] = useState("personalDetails");
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const { isLoaded: isUserSessionLoaded, session } = useSession();

  const {
    userState: onboardingUserState,
    markTabAsCompleted,
    setFormAndTab,
    updateFormData,
  } = useOnboardingFormStore();

  const { setDatabaseUserData, userState } = useUserOnboardingStore();

  const { currentTab, adopterFormTabsCompleted, profileType } =
    onboardingUserState;

  // Zustand stores
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);

  const updateUserMutation = useUpdateUser();
  const updateProfileMutation = useUpdateUserProfile();

  const router = useRouter();
  const currentLocale = useLocale();

  // Compute disabled keys based on the currentTab
  // This useMemo will recalculate the disabledKeys array any time currentTab changes
  const disabledKeys = useMemo(() => {
    const allKeys = ["personalDetails", "organizationDetails"];
    // Filter out keys to disable those that are not the current tab
    // and not in the list of completed tabs.
    if (userData?.onboarded) return undefined;

    return allKeys.filter(
      (key) =>
        key !== currentTab &&
        !selected.includes(key) &&
        !adopterFormTabsCompleted.includes(key)
    );
  }, [currentTab, adopterFormTabsCompleted]);

  const handlePersonalDetailsSubmission = useCallback(
    async (data?: PersonalDetailsFormData) => {
      setSubmissionLoading(true);

      if (data) {
        if (userData) {
          updateUserMutation.mutate(
            {
              userId: userData._id,
              data: {
                ...data,
                onboarded:
                  userProfileData.profileData.holderType === "individual"
                    ? true
                    : false,
              },
            },
            {
              onSuccess: (updatedUser) => {
                // setDatabaseUserData(updatedUser); //  this merges/sets the Zustand state appropriately
                // updateFormData(profileType, data); //  this updates the form data local Zustand state
                // if (userProfileData.profileData?.holderType === "individual") {
                //   router.replace(`/${currentLocale}/hub/holder/dashboard`);
                // } else {
                //   markTabAsCompleted("personalDetails");
                //   setFormAndTab("holderForm", "organizationDetails");
                //   setSelected("organizationDetails");
                // }
                router.replace(`/${currentLocale}/hub/holder/dashboard`);
              },
              onSettled: () => {
                setSubmissionLoading(false);
              },
            }
          );
        }
      } else {
        markTabAsCompleted("personalDetails");
        setFormAndTab("holderForm", "organizationDetails");
        setSelected("organizationDetails");
        setSubmissionLoading(false);
      }
    },
    [
      session,
      updateUserMutation,
      updateFormData,
      markTabAsCompleted,
      setFormAndTab,
      profileType,
    ]
  );

  const handleOrganizationDetailsSubmission = useCallback(
    async (data?: OrganizationDetailsFormData) => {
      setSubmissionLoading(true);
      const userId = userData?._id;
      const profileId = userData?.profiles ? userData.profiles[0] : "";

      if (data) {
        updateUserMutation.mutate({
          userId: userData?._id,
          data: { onboarded: true },
        });
        updateProfileMutation.mutate(
          {
            userId: userId,
            profileId: profileId,
            data: { ...data },
          },
          {
            onSuccess: () => {
              router.replace(`/${currentLocale}/hub/holder/dashboard`);
            },
            onError: (error) => {
              console.error("Error updating profile:", error);
            },
            onSettled: () => {
              setSubmissionLoading(false);
            },
          }
        );
      } else {
        router.replace(`/${currentLocale}/hub/holder/dashboard`);
        setSubmissionLoading(false);
      }
    },
    [updateProfileMutation, router, currentLocale]
  );

  if (!isUserSessionLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <MotionOnboardingAdopterFormWrapper>
      <div className="flex flex-col w-full h-full">
        <Card className="lg:max-h-[600px] lg:max-w-[450px] w-screen h-screen">
          <CardBody className="relative p-10">
            <section
              className="flex flex-row items-center justify-start gap-2 mb-4 transition-all duration-200 ease-in-out cursor-pointer hover:opacity-60 w-fit"
              onClick={onReturn}
            >
              <ArrowLeftIcon />
              <p className="text-body-subtle">Go back</p>
            </section>
            <section>
              {/* {userProfileData.profileData?.holderType === "individual" ? (
                <HolderOnboardingPersonalDetailsTab
                  handleFormSubmission={handlePersonalDetailsSubmission}
                />
              ) : (
                <Tabs
                  aria-label="Adopter_onboarding_form_tabs"
                  selectedKey={selected}
                  disabledKeys={disabledKeys}
                  //@ts-ignore
                  onSelectionChange={setSelected}
                  className="flex items-center justify-center w-full"
                >
                  <Tab key="personalDetails" title="Personal details">
                    <HolderOnboardingPersonalDetailsTab
                      handleFormSubmission={handlePersonalDetailsSubmission}
                    />
                  </Tab>
                  <Tab key="organizationDetails" title="Organization details">
                    <HolderOnboardingOrganizationDetailsTab
                      handleFormSubmission={handleOrganizationDetailsSubmission}
                    />
                  </Tab>
                </Tabs>
              )} */}
              <HolderOnboardingPersonalDetailsTab
                handleFormSubmission={handlePersonalDetailsSubmission}
              />
            </section>
          </CardBody>
        </Card>
      </div>
    </MotionOnboardingAdopterFormWrapper>
  );
}
