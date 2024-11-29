export const sidebarVariants = {
  expanded: {
    width: "250px",
    transition: {
      when: "beforeChildren",
      type: "linear",
      ease: "easeInOut",
      duration: 0.3,
      staggerChildren: 0.1,
      delayChildren: 1,
    },
  },
  collapsed: {
    width: "80px",
    transition: {
      when: "afterChildren",
      type: "linear",
      ease: "easeInOut",
      duration: 0.4,
      staggerChildren: 0.1,
    },
  },
  hidden: {
    opacity: 0,
  },
  visible: {
    opacity: 1,
    transition: { duration: 0.5, delay: 0.5 },
  },
};

export const sidebarItemVariants = {
  expanded: {
    opacity: 1,
    x: 5,
    width: "auto",
    transition: {
      type: "linear",
      ease: "easeInOut",
    },
  },
  collapsed: { opacity: 0, width: 0 },
};

export const sidebarImageVariants = {
  expanded: {
    opacity: 1.5,
    height: "45",
    scale: 1,
    transition: { duration: 0.3 },
  },
  collapsed: {
    opacity: 1,
    scale: 1,
    height: "45",
    transition: { duration: 0.5 },
  },
};

export const sidebarSubmenuLineVariants = {
  hidden: { scaleY: 0 },
  visible: {
    scaleY: 1,
    transition: {
      duration: 0.3,
      ease: "easeInOut",
    },
  },
};

export const sidebarSubmenuItemVariants = {
  expanded: {
    opacity: 1,
    height: 50,
    x: 0,
  },
  collapsed: { opacity: 0, height: 0, x: -10 },
};
