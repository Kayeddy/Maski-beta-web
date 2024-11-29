"use client";

import { loadingModalPhrases } from "@/constants/loading";
import { useUserStore } from "@/store/shared/useUser.store";
import { useSession } from "@clerk/nextjs";
import React, { useEffect, useState } from "react";

// Define the function with TypeScript types
const useDynamicLoadingMessage = (
  userName: string,
  phrases: string[],
  interval: number = 5000
): string => {
  const [currentPhrase, setCurrentPhrase] = useState<string>("");

  useEffect(() => {
    // Randomize phrases and replace placeholder with user's name
    const personalizedPhrases = phrases
      .map((phrase) => phrase.replace("[User's Name]", userName))
      .sort(() => Math.random() - 0.5);

    if (personalizedPhrases.length === 0) {
      return;
    }

    let phraseIndex = 0;
    setCurrentPhrase(personalizedPhrases[phraseIndex]);

    const timerId = setInterval(() => {
      phraseIndex = (phraseIndex + 1) % personalizedPhrases.length;
      setCurrentPhrase(personalizedPhrases[phraseIndex]);
    }, interval);

    return () => {
      clearInterval(timerId);
    };
  }, [userName, phrases, interval]);

  return currentPhrase;
};

const PageTransitionLoader = () => {
  const { session } = useSession();

  // Zustand stores
  const userData = useUserStore((state) => state.user);

  const currentPhrase = useDynamicLoadingMessage(
    userData?.firstName || session?.publicUserData.firstName || "",
    loadingModalPhrases
  );

  return (
    <div className="fixed z-50 flex flex-col items-center justify-center w-screen min-h-screen gap-24 p-10 overflow-hidden bg-white">
      <div className="loader">
        <div className="dog">
          <div className="dog-body">
            <div className="dog-tail">
              <div className="dog-tail">
                <div className="dog-tail">
                  <div className="dog-tail">
                    <div className="dog-tail">
                      <div className="dog-tail">
                        <div className="dog-tail">
                          <div className="dog-tail"></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="dog-torso"></div>
          <div className="dog-head">
            <div className="dog-ears">
              <div className="dog-ear"></div>
              <div className="dog-ear"></div>
            </div>
            <div className="dog-eyes">
              <div className="dog-eye"></div>
              <div className="dog-eye"></div>
            </div>
            <div className="dog-muzzle">
              <div className="dog-tongue"></div>
            </div>
          </div>
        </div>
      </div>
      <section className="items-center justify-center w-full text-center">
        <p className="z-50 text-black text-body-normal animate-pulse">
          {currentPhrase}
        </p>
      </section>
    </div>
  );
};

export default PageTransitionLoader;
