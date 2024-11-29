"use client";

// React
import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

// TODO: Remove this dependency from package json
import Datepicker from "tailwind-datepicker-react";

// Libraries
import { DatePicker } from "antd";
import dayjs, { Dayjs } from "dayjs";

// NextUI
import { Button, Input, Textarea } from "@nextui-org/react";

// Zod
import { zodResolver } from "@hookform/resolvers/zod";

// Validations
import {
  HolderOrganizationDetails,
  HolderPersonalDetailsFormValidation,
} from "@/lib/validations/onboarding";

// Stores
import { useUserOnboardingStore } from "@/store/onboarding/useUserOnboardingStore";
import { useOnboardingFormStore } from "@/store/onboarding/useOnboardingFormStore";

//Components
import CustomFormLocationInput from "@/components/customUI/CustomFormLocationInput";

import { useSession } from "@clerk/nextjs";
import { useUserStore } from "@/store/shared/useUser.store";

interface HolderOrganizationFormInput {
  organizationImage?: string;
  organizationName: string;
  organizationDescription: string;
  associatedPets: string[] | [];
}

interface Props {
  handleFormSubmission: (data?: HolderOrganizationFormInput) => Promise<void>;
}

export default function HolderOnboardingOrganizationDetailsTab({
  handleFormSubmission,
}: Props) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModified, setIsModified] = useState(false);

  const { userState } = useUserOnboardingStore();
  const { clerkUserData, databaseUserData } = userState;
  const { userState: OnboardingUserState } = useOnboardingFormStore();
  const { isLoaded: isUserSessionLoaded, session } = useSession();

  // Zustand stores
  const userData = useUserStore((state) => state.user);

  const { handleSubmit, control, setValue, reset, clearErrors, watch } =
    useForm<HolderOrganizationFormInput>({
      resolver: zodResolver(HolderOrganizationDetails),
      defaultValues: {
        organizationImage: "",
        organizationName: "",
        organizationDescription: "",
        associatedPets: [],
      },
    });

  const onSubmit: SubmitHandler<HolderOrganizationFormInput> = async (data) => {
    setLoading(true);
    // if (isModified) {
    //   // data.email = clerkUserData!.emailAddress!;
    //   await handleFormSubmission(data);
    // } else {
    //   await handleFormSubmission();
    // }
    await handleFormSubmission(data);
    setLoading(false);
  };

  const watchedFields: any = watch();

  useEffect(() => {
    if (userData) {
      reset({
        organizationImage: "",
        organizationName: "",
        organizationDescription: "",
        associatedPets: [],
      });
    }
  }, [userData, reset]);

  useEffect(() => {
    if (userData) {
      // Function to check if any field value has changed from the initial profile data
      const checkIfModified = () => {
        return Object.keys(watchedFields).some((field) => {
          //@ts-ignore
          let originalValue = (userData && userData[field]) ?? "";
          let currentValue = watchedFields[field];

          // Special handling for dates
          if (field === "dateOfBirth") {
            originalValue = originalValue
              ? dayjs(originalValue).format("YYYY-MM-DD")
              : "";
            currentValue = currentValue
              ? dayjs(currentValue).format("YYYY-MM-DD")
              : "";
          }

          return currentValue !== originalValue;
        });
      };
      // console.log("document modified");
      setIsModified(checkIfModified());
    } else {
      // If there is no user profile data available, set modified to false
      setIsModified(false);
    }
  }, [watchedFields, userData]);

  if (!isUserSessionLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="relative flex items-start justify-center w-full h-full">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-start justify-start w-full h-full"
      >
        <section className="flex flex-col items-center justify-center w-full gap-6 py-6">
          {/* Controller for organization image */}
          {/* <Controller
            name="organizationImage"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label="First Name"
                placeholder="Enter your first name"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                type="text"
              />
            )}
          /> */}

          {/* Controller for organization name */}
          <Controller
            name="organizationName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label="Organization name"
                placeholder="Enter the name of your organization"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                type="text"
              />
            )}
          />

          {/* Controller for organization description */}
          <Controller
            name="organizationDescription"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Textarea
                {...field}
                label="Bio"
                placeholder="Briefly describe what your organization does"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                type="text"
                maxLength={500}
              />
            )}
          />
        </section>

        <section className="w-full">
          <Button
            type="submit"
            fullWidth
            color="primary"
            disabled={loading}
            isLoading={loading}
          >
            {!userData?.onboarded
              ? "Submit"
              : isModified
              ? "Update"
              : "Continue"}
          </Button>
        </section>
      </form>
    </div>
  );
}
