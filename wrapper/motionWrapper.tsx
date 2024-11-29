// app/providers.tsx
"use client";

import { AnimatePresence, motion as m } from "framer-motion";

/**
 * MotionPageWrapper is a high-order component that provides an animation effect for page transitions. It wraps around page content to animate its entry and exit with a simple fade and slide effect.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The content inside the wrapper. This can be any React component or HTML element.
 *
 * @returns {React.ReactElement} A main container element with animation effects applied to its children.
 *
 * @example
 * <MotionPageWrapper>
 *   <h1>Welcome to the page!</h1>
 * </MotionPageWrapper>
 */

export const MotionPageWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  return (
    <m.main
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: -10, opacity: 0 }}
      transition={{ duration: 0.5 }}
    >
      {children}
    </m.main>
  );
};

/**
 * MotionOnboardingAdopterFormWrapper is a component designed to wrap forms specifically used in the adopter onboarding process. It provides a sliding and fading animation to the form elements during their initial mount and unmount, enhancing the user experience by making the transition smoother.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The form components that will be wrapped inside this container.
 *
 * @returns {React.ReactElement} A div element with sliding and fading animations applied to its children.
 *
 * @example
 * <MotionOnboardingAdopterFormWrapper>
 *   <AdopterForm />
 * </MotionOnboardingAdopterFormWrapper>
 */

export const MotionOnboardingAdopterFormWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };
  return (
    <AnimatePresence mode="wait">
      <m.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
};

/**
 * MotionOnboardingProfileTypeSelectionFormWrapper is a component intended to encapsulate forms used for selecting a profile type during the onboarding process. Similar to the MotionOnboardingAdopterFormWrapper, it enhances user interaction by applying a sliding and fading animation to the form elements upon their entry and exit.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.children - The form components or any other content to be animated within this wrapper.
 *
 * @returns {React.ReactElement} A div element that animates its children with sliding and fading effects.
 *
 * @example
 * <MotionOnboardingProfileTypeSelectionFormWrapper>
 *   <ProfileTypeSelectionForm />
 * </MotionOnboardingProfileTypeSelectionFormWrapper>
 */

export const MotionOnboardingProfileTypeSelectionFormWrapper = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const variants = {
    initial: { opacity: 0, x: -100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 },
  };
  return (
    <AnimatePresence mode="wait">
      <m.div
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ duration: 0.5 }}
      >
        {children}
      </m.div>
    </AnimatePresence>
  );
};
