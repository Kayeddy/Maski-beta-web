"use client";

// React
import React, { useState, useCallback, useEffect, useRef } from "react";
import { useForm, Controller } from "react-hook-form";

// Components
import {
  Select,
  SelectItem,
  Card,
  CardHeader,
  CardBody,
  Image,
  Button,
} from "@nextui-org/react";
import { MotionOnboardingProfileTypeSelectionFormWrapper } from "@/wrapper/motionWrapper";

// Next JS
import dynamic from "next/dynamic";

// Zod
import { zodResolver } from "@hookform/resolvers/zod";

// Validations
import { ProfileSelectionValidation } from "@/lib/validations/onboarding";

// Icons
import { QuestionMarkCircledIcon } from "@radix-ui/react-icons";

// Constants
import { holderTypeOptions, userTypeOptions } from "@/constants/onboarding";

// Clerk
import { useSession } from "@clerk/nextjs";
import { useRegisterUser } from "@/lib/hooks/user/useRegisterUser";
import { useUpdateUser } from "@/lib/hooks/user/useUpdateUser";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";
import { useCreateUserProfile } from "@/lib/hooks/profile/useCreateUserProfile";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";

const CustomDrawer = dynamic(
  () => import("@/components/customUI/CustomDrawer"),
  {
    ssr: false,
  }
);

interface FormValues {
  profileType: string;
  holderType?: string;
}

/**
 * Renders descriptions for user type options.
 * This is used in the CustomDrawer component to provide additional information to the user.
 * @returns {React.ReactElement} The component with the user type descriptions.
 */
const userTypeOptionsDescriptions = () => (
  <div className="flex flex-col items-start justify-start lg:justify-around w-full gap-8 p-4 lg:flex-row max-h-[400px] overflow-y-auto py-4 lg:py-0">
    {userTypeOptions.map(({ label, value, description }) => (
      <div key={value} className="flex flex-col gap-4">
        <h2 className="text-heading3-bold">{label}</h2>
        <p className="text-base-regular">{description}</p>
      </div>
    ))}
  </div>
);

interface ProfileTypeSelectionOnboardingFormProps {
  onProceed: (formName: string) => void;
}

/**
 * `ProfileTypeSelectionOnboardingForm` component handles the user profile type selection
 * during the onboarding process. It allows users to select a profile type and proceed
 * with the onboarding flow.
 *
 * @component
 * @param {ProfileTypeSelectionOnboardingFormProps} props The component props.
 * @param {Function} props.onProceed Callback function to proceed to the next step after form submission.
 * @returns {React.ReactElement} Rendered component.
 */
const ProfileTypeSelectionOnboardingForm: React.FC<
  ProfileTypeSelectionOnboardingFormProps
