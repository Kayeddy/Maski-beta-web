"use client";
import {
  Button,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
} from "@nextui-org/react";
import React, { ReactElement } from "react";
import { motion } from "framer-motion";

export default function DonationInformationModal({
  ModalTrigger,
}: {
  ModalTrigger: ReactElement;
}) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();

  return (
    <>
      {React.cloneElement(ModalTrigger, { onClick: onOpen })}
      <Modal
        isOpen={isOpen}
        onOpenChange={onOpenChange}
        scrollBehavior="inside"
        backdrop="blur"
        size="5xl"
        hideCloseButton
        placement="center"
        className="overflow-x-hidden overflow-y-auto lg:overflow-hidden dark:bg-glass-3-dark bg-glass-3 lg:max-w-[50%] max-w-[90%] lg:max-h-[700px] h-[90vh]"
      >
        <ModalContent className="w-full h-full p-6">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row items-center justify-between gap-1 text-light-3">
                <h2 className="text-heading2-semibold text-dark-3 dark:text-light-2">
                  Donation Information
                </h2>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalHeader>
              <ModalBody className="custom-scrollbar">
                <motion.div
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex flex-col gap-4 dark:text-light-3 text-dark-3"
                >
                  <p className="text-heading4-medium">
                    {" "}
                    Hey there, fellow pet enthusiast! 🌟
                  </p>
                  <p className="text-heading4-medium">
                    {" "}
                    Thinking about donating to our cause? Your generosity would
                    make a world of difference! With your help, a furry friend
                    could be snuggled up in a loving home in just a few days.
                  </p>
                  <p className="text-heading4-medium">
                    {" "}
                    Each penny you contribute brings us closer to saving another
                    pet, improving their lives, and making the world a kinder
                    place.
                  </p>
                  <p className="text-heading4-medium">
                    We’re thrilled that you’re considering supporting us. Here
                    are some ways you can donate:
                  </p>
                  <div className="flex flex-col gap-4 text-light-2">
                    <li className="flex flex-wrap flex-row gap-4 bg-black/60 p-4 rounded-[10px] w-full items-center justify-between">
                      <div>
                        <span className="flex flex-col">
                          <p className="text-heading3-bold">Nubank</p>
                        </span>
                        <span>
                          <p>Savings account number: 46131788</p>
                          <p>Account plate number: JAO801</p>
                        </span>
                      </div>
                      <Image
                        src="https://logowik.com/content/uploads/images/nubank-new-20211454.jpg"
                        width={100}
                        height={100}
                        className="object-cover w-[200px] h-[100px]"
                      />
                    </li>
                    <li className="flex flex-row gap-4 bg-black/60 p-4 rounded-[10px] w-full items-center justify-between flex-wrap">
                      <div>
                        <span className="flex flex-col">
                          <p className="text-heading3-bold">PayPal</p>
                        </span>
                        <span>
                          <p>Account email: juanjoaranzales@gmail.com</p>
                        </span>
                      </div>
                      <Image
                        src="https://sedberkdesign.com/wp-content/uploads/2020/06/kisspng-paypal-logo-brand-font-payment-paypal-logo-icon-paypal-icon-logo-png-and-vecto-5b7f273e45e8a9.9067728615350597742864.png"
                        width={100}
                        height={100}
                        className="object-cover w-[200px] h-[100px] bg-white"
                      />
                    </li>
                    <li className="flex flex-row gap-4 bg-black/60 p-4 rounded-[10px] w-full items-center justify-between flex-wrap">
                      <div>
                        <span className="flex flex-col">
                          <p className="text-heading3-bold">Skrill</p>
                        </span>
                        <span>
                          <p>Account email: djeddyedward@gmail.com</p>
                        </span>
                      </div>
                      <Image
                        src="https://logowik.com/content/uploads/images/skrill9660.jpg"
                        width={100}
                        height={100}
                        className="object-cover w-[200px] h-[100px]"
                      />
                    </li>
                  </div>
                  <p className="mt-6 text-heading4-medium">
                    Thank you for your incredible support. Together, we can
                    create a better future for our beloved pets! 🐾❤️
                  </p>
                </motion.div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>
    </>
  );
}
