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
import { AdopterPersonalDetailsFormValidation } from "@/lib/validations/onboarding";

// Stores
import { useUserOnboardingStore } from "@/store/onboarding/useUserOnboardingStore";

//Components
import CustomFormLocationInput from "@/components/customUI/CustomFormLocationInput";

import { useSession } from "@clerk/nextjs";
import { useUserStore } from "@/store/shared/useUser.store";

interface AdopterFormInput {
  firstName: string;
  middleName: string;
  lastName: string;
  email: string;
  bio: string;
  dateOfBirth: Date | string | Dayjs | null;
  location: string;
  profilePicture: string;
}

interface Props {
  handleFormSubmission: (data?: AdopterFormInput) => Promise<void>;
}

export default function AdopterOnboardingPersonalDetailsTab({
  handleFormSubmission,
}: Props) {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isModified, setIsModified] = useState(false);

  const { userState } = useUserOnboardingStore();
  const { clerkUserData } = userState;
  const { isLoaded: isUserSessionLoaded, session } = useSession();

  const userData = useUserStore((state) => state.user);

  const { handleSubmit, control, setValue, reset, clearErrors, watch } =
    useForm<AdopterFormInput>({
      resolver: zodResolver(AdopterPersonalDetailsFormValidation),
      defaultValues: {
        firstName: "",
        lastName: "",
        email: "",
        bio: "",
        dateOfBirth: null,
      },
    });

  const onSubmit: SubmitHandler<AdopterFormInput> = async (data) => {
    setLoading(true);
    if (isModified) {
      // Check if dateOfBirth is a Dayjs object and convert it to a Date object
      if (dayjs.isDayjs(data.dateOfBirth)) {
        data.dateOfBirth = data.dateOfBirth.toDate();
      } else if (typeof data.dateOfBirth === "string") {
        // Convert from string to Date if it's not already a Date object
        data.dateOfBirth = new Date(data.dateOfBirth);
      }
      // data.email = clerkUserData!.emailAddress!;
      await handleFormSubmission({
        ...data,
        profilePicture: session?.user?.imageUrl ?? "",
      });
    } else {
      await handleFormSubmission();
    }
    setLoading(false);
  };

  const handleLocationSelect = (location: string | null) => {
    setValue("location", location ?? "", { shouldValidate: true });
    setSelectedLocation(location);
    clearErrors("location"); // Clear any validation errors if the location is now valid
  };

  const watchedFields: any = watch();

  useEffect(() => {
    if (userData) {
      reset({
        firstName:
          userData?.firstName || session?.publicUserData.firstName || "",
        lastName: userData?.lastName || session?.publicUserData.lastName || "",
        email: userData?.email || clerkUserData?.emailAddress || "",
        bio: userData?.bio ?? "",
        dateOfBirth: userData?.dateOfBirth
          ? dayjs(new Date(userData.dateOfBirth)) // MongoDB date converted to JavaScript Date then to dayjs
          : null,
        location: userData?.location ?? selectedLocation,
      });
      setSelectedLocation(userData?.location ?? "");
    } else {
      setSelectedLocation("");
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
      console.log("document modified");
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
          {/* Controller for firstName */}
          <Controller
            name="firstName"
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
          />

          {/* Controller for last name */}
          <Controller
            name="lastName"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Input
                {...field}
                label="Last Name"
                placeholder="Enter your last name"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                type="text"
              />
            )}
          />

          {/* Controller for location */}
          <Controller
            name="location"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-start justify-center w-full gap-2">
                <CustomFormLocationInput
                  onLocationSelected={handleLocationSelect}
                  defaultValue={
                    field.value || selectedLocation || userData?.location || ""
                  }
                />
                {error && (
                  <p className="text-[#F31260] text-[0.75rem] text-left">
                    Please select a City from the results list
                  </p>
                )}
              </div>
            )}
          />

          {/* Controller for Bio */}
          <Controller
            name="bio"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <Textarea
                {...field}
                label="Bio"
                placeholder="Tell us why  you're interested in adopting..."
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                type="text"
                maxLength={500}
              />
            )}
          />

          {/* Controller for date of birth */}
          <Controller
            name="dateOfBirth"
            control={control}
            render={({ field, fieldState: { error } }) => (
              <div className="flex flex-col items-center justify-center w-full gap-2">
                <label
                  htmlFor="dateOfBirth"
                  className="text-small-regular text-[#525260] dark:text-white"
                >
                  Date of Birth
                </label>
                <DatePicker {...field} id="dateOfBirth" value={field.value} />
                {error && (
                  <p className="text-[#F31260] text-[0.75rem] text-left">
                    {error.message}
                  </p>
                )}
              </div>
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