> = ({ onProceed }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const registerUserMutation = useRegisterUser(false);
  const updateUserMutation = useUpdateUser(false);

  const updateUserProfileMutation = useUpdateUserProfile();
  const createUserProfileMutation = useCreateUserProfile();

  const { isLoaded: isUserSessionLoaded, session } = useSession();

  // Zustand stores
  const { user: userData, setUser } = useUserStore();
  const { profile: userProfileData, setProfile } = useUserProfileStore();

  const {
    control,
    watch,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(ProfileSelectionValidation),
    defaultValues: {
      profileType: userProfileData ? userProfileData.type : "",
      holderType: userProfileData ? userProfileData?.holderType : "",
    },
  });

  const initialValues = useRef<FormValues>({
    profileType: userProfileData ? userProfileData.type : "",
    holderType: userProfileData ? userProfileData?.holderType : "",
  });

  const watchedFields: any = watch();

  // Watching the profileType field
  const profileType = watch("profileType");

  /**
   * Handles the form submission, updating or creating user profile data as necessary.
   * @param {FormValues} data The form data containing the selected profile type.
   */
  const onSubmit = useCallback(
    async (data: FormValues) => {
      if (!isUserSessionLoaded || !session) return;
      setIsSubmitting(true);

      const { profileType, holderType } = data;

      const userId = userData?._id;
      const profileId = userProfileData?._id;

      if (userId && profileId) {
        if (isModified) {
          updateUserProfileMutation.mutate(
            {
              userId: userId,
              profileId: profileId,
              type: profileType,
            },
            {
              onSuccess: (updatedProfile) => {
                setProfile(updatedProfile);
                onProceed(profileType);
              },
              onError: (error) => {
                console.error("Error updating profile:", error);
                setIsSubmitting(false);
              },
            }
          );
        } else {
          onProceed(profileType);
          setIsSubmitting(false);
        }
      } else {
        registerUserMutation.mutate(
          {
            email: session?.publicUserData.identifier ?? "",
            profileType: profileType,
            profileData:
              profileType === "holder"
                ? { holderType: holderType, associatedPets: [] }
                : {},
          },
          {
            onError: (error) => {
              console.error("Error registering user:", error);
              setIsSubmitting(false);
            },
          }
        );
      }
    },
    [
      isUserSessionLoaded,
      session,
      userData,
      userProfileData,
      isModified,
      registerUserMutation,
      updateUserProfileMutation,
      createUserProfileMutation,
      updateUserMutation,
      setProfile,
      setUser,
      onProceed,
    ]
  );

  useEffect(() => {
    if (userProfileData) {
      const initial = {
        profileType: userProfileData?.type ?? "",
        holderType: userProfileData.profileData?.holderType ?? "",
      };
      reset(initial);
      initialValues.current = initial; // Store the initial values for later comparison
    }
  }, [userProfileData, reset]);

  useEffect(() => {
    const checkIfModified = () => {
      const currentValues = {
        profileType: watchedFields.profileType,
        holderType: watchedFields.holderType,
      };
      return (
        currentValues.profileType !== initialValues.current.profileType ||
        currentValues.holderType !== initialValues.current.holderType
      );
    };

    setIsModified(checkIfModified());
  }, [watchedFields]);

  if (!isUserSessionLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <MotionOnboardingProfileTypeSelectionFormWrapper>
      <div className="flex flex-col items-center justify-center w-screen h-screen lg:w-full lg:h-fit">
        <Card className="flex flex-col items-center justify-center gap-2 p-10 h-screen lg:w-[600px] w-screen lg:h-[70vh] lg:min-h-[500px]">
          <div className="flex flex-col items-center justify-center">
            <CardHeader className="flex-col items-center justify-center gap-1 px-4 pb-0 lg:gap-0">
              <small className="text-center text-heading3-bold lg:text-default-500">
                {userProfileData ? "Good to see you again, " : "Welcome"}
              </small>
              <span className="flex flex-row items-center gap-4">
                <h4 className="font-bold text-heading3-bold lg:text-heading2-bold">
                  {userData
                    ? userData?.firstName || session?.publicUserData.firstName
                    : "Pet Lover"}
                </h4>
                <Image
                  alt="Card background"
                  width={24}
                  height={24}
                  className="max-w-md object-fit max-h-md"
                  src="https://em-content.zobj.net/source/microsoft-teams/363/waving-hand_1f44b.png"
                />
              </span>
            </CardHeader>
            <CardBody className="flex items-center justify-start gap-6 py-2 overflow-visible">
              <section className="flex flex-col items-center gap-4 lg:flex-row">
                <p className="relative max-w-md my-2 text-sm text-center text-default-500 text-body1-bold">
                  {userProfileData
                    ? "Ready to complete your profile?"
                    : "What brings you to Maski?"}
                </p>
                <CustomDrawer
                  triggerElement={
                    <div className="flex flex-row items-center gap-1 cursor-pointer hover:scale-105 animate-pulse">
                      <QuestionMarkCircledIcon />
                      <p className="text-base-regular lg:hidden">Info</p>
                    </div>
                  }
                  title="Check it out!"
                  description="Below is a brief explanation to each profile type. Don't worry, you can switch between profiles later!"
                  content={userTypeOptionsDescriptions()}
                />
              </section>
              <section className="w-full">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col items-center justify-center w-full gap-4"
                >
                  <Controller
                    name="profileType"
                    control={control}
                    rules={{ required: true }}
                    render={({ field, fieldState: { error } }) => (
                      <Select
                        {...field}
                        label="Choose your profile role"
                        variant="bordered"
                        size="lg"
                        className="w-[300px]"
                        errorMessage={error?.message}
                        selectedKeys={field.value ? [field.value] : []}
                        onChange={(value) => field.onChange(value)}
                      >
                        {userTypeOptions.map((option) => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </Select>
                    )}
                  />

                  {profileType === "holder" && (
                    <Controller
                      name="holderType"
                      control={control}
                      rules={{
                        required: profileType === "holder" ? true : false,
                      }}
                      render={({ field, fieldState: { error } }) => (
                        <Select
                          {...field}
                          label="What type of pet holder are you?"
                          variant="bordered"
                          size="lg"
                          className="w-[300px]"
                          isInvalid={error ? true : false}
                          errorMessage={error?.message}
                          selectedKeys={field.value ? [field.value] : []}
                          onChange={(value) => field.onChange(value)}
                        >
                          {holderTypeOptions.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))}
                        </Select>
                      )}
                    />
                  )}
                  <Button
                    type="submit"
                    isLoading={isSubmitting}
                    isDisabled={isSubmitting}
                  >
                    {!userProfileData || !userData
                      ? "Submit"
                      : isModified
                      ? "Update"
                      : "Continue"}
                  </Button>
                </form>
              </section>
            </CardBody>
          </div>
        </Card>
      </div>
    </MotionOnboardingProfileTypeSelectionFormWrapper>
  );
};

export default ProfileTypeSelectionOnboardingForm;
