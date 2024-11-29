"use client";

import React, { Key, useState, useMemo, useCallback } from "react";
import { Card, CardBody, Tabs, Tab, Spinner } from "@nextui-org/react";
import GeneralInfoDashboardTab from "@/components/tabs/hub/holder/dashboard/GeneralInfoDashboardTab";
import PetUploadDashboardTab from "@/components/tabs/hub/holder/dashboard/PetUploadDashboardTab";
import { useSession } from "@clerk/nextjs";
import { useUserStore } from "@/store/shared/useUser.store";
import { useUserProfileStore } from "@/store/shared/useUserProfile.store";
import { usePetStore } from "@/store/shared/usePet.store";
import { useUserProfile } from "@/lib/hooks/profile/useUserProfile";
import { usePetData } from "@/lib/hooks/pet/usePetData";
import OverviewDashboardTab from "./OverviewDashboardTab";
import { useMatchStore } from "@/store/shared/useMatchStore";

/**
 * InteractiveDashboardSection component - A dashboard section with tabs to display general info and pet upload forms.
 *
 * @returns {JSX.Element} The InteractiveDashboardSection component.
 */
export default function InteractiveDashboardSection(): JSX.Element {
  const [activeTab, setActiveTab] = useState<string>("general");

  const { session } = useSession();

  // Zustand store
  const userData = useUserStore((state) => state.user);
  const userProfileData = useUserProfileStore((state) => state.profile);
  const petsData = usePetStore((state) => state.pets);
  const matchData = useMatchStore((state) => state.matches);

  // Calculate completed and ongoing adoptions
  const completedAdoptions =
    matchData &&
    matchData.length &&
    matchData.filter((match) => match.status === "completed").length;
  const ongoingAdoptions =
    matchData &&
    matchData.length &&
    matchData.filter((match) => match.status === "ongoing").length;
  const totalMatches =
    matchData &&
    matchData.length &&
    matchData.filter((match) => match.status !== "completed").length;

  const totalPets = petsData.filter(
    (pet) => pet?.adoptionStatus !== "Complete"
  ).length;

  const dashboardMetricData = {
    totalPets: totalPets ?? 0,
    totalMatches: totalMatches ?? 0,
    completedAdoptions: completedAdoptions ?? 0,
    ongoingAdoptions: ongoingAdoptions ?? 0,
  };

  // Memoize email to avoid unnecessary re-renders
  const email = useMemo(
    () => session?.publicUserData.identifier ?? "",
    [session]
  );

  // React query hooks
  const { data: holderPetsData, isLoading: petsDataLoading } = usePetData({
    holderId: userData?._id,
  });

  /**
   * Handle tab change event.
   *
   * @param {string} tabId - The ID of the tab to activate.
   */
  const handleTabChange = useCallback((tabId: string) => {
    setActiveTab(tabId);
  }, []);

  // Use useMemo to avoid recalculating tabs on each render
  const tabs = useMemo(() => {
    if (!holderPetsData) return [];

    const filteredHolderPetsData = Array.isArray(holderPetsData)
      ? holderPetsData.filter((pet) => pet?.adoptionStatus !== "Complete")
      : [];

    return [
      {
        id: "overview",
        label: "Overview",
        content: (
          <OverviewDashboardTab
            pets={filteredHolderPetsData}
            data={dashboardMetricData}
          />
        ),
      },
      {
        id: "addPets",
        label: "Add pets",
        content: (
          <PetUploadDashboardTab
            onTabChange={(tabId) => handleTabChange(tabId)}
          />
        ),
      },
    ];
  }, [holderPetsData, dashboardMetricData, handleTabChange]);

  if (petsDataLoading || !holderPetsData) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden">
      <Card
        className="flex items-center justify-center w-[90%] h-[90%]"
        shadow="lg"
      >
        <div className="contentSeparator w-[80%] self-center" />
        <CardBody className="p-4 pb-24 lg:p-10">
          <Tabs
            aria-label="Dynamic tabs"
            items={tabs}
            size="lg"
            selectedKey={activeTab}
            onSelectionChange={(key: Key) => setActiveTab(key as string)}
          >
            {(item) => (
              <Tab key={item.id} title={item.label}>
                <CardBody>{item.content}</CardBody>
              </Tab>
            )}
          </Tabs>
        </CardBody>
        <div className="contentSeparator w-[80%] self-center" />
      </Card>
    </div>
  );
}
