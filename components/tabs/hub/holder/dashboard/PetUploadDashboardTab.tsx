"use client";

import React, { useState, useEffect } from "react";
import {
  Specie,
  Gender,
  HealthCharacteristic,
  Size,
  Age,
  Color,
  Personality,
  LivingWithAnimalsCompatibility,
  LivingWithKidsCompatibility,
  TrainingLevel,
} from "@/lib/types/pet/enums.types";
import { Button, Divider, Input, Textarea } from "@nextui-org/react";
import CustomPetMediaUploader from "@/components/customUI/CustomPetMediaUploader";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { PetUploadValidations } from "@/lib/validations/hub/holder/dashboard/petUploadValidations";
import { useQueryClient } from "react-query";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";
import { useAddPet } from "@/lib/hooks/pet/useAddPet";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { isArray } from "@tsparticles/engine";

const options = {
  species: Specie,
  gender: Gender,
  health: HealthCharacteristic,
  size: Size,
  age: Age,
  color: Color,
  personality: Personality,
  livingWithAnimalsCompatibility: LivingWithAnimalsCompatibility,
  livingWithKidsCompatibility: LivingWithKidsCompatibility,
  trainingLevel: TrainingLevel,
};

type Category = keyof typeof options;

const categoryLabels: Record<Category, string> = {
  species: "What is the species of the pet?",
  gender: "What is the gender of the pet?",
  health: "What are the health characteristic of the pet?",
  size: "What is the size of the pet?",
  age: "What is the age of the pet?",
  color: "What is the color of the pet?",
  personality: "What are the personality traits of the pet?",
  livingWithAnimalsCompatibility:
    "Is the pet compatible with living with other animals?",
  livingWithKidsCompatibility: "Is the pet compatible with living with kids?",
  trainingLevel: "What is the training level of the pet?",
};

interface PetFormInputs {
  name: string;
  bio: string;
  species: string;
  gender: string;
  health: string[];
  size: string;
  age: string;
  color: string;
  personality: string[];
  livingWithAnimalsCompatibility: string;
  livingWithKidsCompatibility: string;
  trainingLevel: string;
  mediaFiles: {
    fileUrl: string;
    fileType: string;
    fileUploadCareId: string;
    label: string;
  }[];
}

interface PetUploadDashboardTabProps {
  onTabChange: (tabId: string) => void;
}

/**
 * PetUploadDashboardTab component - A form for uploading pet details and media.
 *
 * @param {PetUploadDashboardTabProps} props - The properties of the component.
 * @returns {JSX.Element} The PetUploadDashboardTab component.
 */
