"use client";

//  React
import React, { useCallback, useMemo, useState } from "react";

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
import AdopterOnboardingPersonalDetailsTab from "@/components/tabs/onboarding/adopter/AdopterOnboardingPersonalDetailsTab";
import AdopterOnboardingAdoptionPreferencesTab from "@/components/tabs/onboarding/adopter/AdopterOnboardingAdoptionPreferencesTab";

// Store
import { useOnboardingFormStore } from "@/store/onboarding/useOnboardingFormStore";
import { useUserOnboardingStore } from "@/store/onboarding/useUserOnboardingStore";

// Lib
import { Dayjs } from "dayjs";

// Clerk
import { useSession } from "@clerk/nextjs";
import { useUpdateUser } from "@/lib/hooks/user/useUpdateUser";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";

interface PersonalDetailsFormData {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  bio: string;
  dateOfBirth: Date | string | Dayjs | null;
  location: string;
}

interface UserPreferencesFormData {
  // Define the structure based on your form fields
}

/**
 * AdopterOnboardingForm is a component within the onboarding process specifically designed for adopters.
 * It features a tabbed form interface for users to enter their preferences and personal details as part of the adoption process.
 * A "Go back" option is provided to navigate to the previous step or screen.
 *
 * @component
 * @param {Object} props - The component props.
 * @param {() => void} [props.onReturn] - An optional callback function that is called when the user clicks the "Go back" option. Useful for navigating to the previous step in a multi-step onboarding process.
 *
 * @returns {React.ReactElement} The AdopterOnboardingForm component.
 *
 * @example
 * <AdopterOnboardingForm onReturn={() => console.log('Returning to the previous step.')} />
 */
export default function AdopterOnboardingForm({
  onReturn,
}: {
  onReturn?: () => void;
}) {
  const [selected, setSelected] = useState("personalDetails");
  const [submissionLoading, setSubmissionLoading] = useState(false);

  const {
    userState: onboardingUserState,
    markTabAsCompleted,
    setFormAndTab,
    updateFormData,
  } = useOnboardingFormStore();
  const { setDatabaseUserData } = useUserOnboardingStore();
  const { currentTab, adopterFormTabsCompleted, profileType } =
    onboardingUserState;

  const { session } = useSession();

  // Zustand stores
  const userData = useUserStore((state) => state.user);

  const updateUserMutation = useUpdateUser();
  const updateProfileMutation = useUpdateUserProfile();

  const router = useRouter();
  const currentLocale = useLocale();

  // Compute disabled keys based on the currentTab
  // This useMemo will recalculate the disabledKeys array any time currentTab changes
  const disabledKeys = useMemo(() => {
    const allKeys = ["personalDetails", "adoptionPreferences"];
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
        const clerkProvidedSessionToken = await session?.getToken();
        if (clerkProvidedSessionToken && userData) {
          updateUserMutation.mutate(
            {
              userId: userData._id,
              data: data,
            },
            {
              onSuccess: (updatedUser) => {
                setDatabaseUserData(updatedUser); // Assuming this merges or sets state appropriately
                updateFormData(profileType, data); // Assuming this updates the form data state
                markTabAsCompleted("personalDetails");
                setFormAndTab("adopterForm", "adoptionPreferences");
                setSelected("adoptionPreferences");
                setSubmissionLoading(false);
              },
            }
          );
        }
      } else {
        markTabAsCompleted("personalDetails");
        setFormAndTab("adopterForm", "adoptionPreferences");
        setSelected("adoptionPreferences");
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

  const handleAdoptionPreferencesSubmission = useCallback(
    async (data?: UserPreferencesFormData) => {
      setSubmissionLoading(true);
      const userId = userData?._id;
      const profileId = userData?.profiles ? userData.profiles[0] : "";

      if (data) {
        updateUserMutation.mutate({
          userId: userData?._id,
          data: {
            onboarded: true,
          },
        });
        updateProfileMutation.mutate(
          {
            userId: userId,
            profileId: profileId,
            data: { ...data },
          },
          {
            onSuccess: () => {
              router.replace(`/${currentLocale}/hub/adopter/adopt`);
              setSubmissionLoading(false);
            },
            onError: (error) => {
              console.error("Error updating profile:", error);
            },
          }
        );
      } else {
        router.replace(`/${currentLocale}/hub/adopter/adopt`);
        setSubmissionLoading(false);
      }
    },
    [updateProfileMutation, router, currentLocale]
  );

  return (
    <MotionOnboardingAdopterFormWrapper>
      <div className="flex flex-col w-full h-full">
        <Card className="lg:max-h-[600px] lg:max-w-[600px] w-screen h-screen">
          <CardBody className="relative p-10">
            <section
              className="flex flex-row items-center justify-start gap-2 mb-4 transition-all duration-200 ease-in-out cursor-pointer hover:opacity-60 w-fit"
              onClick={onReturn}
            >
              <ArrowLeftIcon />
              <p className="text-body-subtle">Go back</p>
            </section>
            <section>
              <Tabs
                aria-label="Adopter_onboarding_form_tabs"
                selectedKey={selected}
                disabledKeys={disabledKeys}
                //@ts-ignore
                onSelectionChange={setSelected}
                className="flex items-center justify-center w-full"
              >
                <Tab key="personalDetails" title="Personal details">
                  <AdopterOnboardingPersonalDetailsTab
                    handleFormSubmission={handlePersonalDetailsSubmission}
                  />
                </Tab>
                <Tab key="adoptionPreferences" title="Adoption preferences">
                  <AdopterOnboardingAdoptionPreferencesTab
                    handleFormSubmission={handleAdoptionPreferencesSubmission}
                  />
                </Tab>
              </Tabs>
            </section>
          </CardBody>
        </Card>
      </div>
    </MotionOnboardingAdopterFormWrapper>
  );
}
