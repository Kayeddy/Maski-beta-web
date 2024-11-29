import { IPet } from "@/lib/types/pet/interfaces.types";
import { motion } from "framer-motion";
import { Button, Chip, Divider, Input, Textarea } from "@nextui-org/react";
import { ArrowLeftIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetGeneralDetailsEditionValidations } from "@/lib/validations/hub/holder/dashboard/petUploadValidations";
import { Age, Color, Gender, Size, Specie } from "@/lib/types/pet/enums.types";

import { useUpdatePet } from "@/lib/hooks/pet/useUpdatePet";
import { QueryClient, useQueryClient } from "react-query";
import CustomNotificationToast from "@/components/customUI/CustomNotificationToast";

// Define the available colors
const availableColors: Array<
  "primary" | "secondary" | "success" | "warning" | "danger"
> = ["primary", "secondary", "success", "warning", "danger"];

// Function to get a random color
const getRandomColor = ():
  | "default"
  | "primary"
  | "secondary"
  | "success"
  | "warning"
  | "danger" => {
  const randomIndex = Math.floor(Math.random() * availableColors.length);
  return availableColors[randomIndex];
};

interface PetEditionFormInputs {
  name: string;
  bio: string;
  species: string;
  gender: string;
  size: string;
  age: string;
  color: string;
}

const options = {
  species: Specie,
  gender: Gender,
  size: Size,
  age: Age,
  color: Color,
};

type Category = keyof typeof options;

const categoryLabels: Record<Category, string> = {
  species: "What is the species of the pet?",
  gender: "What is the gender of the pet?",
  size: "What is the size of the pet?",
  age: "What is the age of the pet?",
  color: "What is the color of the pet?",
};

const PetGeneralDetailsEditionSection = ({
  petData,
  exitEditMode,
}: {
  petData: IPet;
  adminMode?: boolean;
  exitEditMode: () => void;
}) => {
  const [submissionAttempted, setSubmissionAttempted] = useState(false);
  const [canContinue, setCanContinue] = useState(false);

  const queryClient = useQueryClient();
  const {
    mutate: updatePet,
    isLoading: isPetUpdateLoading,
    isError: isPetUpdateError,
  } = useUpdatePet();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { isValid, errors },
  } = useForm<PetEditionFormInputs>({
    resolver: zodResolver(PetGeneralDetailsEditionValidations),
    defaultValues: {
      name: petData.name || "",
      bio: petData.bio || "",
      species: petData.species || "",
      gender: petData.gender || "",
      size: petData.size || "",
      age: petData.age || "",
      color: petData.color || "",
    },
    mode: "onChange",
  });

  const watchFields = watch();

  const onSubmit: SubmitHandler<PetEditionFormInputs> = (data) => {
    setSubmissionAttempted(true);
    if (!canContinue) return;

    const updatedPetData = {
      ...petData,
      ...data,
    };

    updatePet(
      {
        petId: petData._id ?? "",
        data: updatedPetData,
      },
      {
        onSuccess: () => {
          CustomNotificationToast({ title: "Pet information updated" });
        },
        onError: (error) => {
          console.error("Failed to update pet:", error);
        },
      }
    );
  };

  useEffect(() => {
    const allFieldsFilled = Object.keys(watchFields).every(
      (key) =>
        watchFields[key as keyof PetEditionFormInputs] !== "" &&
        watchFields[key as keyof PetEditionFormInputs] !== undefined &&
        watchFields[key as keyof PetEditionFormInputs] !== null
    );

    setCanContinue(allFieldsFilled);
  }, [watchFields]);

  return (
    <div className="relative flex flex-col w-full gap-6 overflow-x-hidden overflow-y-auto h-auto max-h-[700px] p-6 pb-[200px]">
      <header className="flex flex-row items-center justify-start w-full text-dark-3 dark:text-light-3">
        <Button
          size="sm"
          color="primary"
          aria-label="Exit edit mode"
          variant="flat"
          className="text-white"
          onClick={exitEditMode}
        >
          <ArrowLeftIcon />
          Go back
        </Button>
      </header>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col items-center justify-center gap-6"
      >
        <section className="flex flex-col flex-wrap items-start justify-start w-full gap-4">
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
                          size="sm"
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
        <Divider />
        <section className="w-full text-body-medium text-dark-3 dark:text-light-3">
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
        </section>
        <section className="flex items-center justify-center w-full">
          <Button variant="shadow" color="secondary" type="submit">
            Save changes
          </Button>
        </section>
      </form>
    </div>
  );
};

export default function GeneralPetInformationTab({
  petData,
  adminMode,
}: {
  petData: IPet;
  adminMode?: boolean;
}) {
  const [petDataTracker, setPetDataTracker] = useState(petData);

  const [
    petGeneralDetailsEditModeActivated,
    setPetGeneralDetailsEditModeActivated,
  ] = useState(false);

  const dynamicTabContentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const generalDetails = [
    `Species: ${petData.species}`,
    `Gender: ${petData.gender}`,
    `Age: ${petData.age}`,
    `Color: ${petData.color}`,
    `Size: ${petData.size}`,
  ];

  const handleExitEditMode = () => {
    setPetGeneralDetailsEditModeActivated(false);
  };

  useEffect(() => {
    setPetDataTracker(petData);
  }, [petData]);

  return (
    <motion.div
      key="generalInformationTab"
      variants={dynamicTabContentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="relative flex w-full h-full"
    >
      {!petGeneralDetailsEditModeActivated ? (
        <div className="relative flex flex-col w-full gap-6">
          {adminMode && (
            <Button
              onClick={
                adminMode
                  ? () => setPetGeneralDetailsEditModeActivated(true)
                  : () => {
                      return;
                    }
              }
              isIconOnly
              size="sm"
              radius="sm"
              variant="shadow"
              color="secondary"
              aria-label="Next Image"
              className={`absolute z-20 p-2 text-white right-1 top-1`}
            >
              <Pencil1Icon />
            </Button>
          )}
          <header className="flex flex-col items-center justify-start w-full text-dark-3 dark:text-light-3">
            <h1 className="text-center text-heading1-bold">{petData.name}</h1>
          </header>
          <section className="flex flex-wrap items-center justify-center w-full gap-2">
            {generalDetails.map((trait, index) => (
              <Chip key={trait + index} color={getRandomColor()} variant="dot">
                {trait}
              </Chip>
            ))}
          </section>
          <section className="w-full text-body-medium text-dark-3 dark:text-light-3">
            <p>{petData.bio}</p>
          </section>
        </div>
      ) : (
        <PetGeneralDetailsEditionSection
          petData={petDataTracker}
          exitEditMode={handleExitEditMode}
        />
      )}
    </motion.div>
  );
}
