"use client";

import React, { useEffect, useState } from "react";
import { IAdopterProfile, IUser } from "@/lib/types/user/interfaces.types";
import { ReactElement } from "react";
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Chip,
  Divider,
  Image,
  Modal,
  ModalBody,
  ModalContent,
  ModalHeader,
  useDisclosure,
  Spinner,
} from "@nextui-org/react";
import { motion } from "framer-motion";
import { useUserProfile } from "@/lib/hooks/profile/useUserProfile";
import { IPet } from "@/lib/types/pet/interfaces.types";
import { useCreateMatch } from "@/lib/hooks/match/useCreateMatch";
import { useUserStore } from "@/store/shared/useUser.store";
import { IMatch } from "@/lib/types/match/interfaces";
import { useCreateConversation } from "@/lib/hooks/conversations/useCreateConversation";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { useDeleteMatch } from "@/lib/hooks/match/useDeleteMatch";
import { useDeleteConversation } from "@/lib/hooks/conversations/useDeleteConversation";
import { useMatchStore } from "@/store/shared/useMatchStore";
import { useConversationStore } from "@/store/shared/useConversation.store";
import CustomNotificationToast from "../customUI/CustomNotificationToast";

interface UserInformationModalProps {
  ModalTrigger: ReactElement;
  adminMode?: boolean;
  userData: IUser;
  petData: IPet;
}

const availableColors: Array<
  "primary" | "secondary" | "success" | "warning" | "danger"
> = ["primary", "secondary", "success", "warning", "danger"];

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

const CustomUserPersonalDetailsCard = ({
  data,
  onMatchCallback,
  isLoading,
  isUserMatched,
}: {
  data: IUser;
  onMatchCallback: () => void;
  isLoading: boolean;
  isUserMatched: boolean;
}) => {
  return (
    <Card className="w-full min-h-[500px] p-4 bg-opacity-50 lg:w-fit">
      <CardHeader className="flex items-center justify-center">
        <Image
          src={data.profilePicture}
          width={200}
          height={200}
          className="object-cover"
        />
      </CardHeader>
      <CardBody className="flex flex-col w-full h-full gap-4">
        <h1 className="text-center text-heading2-semibold">
          {data.firstName} {data.lastName}
        </h1>

        <Divider />

        <div className="flex flex-col gap-6">
          <span>
            <p className="text-body1-bold">Email</p>
            <p>{data.email}</p>
          </span>
          <span>
            <p className="text-body1-bold">Location</p>

            <p>{data.location}</p>
          </span>
          <span>
            <p className="text-body1-bold">Bio</p>

            <p>{data.bio}</p>
          </span>
        </div>

        <Button
          variant="shadow"
          color="success"
          className="mb-4 lg:mt-auto"
          onClick={onMatchCallback}
          isLoading={isLoading}
          endContent={
            <Image
              src={
                isUserMatched
                  ? "https://em-content.zobj.net/source/microsoft-teams/363/thumbs-down_1f44e.png"
                  : "https://em-content.zobj.net/source/microsoft-teams/363/heart-hands_1faf6.png"
              }
              width={32}
              height={32}
              className="object-cover"
            />
          }
        >
          {isUserMatched ? "Unmatch" : "Like & match"}
        </Button>
      </CardBody>
    </Card>
  );
};

