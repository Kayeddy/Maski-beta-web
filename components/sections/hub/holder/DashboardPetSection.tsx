import React, { useEffect, useState } from "react";
import { Card, CardFooter, Image } from "@nextui-org/react";
import { IPet } from "@/lib/types/pet/interfaces.types";
import {
  EyeOpenIcon,
  HeartFilledIcon,
  HeartIcon,
  TrashIcon,
} from "@radix-ui/react-icons";
import PetInformationModal from "@/components/modals/PetInformationModal";
import PetDeletionConfirmationModal from "@/components/modals/PetDeletionConfirmationModal";

interface DashboardPetSectionProps {
  pets: IPet[];
}

/**
 * DashboardPetSection component - Displays a list of pet cards.
 *
 * @param {DashboardPetSectionProps} props - The properties of the component.
 * @returns {JSX.Element} The DashboardPetSection component.
 */
const DashboardPetSection: React.FC<DashboardPetSectionProps> = ({ pets }) => {
  const [petsTrackerList, setPetsListTracker] = useState<IPet[]>(pets);

  useEffect(() => {
    setPetsListTracker(pets);
  }, [pets]);

  return (
    <div className="flex flex-col items-start justify-start w-full">
      {petsTrackerList.length === 0 ? (
        <p className="text-center text-gray-500 text-body-medium">
          Add your first pet to see it here! :)
        </p>
      ) : (
        <div className="flex flex-wrap items-center justify-start gap-4 p-1">
          {petsTrackerList.map((pet, idx) => (
            <Card
              key={pet.name + idx.toLocaleString()}
              isFooterBlurred
              radius="md"
              className="flex flex-col items-center lg:items-start w-[200px] h-[200px]"
            >
              <Image
                width={200}
                height={200}
                src={pet.media[0]?.fileUrl}
                className="rounded-md"
              />
              <div className="absolute z-10 flex flex-row gap-2 text-black top-2 right-2">
                <span className="bg-white hover:cursor-pointer rounded-[10px] p-1">
                  <PetInformationModal
                    ModalTrigger={
                      <EyeOpenIcon className="w-5 h-5 text-primary-400" />
                    }
                    petData={pet}
                    adminMode
                  />
                </span>

                <span className="bg-white hover:cursor-pointer rounded-[10px] p-1">
                  <PetDeletionConfirmationModal
                    ModalTrigger={
                      <TrashIcon className="w-5 h-5 text-danger-400" />
                    }
                    trackedPetList={petsTrackerList}
                    petData={pet}
                  />
                </span>
              </div>

              <CardFooter className="absolute bottom-0 z-10 flex flex-col items-start justify-start gap-4 bg-black/40 border-t-1 border-default-600 dark:border-default-100 lg:flex-row">
                <div className="flex flex-col gap-2">
                  <p className="text-white text-medium">{pet.name}</p>
                  <span className="flex flex-row items-center justify-start gap-1 text-white hover:cursor-pointer">
                    {pet?.likes && pet.likes.length > 0 ? (
                      <HeartFilledIcon className="w-5 h-5" />
                    ) : (
                      <HeartIcon className="w-5 h-5 " />
                    )}
                    <p>{pet.likes ? pet.likes.length : 0}</p>
                  </span>
                </div>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DashboardPetSection;
