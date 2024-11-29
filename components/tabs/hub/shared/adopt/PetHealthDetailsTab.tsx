import { IPet } from "@/lib/types/pet/interfaces.types";
import { motion } from "framer-motion";
import { Button, Chip, Divider, Input, Textarea } from "@nextui-org/react";
import { ArrowLeftIcon, Pencil1Icon } from "@radix-ui/react-icons";
import { useEffect, useState } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { PetHealthDetailsEditionValidations } from "@/lib/validations/hub/holder/dashboard/petUploadValidations";
import { HealthCharacteristic } from "@/lib/types/pet/enums.types";
import { useQueryClient } from "react-query";
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

interface PetEditionFormInputs {
  health: string[];
}

const options = {
  health: HealthCharacteristic,
};

type Category = keyof typeof options;

const categoryLabels: Record<Category, string> = {
  health: "What are the health characteristic of the pet?",
};

const PetHealthDetailsEditionSection = ({
  petData,
  exitEditMode,
}: {
  petData: IPet;
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
    resolver: zodResolver(PetHealthDetailsEditionValidations),
    defaultValues: {
      health: petData.health || "",
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
        watchFields[key as keyof PetEditionFormInputs].length > 0 &&
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
                      name="health"
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

export default function PetHealthDetailsTab({
  petData,
  adminMode,
}: {
  petData: IPet;
  adminMode?: boolean;
}) {
  const [petDataTracker, setPetDataTracker] = useState(petData);

  const [
    petHealthDetailsEditModeActivated,
    setPetHealthDetailsEditModeActivated,
  ] = useState(false);

  const dynamicTabContentVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -20 },
  };

  const healthDetails = petData.health;

  const handleExitEditMode = () => {
    setPetHealthDetailsEditModeActivated(false);
  };

  useEffect(() => {
    setPetDataTracker(petData);
  }, [petData]);

  return (
    <motion.div
      key="healthDetailsTab"
      variants={dynamicTabContentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.5 }}
      className="flex flex-col w-full gap-6"
    >
      {!petHealthDetailsEditModeActivated ? (
        <div className="relative flex flex-col w-full gap-6">
          {adminMode && (
            <Button
              onClick={
                adminMode
                  ? () => setPetHealthDetailsEditModeActivated(true)
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
            <h2 className="text-center text-heading1-bold">Health Details</h2>
          </header>
          <section className="flex flex-wrap items-center justify-center w-full gap-2">
            {healthDetails.map((healthTrait, index) => (
              <Chip
                key={healthTrait + index}
                color={getRandomColor()}
                variant="dot"
              >
                {healthTrait}
              </Chip>
            ))}
          </section>
        </div>
      ) : (
        <PetHealthDetailsEditionSection
          petData={petDataTracker}
          exitEditMode={handleExitEditMode}
        />
      )}

      <section className="flex flex-row flex-wrap items-center justify-center w-full mt-10"></section>
    </motion.div>
  );
}
