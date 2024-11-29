"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { initialLoadVariants } from "@/config/motion/hub";
import CustomChatContactSelector from "@/components/customUI/CustomChatContactSelector";
import { useSession } from "@clerk/nextjs";
import { useEffect, useMemo, useState } from "react";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUser } from "@/lib/hooks/user/useUser";
import { useConversations } from "@/lib/hooks/conversations/useConversations";
import { useConversationStore } from "@/store/shared/useConversation.store";
import { useManyUsers } from "@/lib/hooks/user/useManyUsers";
import { useSocketContext } from "@/context/socketContext";
import { useAllPets } from "@/lib/hooks/pet/useAllPets";

/**
 * InteractiveChatSection component
 *
 * This component displays the interactive chat section including chat contacts
 * and messages. It uses session data to fetch user-specific information and
 * displays the relevant conversations.
 *
 * @component
 * @returns {JSX.Element} The rendered component
 */
export default function InteractiveChatSection() {
  const { isLoaded: isUserSessionLoaded, session } = useSession();

  // Memoize email to avoid unnecessary re-renders
  const email = useMemo(
    () => session?.publicUserData.identifier ?? "",
    [session]
  );

  // Zustand store
  const userData = useUserStore((state) => state.user);
  const conversationsData = useConversationStore(
    (state) => state.conversations
  );

  // React query hooks
  const { isLoading: userDataLoading, isError: userDataError } = useUser({
    email,
  });
  const { data: allPets } = useAllPets();

  const [otherUserIds, setOtherUserIds] = useState<string[]>([]);
  const [
    filteredConversationsWithIntegrantsData,
    setFilteredConversationsWithIntegrantsData,
  ] = useState<any[]>([]);

  // Extract other members from conversation integrants
  useEffect(() => {
    if (Array.isArray(conversationsData) && userData) {
      const ids = conversationsData
        .map((conversation) =>
          conversation.integrants.filter(
            (integrant: string) => integrant !== userData._id
          )
        )
        .flat();
      setOtherUserIds(ids);
    }
  }, [conversationsData, userData]);

  // Fetch data for other members
  const { data: integrantsData, isLoading: fetchManyUsersLoading } =
    useManyUsers(otherUserIds);

  // Combine fetched user data with conversation messages
  useEffect(() => {
    if (integrantsData && conversationsData) {
      const combinedData = conversationsData.map((conversation) => {
        const otherIntegrants = conversation.integrants.filter(
          (integrant: string) => integrant !== userData?._id
        );
        const integrantDetails = integrantsData.filter((integrant: any) =>
          otherIntegrants.includes(integrant._id)
        );
        const petData = allPets?.find((pet) => pet._id === conversation.pet);
        return {
          ...conversation,
          integrantsData: integrantDetails,
          pet: petData, // Add pet data to the conversation
        };
      });
      setFilteredConversationsWithIntegrantsData(combinedData);
    }
  }, [integrantsData, conversationsData, userData]);

  useEffect(() => {
    console.log(
      "Filtered conversations",
      filteredConversationsWithIntegrantsData
    );
  }, [filteredConversationsWithIntegrantsData]);

  useEffect(() => {
    // console.log("Fetched conversations data => ", conversationsData);
  }, [conversationsData]);

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      variants={initialLoadVariants}
      className={cn(
        "relative flex w-screen h-screen flex-col items-center justify-start lg:py-24 py-10 px-4 overflow-y-auto overflow-hidden dark:bg-slate-950"
      )}
    >
      <div className="flex flex-row items-center justify-around max-w-[500px] overflow-hidden overflow-x-auto p-1">
        {userDataLoading || !isUserSessionLoaded ? (
          <p>Loading conversations...</p>
        ) : userDataError ? (
          <p>Error loading user data</p>
        ) : fetchManyUsersLoading ? (
          <p>Loading users...</p>
        ) : Array.isArray(filteredConversationsWithIntegrantsData) &&
          filteredConversationsWithIntegrantsData.length > 0 ? (
          <CustomChatContactSelector
            conversations={filteredConversationsWithIntegrantsData}
          />
        ) : (
          <div className="flex items-center justify-center w-full h-full p-4">
            <p className="text-center text-heading1-bold text-black/60 dark:text-white/60">
              No conversations available at the moment
            </p>
          </div>
        )}
      </div>
      {Array.isArray(filteredConversationsWithIntegrantsData) &&
        filteredConversationsWithIntegrantsData.length > 0 && (
          <>
            <div className="contentSeparator w-[80%]" />
            <div className="flex items-center justify-center w-full h-full">
              <p className="text-heading2-semibold">
                Select a user bubble above to begin chatting
              </p>
            </div>
          </>
        )}
    </motion.div>
  );
}
