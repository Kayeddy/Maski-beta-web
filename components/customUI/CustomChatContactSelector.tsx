import React from "react";

import CustomChatMessagesRevealer from "./CustomChatMessagesRevealer";
import { IConversation } from "@/lib/types/hub/chat/interfaces.types";
import { Image } from "@nextui-org/react";
import { usePetStore } from "@/store/shared/usePet.store";
import { useAllPets } from "@/lib/hooks/pet/useAllPets";

/**
 * CustomChatContactSelector component to display chat contacts
 * @component
 * @param {Object} props - Component props
 * @param {IConversation[]} props.conversations - Array of conversations
 */
export default function CustomChatContactSelector({
  conversations,
}: {
  conversations: any[];
}) {
  if (!Array.isArray(conversations)) {
    return <p>No conversations available</p>;
  }

  return (
    <div className="flex flex-row">
      {conversations.map(
        (conversation) =>
          conversation.integrants.length > 0 && (
            <CustomChatMessagesRevealer
              key={conversation._id} // Use unique key prop
              triggerElement={
                <Image
                  height={50}
                  width={100}
                  src={
                    conversation.integrantsData[0].profilePicture ||
                    "https://em-content.zobj.net/source/microsoft-teams/363/person-raising-hand_1f64b.png"
                  }
                  alt={conversation.integrantsData[0].firstName}
                  className="object-cover !m-0 !p-0 object-top rounded-full h-14 w-14 border-2 group-hover:scale-105 group-hover:z-30 border-white relative transition duration-500"
                  loading="lazy"
                />
              }
              conversationId={conversation._id}
              recipient={conversation.integrantsData[0]}
              pet={conversation.pet}
            />
          )
      )}
    </div>
  );
}
