"use client";

import React, { useState, ReactElement } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  Button,
  useDisclosure,
} from "@nextui-org/react";
import PetProfileImageVisualizer from "../other/hub/PetProfileImageVisualizer";
import { motion } from "framer-motion";
import CustomPetProfileTabSelector from "../customUI/CustomPetProfileTabSelector";
import { IPet } from "@/lib/types/pet/interfaces.types";

interface PetInformationModalProps {
  ModalTrigger: ReactElement;
  adminMode?: boolean;
  petData: IPet;
}

/**
 * Displays the detailed information of a pet in a modal.
 *
 * @param {PetInformationModalProps} props - The properties for the modal component.
 * @returns {JSX.Element} The PetInformationModal component.
 */
export default function PetInformationModal({
  ModalTrigger,
  petData,
  adminMode,
}: PetInformationModalProps): JSX.Element {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

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
        className="lg:w-[80%] lg:h-[80%] h-[90%] w-[90%] overflow-x-hidden overflow-y-auto lg:overflow-hidden dark:bg-glass-3-dark bg-glass-3 z-[999]"
      >
        <ModalContent className="lg:pt-6">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row items-center justify-between gap-1 text-light-3">
                <h2 className="text-heading2-semibold text-dark-3 dark:text-light-2">
                  Pet profile
                </h2>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalHeader>
              <ModalBody>
                <motion.div
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex flex-col items-center justify-center w-full h-full pb-4 text-light-3"
                >
                  <div className="flex flex-col items-center justify-start w-full h-full gap-6 lg:justify-between lg:items-start lg:flex-row">
                    {/* Image display */}
                    <PetProfileImageVisualizer
                      petImagesArray={petData.media}
                      adminMode={adminMode}
                      petId={petData._id?.toString() ?? ""}
                    />
                    {/* Informative section */}
                    <div className="flex flex-col w-full gap-4">
                      <CustomPetProfileTabSelector
                        petData={petData}
                        adminMode={adminMode}
                      />
                    </div>
                  </div>
                </motion.div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