const CustomUserAdoptionPreferencesCard = ({
  userProfile,
}: {
  userProfile: IAdopterProfile;
}) => {
  const preferenceMapping = [
    {
      label: "Species",
      value: [userProfile.profileData.preferredAnimalSpecies],
    },
    { label: "Gender", value: [userProfile.profileData.preferredAnimalGender] },
    { label: "Age", value: userProfile.profileData.preferredAnimalAge },
    { label: "Color", value: [userProfile.profileData.preferredAnimalColor] },
    { label: "Size", value: userProfile.profileData.preferredAnimalSize },
    {
      label: "Personality",
      value: userProfile.profileData.preferredAnimalPersonality,
    },
    {
      label: "Health Characteristics",
      value: userProfile.profileData.preferredAnimalHealthCharacteristic,
    },
    {
      label: "Training Level",
      value: userProfile.profileData.preferredAnimalTrainingLevel,
    },
  ];

  return (
    <Card className="w-full p-4 bg-opacity-50 lg:max-w-[500px] lg:w-fit">
      <CardHeader>
        <h3 className="text-body1-bold">Adoption Preferences</h3>
      </CardHeader>
      <div className="flex flex-row flex-wrap gap-6 p-4">
        {preferenceMapping.map((preference, index) => (
          <div
            key={preference.label + index}
            className="flex flex-col gap-4 bg-black/40 text-white backdrop-blur-lg rounded-[10px] p-4 items-center justify-center text-center"
          >
            <h4>{preference.label}</h4>
            {Array.isArray(preference.value) ? (
              preference.value.map((trait, traitIndex) => (
                <Chip
                  key={trait + traitIndex}
                  color={getRandomColor()}
                  variant="dot"
                  className="text-white"
                >
                  {trait}
                </Chip>
              ))
            ) : (
              <Chip
                color={getRandomColor()}
                variant="dot"
                className="text-white"
              >
                {preference.value}
              </Chip>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

const CustomUserCompatibilityPreferencesCard = ({ data }: { data: any }) => {
  return (
    <Card className="w-full p-4 bg-opacity-50 lg:max-w-[500px] lg:w-fit">
      <CardHeader>
        <h3 className="text-body1-bold">Compatibility details</h3>
      </CardHeader>
    </Card>
  );
};

export default function UserInformationModal({
  ModalTrigger,
  userData,
  petData,
}: UserInformationModalProps) {
  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const [isLoading, setIsLoading] = useState(false);
  const [isUserMatched, setIsUserMatched] = useState(false);

  const { data: adopterProfileData, isLoading: adopterProfileDataLoading } =
    useUserProfile(userData.currentProfile ?? "");

  const { mutate: createMatch } = useCreateMatch();
  const { mutate: deleteMatch } = useDeleteMatch();
  const { mutate: createConversation } = useCreateConversation();
  const { mutate: deleteConversation } = useDeleteConversation();
  const { mutate: updateUserProfile } = useUpdateUserProfile();

  const { user } = useUserStore();
  const { profile } = useUserProfileStore();
  const { matches } = useMatchStore();
  const { conversations } = useConversationStore();

  // const isUserMatched = matches.some(
  //   (match: IMatch) => match.adopter === userData._id
  // );

  useEffect(() => {
    const matched = matches.some(
      (match: IMatch) => match.adopter === userData._id
    );
    setIsUserMatched(matched);
  }, [matches, userData._id]);

  const handleMatchCreation = () => {
    setIsLoading(true);
    const matchData = {
      adopter: userData._id ?? "",
      petHolder: user?._id ?? "",
      pet: petData._id ?? "",
      status: "ongoing",
      createdAt: new Date(),
    };

    createMatch(matchData, {
      onSuccess: () => {
        createConversation(
          {
            integrants: [userData._id ?? "", user?._id ?? ""],
            pet: petData._id ?? "",
          },

          {
            onSuccess: (conversation) => {
              updateUserProfile({
                userId: userData?._id ?? "",
                profileId: userData?.currentProfile,
                data: {
                  conversations:
                    adopterProfileData.conversations &&
                    adopterProfileData.conversations.length > 0
                      ? [...adopterProfileData.conversations, conversation._id]
                      : [conversation._id],
                },
              });
              updateUserProfile({
                userId: user?._id ?? "",
                profileId: profile?._id,
                data: {
                  conversations:
                    profile.conversations && profile.conversations.length > 0
                      ? [...profile.conversations, conversation._id]
                      : [conversation._id],
                },
              });
            },
            onError: () => {
              setIsLoading(false);
            },
          }
        );
      },
      onSettled() {
        CustomNotificationToast({
          title: "Match created successfully",
          description:
            "The user chat has been created. Check your messages section!",
        });
        setIsLoading(false);
      },
      onError: () => {
        setIsLoading(false);
      },
    });
  };

  const handleMatchDeletion = () => {
    setIsLoading(true);

    const matchToDelete = matches.find(
      (match: IMatch) => match.adopter === userData._id
    );

    if (matchToDelete) {
      deleteMatch(matchToDelete?._id ?? "", {
        onSuccess: () => {
          const conversationsToDelete = conversations.filter((conversation) =>
            conversation.integrants.includes(userData._id)
          );

          conversationsToDelete.forEach((conversation) => {
            deleteConversation(
              { conversationId: conversation._id },
              {
                onSuccess: () => {
                  updateUserProfile({
                    userId: userData?._id ?? "",
                    profileId: userData?.currentProfile,
                    data: {
                      conversations: adopterProfileData.conversations.filter(
                        (conversationId: string) =>
                          conversationId !== conversation._id
                      ),
                    },
                  });
                  updateUserProfile({
                    userId: user?._id ?? "",
                    profileId: profile?._id,
                    data: {
                      conversations: profile.conversations.filter(
                        (conversationId: string) =>
                          conversationId !== conversation._id
                      ),
                    },
                  });
                },
                onError: () => {
                  setIsLoading(false);
                },
                onSettled: () => {
                  CustomNotificationToast({
                    title: "Match deleted successfully",
                    description:
                      "All conversations with the user have been dismissed.",
                  });
                },
              }
            );
          });
          setIsLoading(false);
        },
        onError: () => {
          setIsLoading(false);
        },
      });
    } else {
      setIsLoading(false);
    }
  };

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
        className="lg:w-[80%] lg:h-[80%] h-[90%] w-[90%] overflow-x-hidden overflow-y-auto lg:overflow-hidden dark:bg-glass-3-dark bg-glass-3"
      >
        <ModalContent className="w-full h-full p-6">
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-row items-center justify-between gap-1 text-light-3">
                <h2 className="text-heading2-semibold text-dark-3 dark:text-light-2">
                  {userData.firstName}'s profile
                </h2>
                <Button color="danger" variant="light" onPress={onClose}>
                  Close
                </Button>
              </ModalHeader>
              <ModalBody>
                <motion.div
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0, opacity: 0 }}
                  className="flex flex-col items-start justify-around w-full h-full gap-6 lg:flex-row text-light-3"
                >
                  <CustomUserPersonalDetailsCard
                    data={userData}
                    onMatchCallback={
                      isUserMatched ? handleMatchDeletion : handleMatchCreation
                    }
                    isLoading={isLoading}
                    isUserMatched={isUserMatched}
                  />
                  <div className="flex flex-col items-center justify-center gap-6">
                    {adopterProfileDataLoading ? (
                      <Spinner size="lg" />
                    ) : (
                      <>
                        <CustomUserAdoptionPreferencesCard
                          userProfile={adopterProfileData}
                        />
                        <CustomUserCompatibilityPreferencesCard
                          data={userData}
                        />
                      </>
                    )}
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
