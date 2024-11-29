"use client";

// React
import React, { useEffect, useState } from "react";
import { useForm, Controller, SubmitHandler } from "react-hook-form";

import { format } from "date-fns";

// NextUI
import { Select, SelectItem, Button } from "@nextui-org/react";

// Zod
import { zodResolver } from "@hookform/resolvers/zod";

// Validations
import { AdopterAdoptionPreferencesValidation } from "@/lib/validations/onboarding";

//Components
import {
  preferredAnimalAgeOptions,
  preferredAnimalCharacteristic,
  preferredAnimalColorOptions,
  preferredAnimalGenderOptions,
  preferredAnimalPersonality,
  preferredAnimalSizeOptions,
  preferredAnimalSpeciesOptions,
  preferredAnimalTrainingLevelOptions,
} from "@/constants/onboarding";

import { capitalizeFirstLetter } from "@/lib/utils";
import { useSession } from "@clerk/nextjs";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";
import { AdopterFormAdoptionPreferences } from "@/lib/types/onboarding/interfaces.types";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import CustomNotificationToast from "@/components/customUI/CustomNotificationToast";

export default function AdoptionPreferencesTab() {
  const [loading, setloading] = useState(false);
  const [isModified, setIsModified] = useState(false);

  const updateProfileMutation = useUpdateUserProfile();
  const { isLoaded: isUserSessionLoaded, session } = useSession();

  // Zustand stores
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);

  const { handleSubmit, control, watch } =
    useForm<AdopterFormAdoptionPreferences>({
      resolver: zodResolver(AdopterAdoptionPreferencesValidation),
      defaultValues: {
        // Pre-fill the form defaults with user data if available
        preferredAnimalSpecies:
          userProfileData?.profileData?.preferredAnimalSpecies ?? "",
        preferredAnimalGender:
          userProfileData?.profileData?.preferredAnimalGender ?? "",
        preferredAnimalAge:
          userProfileData?.profileData?.preferredAnimalAge ?? "",
        preferredAnimalColor:
          userProfileData?.profileData?.preferredAnimalColor ?? "",
        preferredAnimalSize:
          userProfileData?.profileData?.preferredAnimalSize ?? "",
        preferredAnimalHealthCharacteristic:
          userProfileData?.profileData?.preferredAnimalHealthCharacteristic ??
          "",
        preferredAnimalPersonality:
          userProfileData?.profileData?.preferredAnimalPersonality ?? "",
        preferredAnimalTrainingLevel:
          userProfileData?.profileData?.preferredAnimalTrainingLevel ?? "",
      },
    });

  const onSubmit: SubmitHandler<AdopterFormAdoptionPreferences> = async (
    data
  ) => {
    setloading(true);
    updateProfileMutation.mutate(
      {
        userId: userData?._id,
        profileId: userProfileData._id,
        data: { ...data },
      },
      {
        onSuccess: () => {
          console.error("User profile updated succesfully");
          CustomNotificationToast({ title: "Preferences updated" });
          setloading(false);
        },
        onError: (error) => {
          console.error("Error updating profile:", error);
        },
      }
    );
  };

  const watchedFields: any = watch();

  useEffect(() => {
    // Function to check if any field value has changed from the initial profile data
    const checkIfModified = () => {
      return Object.keys(watchedFields).some(
        (field) =>
          watchedFields[field] !== (userProfileData?.profileData[field] ?? "")
      );
    };

    setIsModified(checkIfModified());
  }, [watchedFields, userProfileData]);

  if (!isUserSessionLoaded) {
    return <p>Loading...</p>;
  }

  return (
    <div className="flex flex-col items-center justify-start w-full h-full gap-6 lg:p-10 p-10 pb-[100px] overflow-hidden overflow-y-auto  rounded-2xl bg-glass-3 dark:bg-glass-3-dark backdrop-blur-lg">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-between w-full gap-6 md:h-full h-fit"
      >
        <section className="flex flex-wrap items-center justify-center w-full h-full gap-6 py-6">
          <Controller
            name="preferredAnimalSpecies"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <Select
                {...field}
                className="max-w-xs"
                label="Preferred animal specie"
                variant="flat"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                selectedKeys={
                  field.value
                    ? [capitalizeFirstLetter(field.value.toLocaleString())]
                    : []
                }
                onChange={(value) =>
                  field.onChange(value.target.value.toLowerCase())
                }
              >
                {preferredAnimalSpeciesOptions.map((item) => (
                  <SelectItem
                    key={item.speciesName}
                    // startContent={
                    //   <Avatar
                    //     alt={`${item.speciesName}_avatar_image`}
                    //     className="w-6 h-6"
                    //     src={item.avatar}
                    //   />
                    // }
                    className="capitalize placeholder:capitalize selection:capitalize"
                  >
                    {item.speciesName}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="preferredAnimalGender"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <Select
                className="max-w-xs"
                label="preferred animal gender"
                {...field}
                variant="flat"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                selectedKeys={
                  field.value
                    ? [capitalizeFirstLetter(field.value.toLocaleString())]
                    : []
                }
                onChange={(value) =>
                  field.onChange(value.target.value.toLowerCase())
                }
              >
                {preferredAnimalGenderOptions.map((item) => (
                  <SelectItem
                    key={item.option}
                    // startContent={
                    //   <Avatar
                    //     alt={`${item.speciesName}_avatar_image`}
                    //     className="w-6 h-6"
                    //     src={item.avatar}
                    //   />
                    // }
                    className="capitalize"
                  >
                    {item.option}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="preferredAnimalAge"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <Select
                className="max-w-xs"
                label="preferred animal age"
                {...field}
                variant="flat"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                selectedKeys={
                  field.value
                    ? [capitalizeFirstLetter(field.value.toLocaleString())]
                    : []
                }
                onChange={(e) => {
                  // Extract only the first word from the selected option and convert it to lowercase
                  const firstWord = e.target.value.split(" ")[0].toLowerCase();
                  field.onChange(firstWord);
                }}
              >
                {preferredAnimalAgeOptions.map((item) => (
                  <SelectItem
                    key={item.ageRange}
                    // startContent={
                    //   <Avatar
                    //     alt={`${item.speciesName}_avatar_image`}
                    //     className="w-6 h-6"
                    //     src={item.avatar}
                    //   />
                    // }
                    className="capitalize"
                  >
                    {item.ageRange}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="preferredAnimalColor"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <Select
                className="max-w-xs"
                label="preferred animal color"
                {...field}
                variant="flat"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                selectedKeys={
                  field.value
                    ? [capitalizeFirstLetter(field.value.toLocaleString())]
                    : []
                }
                onChange={(value) =>
                  field.onChange(value.target.value.toLowerCase())
                }
              >
                {preferredAnimalColorOptions.map((item) => (
                  <SelectItem
                    key={item.option}
                    // startContent={
                    //   <Avatar
                    //     alt={`${item.speciesName}_avatar_image`}
                    //     className="w-6 h-6"
                    //     src={item.avatar}
                    //   />
                    // }
                    className="capitalize"
                  >
                    {item.option}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="preferredAnimalSize"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <Select
                className="max-w-xs"
                label="preferred animal size"
                {...field}
                variant="flat"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                selectedKeys={
                  field.value
                    ? [capitalizeFirstLetter(field.value.toLocaleString())]
                    : []
                }
                onChange={(value) =>
                  field.onChange(value.target.value.toLowerCase())
                }
              >
                {preferredAnimalSizeOptions.map((item) => (
                  <SelectItem
                    key={item.sizeRange}
                    // startContent={
                    //   <Avatar
                    //     alt={`${item.speciesName}_avatar_image`}
                    //     className="w-6 h-6"
                    //     src={item.avatar}
                    //   />
                    // }
                    className="capitalize"
                  >
                    {item.sizeRange}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="preferredAnimalPersonality"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <Select
                className="max-w-xs"
                label="preferred animal personality"
                {...field}
                variant="flat"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                selectedKeys={
                  field.value
                    ? [capitalizeFirstLetter(field.value.toLocaleString())]
                    : []
                }
                onChange={(value) =>
                  field.onChange(value.target.value.toLowerCase())
                }
              >
                {preferredAnimalPersonality.map((item) => (
                  <SelectItem
                    key={item.option}
                    // startContent={
                    //   <Avatar
                    //     alt={`${item.speciesName}_avatar_image`}
                    //     className="w-6 h-6"
                    //     src={item.avatar}
                    //   />
                    // }
                    className="capitalize"
                  >
                    {item.option}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="preferredAnimalHealthCharacteristic"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <Select
                className="max-w-xs"
                label="preferred animal characteristic"
                {...field}
                variant="flat"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                selectedKeys={
                  field.value
                    ? [capitalizeFirstLetter(field.value.toLocaleString())]
                    : []
                }
                onChange={(value) =>
                  field.onChange(value.target.value.toLowerCase())
                }
              >
                {preferredAnimalCharacteristic.map((item) => (
                  <SelectItem
                    key={item.option}
                    // startContent={
                    //   <Avatar
                    //     alt={`${item.speciesName}_avatar_image`}
                    //     className="w-6 h-6"
                    //     src={item.avatar}
                    //   />
                    // }
                    className="capitalize"
                  >
                    {item.option}
                  </SelectItem>
                ))}
              </Select>
            )}
          />

          <Controller
            name="preferredAnimalTrainingLevel"
            control={control}
            rules={{ required: true }}
            render={({ field, fieldState: { error } }) => (
              <Select
                className="max-w-xs"
                label="preferred animal training level"
                {...field}
                variant="flat"
                isInvalid={error ? true : false}
                errorMessage={error?.message}
                selectedKeys={
                  field.value
                    ? [capitalizeFirstLetter(field.value.toLocaleString())]
                    : []
                }
                onChange={(value) =>
                  field.onChange(value.target.value.toLowerCase())
                }
              >
                {preferredAnimalTrainingLevelOptions.map((item) => (
                  <SelectItem
                    key={item.option}
                    // startContent={
                    //   <Avatar
                    //     alt={`${item.speciesName}_avatar_image`}
                    //     className="w-6 h-6"
                    //     src={item.avatar}
                    //   />
                    // }
                    className="capitalize"
                  >
                    {item.option}
                  </SelectItem>
                ))}
              </Select>
            )}
          />
        </section>

        <section className="flex items-center justify-center w-full">
          <Button
            size="lg"
            type="submit"
            color="primary"
            isDisabled={loading || !isModified}
            isLoading={loading}
            className="disabled:cursor-not-allowed"
          >
            Update
          </Button>
        </section>
      </form>
    </div>
  );
}
