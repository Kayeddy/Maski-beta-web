// Custom interfaces

import { Tab } from "./customTypes.types";

/**
 * =====================================
 * Tabs Container Props Interface
 * =====================================
 * This interface defines the properties
 * for the TabsContainer component.
 */
export interface TabsContainerProps {
  tabs: Tab[];
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  contentClassName?: string;
}

/**
 * =====================================
 * Custom Tabs Selector Props Interface
 * =====================================
 * This interface defines the properties
 * for the CustomTabsSelector component.
 */
export interface CustomTabsSelectorProps {
  tabs: Tab[];
  active: Tab;
  onTabChange: (tab: Tab) => void;
  containerClassName?: string;
  activeTabClassName?: string;
  tabClassName?: string;
  setHovering: (hovering: boolean) => void;
}

/**
 * =====================================
 * Fade In Div Props Interface
 * =====================================
 * This interface defines the properties
 * for the FadeInDiv component.
 */
export interface FadeInDivProps {
  className?: string;
  tabs: Tab[];
  active: Tab;
  hovering: boolean;
}