const PetUploadDashboardTab: React.FC<PetUploadDashboardTabProps> = ({
  onTabChange,
}) => {
  // Zustand store
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);

  const {
    mutate: addPet,
    isLoading: isPetAdditionLoading,
    isError: isPetAdditionError,
  } = useAddPet();
  const {
    mutate: updateUserProfile,
    isLoading: isUserProfileUpdateLoading,
    isError: isUserProfileUpdateError,
  } = useUpdateUserProfile();
  const [submissionAttempted, setSubmissionAttempted] = useState(false);

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, errors },
  } = useForm<PetFormInputs>({
    resolver: zodResolver(PetUploadValidations),
    defaultValues: {
      name: "",
      bio: "",
      species: "",
      gender: "",
      health: [],
      size: "",
      age: "",
      color: "",
      personality: [],
      livingWithAnimalsCompatibility: "",
      livingWithKidsCompatibility: "",
      trainingLevel: "",
      mediaFiles: [],
    },
    mode: "onChange",
  });

  const watchFields = watch();
  const [canContinue, setCanContinue] = useState(false);

  useEffect(() => {
    const allFieldsFilled = Object.keys(watchFields).every(
      (key) =>
        watchFields[key as keyof PetFormInputs] !== "" &&
        watchFields[key as keyof PetFormInputs] !== undefined &&
        watchFields[key as keyof PetFormInputs] !== null
    );
    const hasMediaFiles =
      watchFields.mediaFiles && watchFields.mediaFiles.length > 0;
    setCanContinue(allFieldsFilled && hasMediaFiles);
  }, [watchFields]);

  const onSubmit: SubmitHandler<PetFormInputs> = (data) => {
    setSubmissionAttempted(true);
    if (!canContinue) return;

    const petData = {
      holder: userData?._id,
      name: data.name,
      bio: data.bio,
      species: data.species,
      gender: data.gender,
      health: data.health,
      size: data.size,
      age: data.age,
      color: data.color,
      personality: data.personality,
      livingWithAnimalsCompatibility: data.livingWithAnimalsCompatibility,
      livingWithKidsCompatibility: data.livingWithKidsCompatibility,
      trainingLevel: data.trainingLevel,
      adoptionStatus: "Incomplete",
      media: data.mediaFiles,
    };

    addPet(petData, {
      onSuccess: (pet) => {
        if (pet._id) {
          const updatedPets = isArray(
            userProfileData?.profileData?.associatedPets
          )
            ? [
                ...userProfileData.profileData.associatedPets,
                pet._id.toString(),
              ]
            : [pet._id.toString()];

          updateUserProfile(
            {
              //@ts-ignore
              userId: userData?._id.toString(),
              profileId: userData?.currentProfile,
              data: {
                associatedPets: updatedPets,
              },
            },
            {
              onSuccess: () => {
                onTabChange("general");
              },
              onError: (error) => {
                console.error("Failed to update user profile:", error);
              },
            }
          );
        } else {
          console.error("Pet ID is undefined.");
        }
      },
      onError: (error) => {
        console.error("Failed to add pet:", error);
      },
    });
  };

  return (
    <div className="w-full h-full p-4">
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center w-full h-full"
      >
        <div className="flex flex-col items-start justify-between w-full gap-6 lg:flex-row">
          <section className="flex flex-col items-start justify-start w-full gap-8">
            <Controller
              name="name"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Input
                  {...field}
                  label="What's the name of the pet?"
                  isInvalid={!!error}
                  errorMessage={error?.message}
                />
              )}
            />
            <Controller
              name="bio"
              control={control}
              render={({ field, fieldState: { error } }) => (
                <Textarea
                  {...field}
                  label="Pet bio"
                  placeholder="Describe this beauty you're looking to upload"
                  maxLength={500}
                  isInvalid={!!error}
                  errorMessage={error?.message}
                />
              )}
            />
            <CustomPetMediaUploader
              onFinish={(files) => {
                // console.log("Files from uploader:", files);
                setValue("mediaFiles", files, { shouldValidate: true });
                // console.log("Updated form values:", watchFields.mediaFiles);
              }}
            />
          </section>
          <Divider
            orientation="vertical"
            className="lg:h-[700px] my-auto hidden lg:block"
          />
          <Divider orientation="horizontal" className="w-[60%] lg:hidden" />

          <section className="flex flex-col w-full gap-8">
            {Object.keys(options).map((categoryKey) => {
              const category = categoryKey as Category;
              return (
                <div key={category}>
                  <h3 className="mb-2 text-lg font-semibold">
                    {categoryLabels[category]}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {Object.values(options[category]).map((option) => (
                      <Controller
                        key={option}
                        name={category}
                        control={control}
                        render={({ field }) => (
                          <Button
                            onClick={() => {
                              if (Array.isArray(field.value)) {
                                if (field.value.includes(option)) {
                                  field.onChange(
                                    field.value.filter(
                                      (item: string) => item !== option
                                    )
                                  );
                                } else {
                                  field.onChange([...field.value, option]);
                                }
                              } else {
                                field.onChange(option);
                              }
                            }}
                            className={`px-4 py-2 rounded-[10px] ${
                              (Array.isArray(field.value)
                                ? field.value.includes(option)
                                : field.value === option) && "bg-blue"
                            }`}
                          >
                            {option}
                          </Button>
                        )}
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </section>
        </div>
        <Button
          color={`${canContinue ? "success" : "default"}`}
          radius="md"
          disabled={!canContinue}
          type="submit"
          className={`mt-10 px-6 py-2 w-[50%] ${
            canContinue
              ? "bg-green-500 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
          isLoading={isPetAdditionLoading || isUserProfileUpdateLoading}
        >
          {isPetAdditionLoading || isUserProfileUpdateLoading
            ? "Submitting..."
            : "Continue"}
        </Button>
      </form>
      {submissionAttempted && !canContinue && (
        <div className="mt-4 text-red-500">
          Please make sure to provide all the necessary data before continuing.
        </div>
      )}
      {isPetAdditionError && (
        <div className="mt-4 text-red-500">
          An error occurred while adding the pet. Please try again later.
        </div>
      )}
      {isUserProfileUpdateError && (
        <div className="mt-4 text-red-500">
          An error occurred while updating the user profile. Please try again
          later.
        </div>
      )}
    </div>
  );
};

export default PetUploadDashboardTab;
