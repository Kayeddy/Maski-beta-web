"use client";

import { loadingModalPhrases } from "@/constants/loading";
import { useUserData } from "@/lib/hooks/useUserData";
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
    const personalizedPhrases = phrases.map((phrase, index) =>
      index === 0 ? phrase.replace("[User's Name]", userName) : phrase
    );

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
  const { isLoaded: isUserSessionLoaded, session } = useSession();

  const {
    data: userData,
    isLoading,
    isError,
  } = useUserData({ email: session?.publicUserData.identifier ?? "" });

  const currentPhrase = useDynamicLoadingMessage(
    userData?.firstName || session?.publicUserData.firstName || "",
    loadingModalPhrases
  );

  return (
    <div className="z-50 flex flex-col items-center justify-center w-screen h-screen gap-24 bg-white">
      <section>
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
      </section>
      {/* <section>
        <p className="z-50 text-black text-body-normal animate-pulse">
          {currentPhrase}
        </p>
      </section> */}
    </div>
  );
};

export default PageTransitionLoader;
