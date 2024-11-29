// Shad CN
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

/**
 * Defines the properties for a sidebar item used in the CustomAccordion component.
 *
 * @interface
 * @property {Object} [sidebarItem] - Optional property defining the sidebar item and its children.
 * @property {string} sidebarItem.title - Title of the sidebar item.
 * @property {string} sidebarItem.link - Link for the sidebar item.
 * @property {Object[]} sidebarItem.children - An array of child items belonging to the sidebar item.
 * @property {string} sidebarItem.children[].name - Name of the child item.
 * @property {React.ReactNode} sidebarItem.children[].Icon - Icon for the child item rendered as a React node.
 * @property {string} sidebarItem.children[].link - Link for the child item.
 */
interface CustomAccordionProps {
  sidebarItem?: {
    title: string;
    link: string;
    children: {
      name: string;
      Icon: React.ReactNode;
      link: string;
    }[];
  };
}

/**
 * CustomAccordion is a component that renders an accordion with predefined items.
 * It's designed to display collapsible content panels for presenting information in a limited amount of space.
 *
 * Note: In the current implementation, `sidebarItem` prop is defined but not utilized. This suggests
 * potential future expansions or an oversight in the example provided.
 *
 * @param {CustomAccordionProps} props - The component props.
 * @param {Object} [props.sidebarItem] - The sidebar item to potentially influence accordion content, not used in current implementation.
 *
 * @returns {React.ReactElement} A component that renders a single, collapsible accordion.
 *
 * @example
 * <CustomAccordion sidebarItem={{
 *   title: 'Main Item',
 *   link: '/main-item',
 *   children: [
 *     { name: 'Child Item 1', Icon: <IconComponent />, link: '/child-1' },
 *     { name: 'Child Item 2', Icon: <AnotherIconComponent />, link: '/child-2' }
 *   ]
 * }} />
 */
export default function CustomAccordion({ sidebarItem }: CustomAccordionProps) {
  return (
    <Accordion type="single" collapsible className="w-full">
      <AccordionItem value="item-1">
        <AccordionTrigger>Is it accessible?</AccordionTrigger>
        <AccordionContent>
          Yes. It adheres to the WAI-ARIA design pattern.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-2">
        <AccordionTrigger>Is it styled?</AccordionTrigger>
        <AccordionContent>
          Yes. It comes with default styles that matches the other
          components&apos; aesthetic.
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="item-3">
        <AccordionTrigger>Is it animated?</AccordionTrigger>
        <AccordionContent>
          Yes. It's animated by default, but you can disable it if you prefer.
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
