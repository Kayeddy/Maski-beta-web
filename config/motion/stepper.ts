export const stepperContainerMotionVariants = {
  hidden: {
    opacity: 0,
  },
  show: {
    opacity: 1,
    transition: {
      delayChildren: 0.25,
      staggerChildren: 0.25,
    },
  },
};
export const stepperItemMotionVariants = {
  hidden: {
    opacity: 0,
    x: "-100%",
  },
  show: {
    opacity: 1,
    x: "0%",
  },
};
