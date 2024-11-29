"use client";

import React from "react";

import DashboardMetricSection from "@/components/sections/hub/holder/DashboardMetricSections";
import DashboardPetSection from "@/components/sections/hub/holder/DashboardPetSection";

import { usePetStore } from "@/store/shared/usePet.store";

/**
 * GeneralInfoDashboardTab component - Displays general information including pets and metrics.
 *
 * @param {GeneralInfoDashboardTabProps} props - The properties of the component.
 * @returns {JSX.Element} The GeneralInfoDashboardTab component.
 */
export default function GeneralInfoDashboardTab(): JSX.Element {
  // Zustand store
  const retrievedPets = usePetStore((state) => state.pets);

  // Ensure retrievedPets is always an array
  const petsArray = Array.isArray(retrievedPets)
    ? retrievedPets
    : retrievedPets
    ? [retrievedPets]
    : [];

  // Filter out undefined values from petsArray
  const filteredPetsArray = petsArray.filter((pet) => pet !== undefined);

  return (
    <div className="flex flex-col items-start justify-center w-full h-full gap-10 py-4 overflow-hidden lg:flex-row">
      <section className="flex flex-col items-center justify-center w-full gap-4">
        <p className="text-[1.1rem]">Your pets</p>
        {retrievedPets && <DashboardPetSection pets={filteredPetsArray} />}
      </section>
      <section className="flex flex-col items-center justify-center w-full gap-8">
        <p className="text-[1.1rem]">Metrics</p>
        <DashboardMetricSection data={filteredPetsArray} />
      </section>
    </div>
  );
}
