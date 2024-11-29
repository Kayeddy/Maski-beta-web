import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  Progress,
  useDisclosure,
} from "@nextui-org/react";
import React, { ReactElement, useEffect, useState } from "react";
import { motion } from "framer-motion";

export default function AdoptionCompletionConfirmationModal({
  ModalTrigger,
  onOpenCallback,
  onConfirmCallback,
  onCancelCallback,
  petName,
  adoptionResponse,
  isModalOpen,
  setIsModalOpen,
}: {
  ModalTrigger: ReactElement;
  onOpenCallback: () => void;
  onConfirmCallback: () => void;
  onCancelCallback: () => void;
  petName: string;
  adoptionResponse: string;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}) {
  const [isAdopting, setIsAdopting] = useState(false);
  const [adoptionSuccessful, setAdoptionSuccessful] = useState(false);
  const { isOpen, onOpen, onOpenChange, onClose } = useDisclosure();

  useEffect(() => {
    if (adoptionResponse) {
      setIsAdopting(false);
      setAdoptionSuccessful(adoptionResponse.includes("successfully"));
    }
  }, [adoptionResponse]);

  return (
    <>
      {React.cloneElement(ModalTrigger, {
        onClick: () => {
          onOpenCallback();
          setTimeout(() => {
            if (!isOpen) onOpen();
          }, 100);
        },
      })}
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
              {!isAdopting && !adoptionSuccessful && (
                <ModalHeader className="flex flex-row items-center justify-between gap-1 text-light-3">
                  <h2 className="text-body-medium text-dark-3 dark:text-light-2">
                    Are you sure you want to complete the adoption for {petName}
                    ?
                  </h2>
                </ModalHeader>
              )}
              <ModalBody className="p-4">
                {isAdopting ? (
                  <div className="flex flex-col items-center justify-center">
                    <p className="text-body-medium">Processing adoption...</p>
                    <Progress value={100} size="sm" color="primary" />
                  </div>
                ) : adoptionSuccessful ? (
                  <div className="flex flex-col items-center justify-center gap-4">
                    <p className="text-body-medium">
                      Hooray! {petName} has been adopted successfully.
                    </p>
                    <Button
                      color="success"
                      onPress={() => setIsModalOpen(false)}
                      size="lg"
                    >
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
                      color="primary"
                      variant="light"
                      onPress={() => {
                        setIsAdopting(true);
                        onConfirmCallback();
                      }}
                      size="lg"
                    >
                      Confirm Adoption
                    </Button>
                    <Button
                      color="danger"
                      variant="shadow"
                      onPress={() => {
                        onCancelCallback();
                        setIsModalOpen(false); // Close modal on cancel
                      }}
                      size="lg"
                    >
                      Cancel
                    </Button>
                  </motion.div>
                )}
                {adoptionResponse && (
                  <p className="text-primary text-body-medium">
                    {adoptionResponse}
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
