import { IPet } from "@/lib/types/pet/interfaces.types";
import { motion } from "framer-motion";
import { Button, Chip } from "@nextui-org/react";
import {
  LivingWithAnimalsCompatibility,
  LivingWithKidsCompatibility,
  Personality,
  TrainingLevel,
} from "@/lib/types/pet/enums.types";
import { useEffect, useState } from "react";
import { useQueryClient } from "react-query";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetAdditionalDetailsEditionValidations } from "@/lib/validations/hub/holder/dashboard/petUploadValidations";
import { ArrowLeftIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useUpdatePet } from "@/lib/hooks/pet/useUpdatePet";

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

const options = {
  personality: Personality,
  livingWithAnimalsCompatibility: LivingWithAnimalsCompatibility,
  livingWithKidsCompatibility: LivingWithKidsCompatibility,
  trainingLevel: TrainingLevel,
};

interface PetEditionFormInputs {
  personality: string[];
  livingWithAnimalsCompatibility: string;
  livingWithKidsCompatibility: string;
  trainingLevel: string;
}

type Category = keyof typeof options;

const categoryLabels: Record<Category, string> = {
  personality: "What are the personality traits of the pet?",
  livingWithAnimalsCompatibility:
    "Is the pet compatible with living with other animals?",
  livingWithKidsCompatibility: "Is the pet compatible with living with kids?",
  trainingLevel: "What is the training level of the pet?",
};

const PetAdditionalDetailsEditionSection = ({
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
    resolver: zodResolver(PetAdditionalDetailsEditionValidations),
    defaultValues: {
      personality: petData.personality || [],
      livingWithAnimalsCompatibility:
        petData.livingWithAnimalsCompatibility || "",
      livingWithKidsCompatibility: petData.livingWithKidsCompatibility || "",
      trainingLevel: petData.trainingLevel || "",
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
    <div className="relative flex flex-col w-full gap-6 overflow-x-hidden overflow-y-auto h-full max-h-[600px] p-6 pb-[200px]">
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

        <section className="flex items-center justify-center w-full">
          <Button variant="shadow" color="secondary" type="submit">
            Save changes
          </Button>
        </section>
      </form>
    </div>
  );
};

export default function PetAdditionalDetailsTab({
  petData,
  adminMode,
}: {
  petData: IPet;
  adminMode?: boolean;
}) {
  const [
    petAdditionalDetailsEditModeActivated,
    setPetAdditionalDetailsEditModeActivated,
  ] = useState(false);

  const dynamicTabContentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const additionalDetails = [
    `Living with Animals: ${petData.livingWithAnimalsCompatibility}`,
    `Living with Kids: ${petData.livingWithKidsCompatibility}`,
    `Personality: ${petData.personality.join(", ")}`,
    `Training Level: ${petData.trainingLevel}`,
  ];

  const handleExitEditMode = () => {
    setPetAdditionalDetailsEditModeActivated(false);
  };

  return (
    <motion.div
      key="additionalDetailsTab"
      variants={dynamicTabContentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="flex flex-col w-full gap-6"
    >
      {!petAdditionalDetailsEditModeActivated ? (
        <div className="relative flex flex-col w-full gap-6">
          {adminMode && (
            <Button
              onClick={
                adminMode
                  ? () => setPetAdditionalDetailsEditModeActivated(true)
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
            <h2 className="text-center text-heading1-bold">
              Additional Details
            </h2>
          </header>
          <section className="flex flex-wrap items-center justify-center w-full gap-2">
            {additionalDetails.map((detail, index) => (
              <Chip key={detail + index} color={getRandomColor()} variant="dot">
                {detail}
              </Chip>
            ))}
          </section>
        </div>
      ) : (
        <PetAdditionalDetailsEditionSection
          petData={petData}
          exitEditMode={handleExitEditMode}
        />
      )}
    </motion.div>
  );
}
