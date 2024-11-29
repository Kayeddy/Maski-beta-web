"use client";
import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
  Textarea,
  Button,
  Image,
  Divider,
} from "@nextui-org/react";
import { BsArrowRightCircle } from "react-icons/bs";
import { useSession } from "@clerk/nextjs";
import { useSocketContext } from "@/context/socketContext";
import { useConversationStore } from "@/store/shared/useConversation.store";
import { useMessages } from "@/lib/hooks/messages/useMessages";
import { useCreateMessage } from "@/lib/hooks/messages/useCreateMessage";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { IUser } from "@/lib/types/user/interfaces.types";
import { usePetStore } from "@/store/shared/usePet.store";
import { IPet } from "@/lib/types/pet/interfaces.types";
import { useMatches } from "@/lib/hooks/match/useMatches";
import { useMatchStore } from "@/store/shared/useMatchStore";
import { useUpdateMatch } from "@/lib/hooks/match/useUpdateMatch";
import { useUpdatePet } from "@/lib/hooks/pet/useUpdatePet";
import { useUpdateUserProfile } from "@/lib/hooks/profile/useUpdateUserProfile";
import { useUserProfile } from "@/lib/hooks/profile/useUserProfile";
import AdoptionCompletionConfirmationModal from "../modals/AdoptionCompletionConfirmationModal";
import CustomNotificationToast from "./CustomNotificationToast";

/**
 * CustomChatMessagesRevealer component
 *
 * This component reveals chat messages and allows sending new messages within a popover.
 *
 * @component
 * @param {Object} props - Component props
 * @param {any} props.triggerElement - The element that triggers the popover
 * @param {string} props.conversationId - The ID of the conversation
 * @param {IUser} props.recipient - The recipient user data
 * @param {IPet} [props.pet] - The pet data
 * @returns {JSX.Element} The rendered component
 */
