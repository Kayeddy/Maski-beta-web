"use client";

// React
import React, { useCallback, useEffect, useState } from "react";

// Forms

// Framer motion
import { AnimatePresence, motion as m } from "framer-motion";
import { dynamicOnboardingFormHandlerVariants } from "@/config/motion/onboarding";

// Clerk
import { useSession } from "@clerk/nextjs";
import PageTransitionLoader from "@/components/shared/loaders/PageTransitionLoader";
import AdopterOnboardingForm from "@/components/forms/onboarding/AdopterOnboardingForm";
import HolderOnboardingForm from "@/components/forms/onboarding/HolderOnboardingForm";
import ExplorerOnboardingForm from "@/components/forms/onboarding/ExplorerOnboardingForm";
import ProfileTypeSelectionOnboardingForm from "@/components/forms/onboarding/ProfileTypeSelectionOnboardingForm";
import { useUserStore } from "@/store/shared/useUser.store";
import { redirect } from "next/navigation";

type FormKeys = "adopter" | "holder" | "explorer" | "ProfileSelection";

const formComponents = {
  adopter: AdopterOnboardingForm,
  holder: HolderOnboardingForm,
  explorer: ExplorerOnboardingForm,
  ProfileSelection: ProfileTypeSelectionOnboardingForm,
};

/**
 * DynamicOnboardingFormHandler dynamically renders different onboarding forms based on the user's current
 * stage in the onboarding process. It manages the navigation between different onboarding forms
 * and maintains a history of visited forms.
 *
 * @component
 * @param {DynamicOnboardingFormHandlerProps} props The component properties.
 * @param {UserDatabaseData} props.userDatabaseData The data of the user fetched from the database.
 * @returns {React.ReactElement} The dynamic onboarding form handler component.
 */
const InteractiveOnboardingSection: React.FC = () => {
  const [currentForm, setCurrentForm] = useState<FormKeys>("ProfileSelection");
  const [loading, setLoading] = useState<boolean>(true);
  const [history, setHistory] = useState<FormKeys[]>(["ProfileSelection"]); // History of forms

  const { isLoaded: isUserSessionLoaded, session } = useSession();

  const { user } = useUserStore();

  /**
   * Advances to the next form in the onboarding process.
   * @param {string} formName The name of the form to proceed to.
   */
  const moveToNextForm = useCallback((formName: string) => {
    if (formName in formComponents) {
      setCurrentForm(formName as FormKeys); // Cast safely after checking
      setHistory((prevHistory) => [...prevHistory, formName as FormKeys]);
    } else {
      console.error(`Invalid form name: ${formName}`);
    }
  }, []);

  /**
   * Returns to the previous form in the onboarding process.
   */
  const moveToPreviousForm = useCallback(() => {
    setHistory((prevHistory) => {
      if (prevHistory.length <= 1) return prevHistory;

      const newHistory = prevHistory.slice(0, -1);
      setCurrentForm(newHistory[newHistory.length - 1]);
      return newHistory;
    });
  }, []);

  const FormComponent =
    formComponents[currentForm] || ProfileTypeSelectionOnboardingForm;

  if (loading && !isUserSessionLoaded) {
    return <PageTransitionLoader />;
  }

  useEffect(() => {
    if (user?.onboarded) {
      redirect("/");
    }
  }, []);

  return (
    <AnimatePresence mode="wait">
      <m.div
        key={currentForm}
        variants={dynamicOnboardingFormHandlerVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.2 }}
        className="flex flex-col items-center justify-center w-full px-4 rounded-md"
      >
        <FormComponent
          onReturn={moveToPreviousForm}
          onProceed={moveToNextForm}
        />
      </m.div>
    </AnimatePresence>
  );
};
export default InteractiveOnboardingSection;
