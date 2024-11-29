"use client";
import { Chip } from "@nextui-org/react";
import { LuHeartHandshake } from "react-icons/lu";
import DonationInformationModal from "../modals/DonationInformationModal";

export default function CustomDonationBanner() {
  return (
    <div className="fixed z-50 overflow-hidden bg-transparent cursor-pointer opacity-60 top-4 right-8 lg:opacity-100 w-fit">
      <DonationInformationModal
        ModalTrigger={
          <Chip
            endContent={<LuHeartHandshake size={18} />}
            variant="shadow"
            color="secondary"
          >
            Support Maski
          </Chip>
        }
      />
    </div>
  );
}
