"use client";

import React, { ReactElement, useMemo, useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
  Progress,
} from "@nextui-org/react";

import { motion } from "framer-motion";
import { IPet } from "@/lib/types/pet/interfaces.types";
import { useSession } from "@clerk/nextjs";
import { useDeletePet } from "@/lib/hooks/pet/useDeletePet";
import { deleteMultipleFilesFromStorage } from "@/lib/actions/uploadCare.action";
import { useQueryClient } from "react-query";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";

interface PetInformationModalProps {
  ModalTrigger: ReactElement;
  petData: IPet;
  trackedPetList: IPet[];
}

export default function PetDeletionConfirmationModal({
  ModalTrigger,
  petData,
  trackedPetList,
}: PetInformationModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isDeleting, setIsDeleting] = useState(false);
  const [deletionSuccess, setDeletionSuccess] = useState(false);

  const queryClient = useQueryClient();
  // Zustand stores

  const userData = useUserStore((state) => state.user);

  const {
    mutate: updateUserProfile,
    isLoading: isUserProfileUpdateLoading,
    isError: isUserProfileUpdateError,
  } = useUpdateUserProfile();

  const {
    mutate: deletePet,
    isLoading: isDeletePetLoading,
    isError: isDeletePetError,
  } = useDeletePet();

  const handlePetDeletion = async () => {
    if (!userData || !petData) return;

    setIsDeleting(true);

    deletePet(
      {
        petId: petData._id?.toString() ?? "",
        userId: userData?._id?.toString() ?? "",
      }, // Ensure IDs are strings
      {
        onSuccess: async () => {
          const updatedPets = trackedPetList.filter(
            (pet) => pet._id?.toString() !== petData._id?.toString()
          );

          try {
            await deleteMultipleFilesFromStorage(
              petData.media.map((media) => media.fileUploadCareId)
            );

            updateUserProfile(
              {
                userId: userData._id?.toString(),
                profileId: userData.currentProfile,
                data: {
                  associatedPets: updatedPets.map((pet) => pet._id?.toString()),
                },
              },
              {
                onSuccess: () => {
                  setIsDeleting(false);
                  setDeletionSuccess(true);
                  queryClient.refetchQueries("petData");
                  // queryClient.refetchQueries("userData");
                  // queryClient.refetchQueries("userProfile");
                },
              }
            );
          } catch (error) {
            console.error("Error deleting pet media:", error);
            setIsDeleting(false);
          }
        },
      }
    );
  };

  return (
    <>
      {React.cloneElement(ModalTrigger, { onClick: onOpen })}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        backdrop="blur"
        size="5xl"
        hideCloseButton
        placement="center"
        className="overflow-x-hidden overflow-y-auto h-fit w-fit max-w-[80%] lg:overflow-hidden dark:bg-glass-3-dark bg-glass-3"
      >
        <ModalContent>
          {(onClose) => (
            <>
              {!isDeleting && !deletionSuccess && (
                <ModalHeader className="flex flex-row items-center justify-between gap-1 text-light-3">
                  <h2 className="text-body-medium text-dark-3 dark:text-light-2">
                    Are you sure you would like to delete this pet? This action
                    cannot be undone.
                  </h2>
                </ModalHeader>
              )}
              <ModalBody className="p-4">
                {isDeleting ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-body-medium">Deleting pet...</p>
                    <Progress value={100} size="sm" color="danger" />
                  </div>
                ) : deletionSuccess ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <p className="text-body-medium">
                      Pet deletion was successful.
                    </p>
                    <Button color="success" onPress={onClose} size="lg">
                      Close
                    </Button>
                  </div>
                ) : (
                  <motion.div
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="flex flex-row items-center justify-center w-full gap-4"
                  >
                    <Button
                      color="danger"
                      variant="light"
                      onPress={handlePetDeletion}
                      size="lg"
                      isLoading={
                        isDeletePetLoading || isUserProfileUpdateLoading
                      }
                    >
                      Delete
                    </Button>
                    <Button
                      color="success"
                      variant="shadow"
                      onPress={onClose}
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                )}
                {isDeletePetError && (
                  <p className="text-danger text-body-medium">
                    Error deleting pet
                  </p>
                )}
                {isUserProfileUpdateError && (
                  <p className="text-danger text-body-medium">
                    Error updating user profile
                  </p>
                )}
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
