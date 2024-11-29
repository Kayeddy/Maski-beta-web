import React from "react";
import { Tabs, Tab } from "@nextui-org/react";
import GeneralPetInformationTab from "../tabs/hub/shared/adopt/GeneralPetInformationTab";
import PetHealthDetailsTab from "../tabs/hub/shared/adopt/PetHealthDetailsTab";
import PetAdditionalDetailsTab from "../tabs/hub/shared/adopt/PetAdditionalDetailsTab";
import { IPet } from "@/lib/types/pet/interfaces.types";

export default function CustomPetProfileTabSelector({
  petData,
  adminMode,
}: {
  petData: IPet;
  adminMode?: boolean;
}) {
  return (
    <div className="flex flex-col w-full">
      <Tabs
        aria-label="Options"
        size="lg"
        fullWidth
        variant="underlined"
        className="transition-all duration-200 ease-in-out"
        classNames={{
          tabList:
            "gap-6 w-full relative rounded-none p-0 border-b border-divider transition-all duration-500 ease-in-out text-dark-3 dark:text-light-3",
          cursor: "bg-[#22d3ee] transition-all duration-500 ease-in-out",
        }}
        motionProps={{
          variants: {
            enter: {
              opacity: 1,
              x: 0,
            },
            animate: {
              opacity: 0,
              x: 0,
              transition: { type: "linear", duration: 1 },
            },
            exit: {
              opacity: 0,
              x: 0,
              transition: { type: "linear", duration: 1 },
            },
          },
        }}
      >
        <Tab key="general-information" title="General information">
          <GeneralPetInformationTab petData={petData} adminMode={adminMode} />
        </Tab>
        <Tab key="health-details" title="Health details">
          <PetHealthDetailsTab petData={petData} adminMode={adminMode} />
        </Tab>
        <Tab key="additional-details" title="Additional details">
          <PetAdditionalDetailsTab petData={petData} adminMode={adminMode} />
        </Tab>
      </Tabs>
    </div>
  );
}