export default function CustomChatMessagesRevealer({
  triggerElement,
  conversationId,
  recipient,
  pet,
}: {
  triggerElement: any;
  conversationId: string;
  recipient: IUser;
  pet: IPet | undefined;
}): JSX.Element {
  const [messageBody, setMessageBody] = useState("");
  const [loading, setLoading] = useState(false);
  const [unreadMessages, setUnreadMessages] = useState(0);
  const [isConversationOpen, setIsConversationOpen] = useState(false);
  const [keyboardOpen, setKeyboardOpen] = useState(false);
  const [adoptionCompletionLoading, setAdoptionCompletionLoading] =
    useState(false);
  const [adoptionResponse, setAdoptionResponse] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Zustand stores
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);
  const matches = useMatchStore((state) => state.matches);
  const { pets } = usePetStore();

  const { isLoaded: isUserSessionLoaded, session } = useSession();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);

  // React Query hooks
  const { data: recipientProfileData, isLoading: recipientProfileDataLoading } =
    useUserProfile(recipient.currentProfile ?? "", false);

  const {
    data: messages,
    refetch: refetchMessages,
    isLoading: messagesLoading,
    isError: messagesError,
  } = useMessages(conversationId);
  const createMessageMutation = useCreateMessage();

  const updateMatchMutation = useUpdateMatch();
  const updatePetMutation = useUpdatePet();
  const updateUserProfileMutation = useUpdateUserProfile();

  // Socket context
  const { socket } = useSocketContext();

  /**
   * Scroll to the bottom of the messages container
   * @param {("smooth" | "auto")} [scrollType="smooth"] - The type of scrolling behavior
   */
  const scrollToBottom = (scrollType: "smooth" | "auto" = "smooth") => {
    messagesEndRef.current?.scrollIntoView({ behavior: scrollType });
    setUnreadMessages(0);
  };

  /**
   * Handle scroll event to track unread messages
   */
  const handleScroll = () => {
    if (messagesContainerRef.current) {
      const { scrollTop, clientHeight, scrollHeight } =
        messagesContainerRef.current;
      if (scrollHeight - scrollTop === clientHeight) {
        setUnreadMessages(0);
      }
    }
  };

  /**
   * Handle sending a new message
   */
  const handleSendMessage = async () => {
    setLoading(true);
    try {
      const sessionToken = await session?.getToken();
      if (sessionToken && conversationId) {
        const newMessage = {
          messageBody,
          messageMedia: "",
          sender: userData?._id ?? "",
          recipient: recipient._id ?? "",
          conversationId,
        };

        createMessageMutation.mutate(newMessage, {
          onSuccess: () => {
            refetchMessages();
            setMessageBody("");
            setLoading(false);
            scrollToBottom("smooth");
          },
          onError: () => {
            setLoading(false);
          },
        });
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setLoading(false);
    }
  };

  /**
   * Handle key down event to send message on Enter key
   * @param {React.KeyboardEvent} event - The keyboard event
   */
  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (messageBody) {
        handleSendMessage();
      }
    }
  };

  // Function to handle focus event
  const handleFocus = () => {
    setKeyboardOpen(true);
  };

  // Function to handle blur event
  const handleBlur = () => {
    setKeyboardOpen(false);
  };

  const handleAdoptionCompletion = async () => {
    setAdoptionCompletionLoading(true);
    setAdoptionResponse(""); // Reset response before starting

    try {
      const matchData = matches.find((match) => match.pet === pet?._id);

      if (!matchData) {
        setAdoptionCompletionLoading(false);
        setAdoptionResponse("No match found for the pet.");
        return;
      }

      // Update the match status to "completed"
      await updateMatchMutation.mutateAsync({
        matchId: matchData._id ?? "",
        data: { status: "completed" },
      });

      // Determine adopter profile and user IDs
      const adopterProfileId =
        userProfileData.type === "adopter"
          ? userData?.currentProfile
          : recipientProfileData?._id;
      const adopterUserId =
        userProfileData.type === "adopter" ? userData?._id : recipient?._id;

      if (!adopterProfileId || !adopterUserId) {
        throw new Error("Adopter profile or user ID is missing");
      }

      // Update the user profile (adopter) adoption history list to include the adopted pet's id
      const newAdoptionHistory = [
        ...(userProfileData.adoptionHistory || []),
        pet?._id,
      ];

      await updateUserProfileMutation.mutateAsync({
        userId: adopterUserId,
        profileId: adopterProfileId,
        data: { adoptionHistory: newAdoptionHistory },
      });

      // Update the pet adoption status to "Complete"
      await updatePetMutation.mutateAsync({
        petId: pet?._id ?? "",
        data: { adoptionStatus: "Complete" },
      });

      setAdoptionCompletionLoading(false);
      setAdoptionResponse("Adoption completed successfully!");
      CustomNotificationToast({
        title: "Adoption completed successfully",
        description:
          "You can keep conversing with the adopter whenever you like!",
      });
    } catch (error) {
      setAdoptionCompletionLoading(false);
      CustomNotificationToast({
        title: "Adoption completion failed",
        description: `Someething went wrong while completing the adoption, error details: ${error}`,
      });
      setAdoptionResponse("Error completing adoption process.");
      console.error("Adoption completion error:", error);
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("newMessage", (newMessage: any) => {
        console.log("New message received", newMessage);
        refetchMessages();
        scrollToBottom("smooth");
      });

      return () => {
        socket.off("newMessage");
      };
    }
  }, [socket, conversationId, refetchMessages]);

  useEffect(() => {
    if (!recipientProfileDataLoading) {
      console.log("recipient profile Data => ", recipientProfileData);
      console.log("My profile data => ", userProfileData);
    }
  }, [recipientProfileData]);

  useLayoutEffect(() => {
    if (isConversationOpen) {
      scrollToBottom("auto");
    }
  }, [isConversationOpen, messages]);

  return (
    <>
      <Popover
        placement="bottom"
        size="lg"
        offset={20}
        shouldCloseOnBlur
        shouldBlockScroll
        isOpen={isConversationOpen}
        onOpenChange={(open) => {
          setIsConversationOpen(open);
        }}
      >
        <PopoverTrigger className="cursor-pointer">
          {triggerElement}
        </PopoverTrigger>
        <PopoverContent
          className={`lg:h-[70vh] ${
            keyboardOpen ? "h-[55vh]" : "h-[70vh]"
          } w-[90vw] lg:w-[70vw] overflow-hidden`}
        >
          <div className="flex flex-col items-start justify-start w-full gap-4 py-4 lg:flex-row lg:items-start lg:justify-between">
            <div className="flex flex-col justify-center w-full gap-2">
              <span className="flex items-center justify-between w-full lg:text-heading3-bold text-body-semibold">
                {`${recipient.firstName} ${recipient.lastName}`}
                <Button
                  color="secondary"
                  variant="shadow"
                  size="sm"
                  className="flex lg:hidden"
                  onClick={() => {
                    setIsConversationOpen(false);
                    setIsModalOpen(true);
                  }} // Open modal
                >
                  Complete adoption
                </Button>
              </span>
              <span className="max-w-lg lg:text-heading4-medium text-body-normal">
                {`Ongoing adoption for ${pet?.name}`}
              </span>
              <span className="flex-row hidden gap-3 lg:flex carousel">
                {pet?.media.map((mediaFile) => (
                  <Image
                    key={mediaFile.fileUploadCareId}
                    className="object-cover w-[100px] h-[50px] carousel-item"
                    src={mediaFile.fileUrl}
                  />
                ))}
              </span>
            </div>

            {/* <AdoptionCompletionConfirmationModal
              ModalTrigger={
               
              }
              petName={pet?.name ?? ""}
              adoptionResponse={adoptionResponse}
              onOpenCallback={() => {
                setIsConversationOpen(false);
                setIsModalOpen(true);
              }} // Close popover before opening modal
              onConfirmCallback={handleAdoptionCompletion}
              onCancelCallback={() => {
                setIsConversationOpen(true); // Reopen popover if cancel
              }}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            /> */}

            <Button
              color="secondary"
              variant="shadow"
              className="hidden lg:flex"
              onClick={handleAdoptionCompletion}
              isLoading={adoptionCompletionLoading}
            >
              Complete adoption
            </Button>
          </div>
          <Divider className="my-3" />
          <div className="flex flex-col justify-between w-full h-full p-2 overflow-hidden">
            <div
              className="relative flex flex-col w-full p-4 overflow-y-auto h-max"
              ref={messagesContainerRef}
              onScroll={handleScroll}
            >
              {messagesLoading || !isUserSessionLoaded ? (
                <p>Loading messages...</p>
              ) : messagesError ? (
                <p className="w-full text-center">Error loading messages</p>
              ) : messages?.length ? (
                messages.map((message, index) => (
                  <div
                    key={index}
                    className={`flex w-full py-4 ${
                      message.sender === userData?._id
                        ? "justify-end"
                        : "justify-start"
                    }`}
                  >
                    <div
                      className={`p-3 rounded-[20px] max-w-xs ${
                        message.sender === userData?._id
                          ? " bg-blue text-white self-end rounded-tr-none"
                          : "bg-gray-300 text-black self-start rounded-tl-none"
                      }`}
                    >
                      <p className="font-bold">
                        {message.sender === userData?._id
                          ? "You"
                          : recipient.firstName}
                      </p>
                      <p className="text-[1rem]">{message.messageBody}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="w-full text-center">No messages to show.</p>
              )}
              <div ref={messagesEndRef} />
            </div>
            {unreadMessages > 0 && (
              <div
                className="absolute p-2 text-white bg-red-500 rounded-full bg-opacity-10 bottom-32 left-2"
                onClick={() => scrollToBottom("smooth")}
              >
                You have unread messages
              </div>
            )}
            <div className="flex flex-row items-center justify-center w-[98%] dark:bg-[#18181B] rounded-b-[20px]">
              <Textarea
                type="text"
                size="lg"
                placeholder="Your message..."
                className="w-full h-[100px] p-3"
                maxRows={3}
                value={messageBody}
                onChange={(e) => setMessageBody(e.target.value)}
                onKeyDown={handleKeyDown}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />
              <Button
                className="px-0 mx-0 w-fit"
                onClick={handleSendMessage}
                variant="light"
                disabled={loading}
                isLoading={loading}
              >
                <BsArrowRightCircle className="text-[20px]" />
              </Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </>
  );
}
