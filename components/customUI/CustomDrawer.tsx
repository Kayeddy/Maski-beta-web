// React
import { useState } from "react";

// Shadcn
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";

// Next UI
import { Button } from "@nextui-org/react";

/**
 * CustomDrawer is a component that renders a modal drawer. It's designed to display detailed information or additional content without navigating away from the current page. The drawer can be toggled via a trigger element.
 *
 * @param {Object} props - The component props.
 * @param {React.ReactNode} props.triggerElement - The element that, when interacted with, will open the drawer. This should be a React component or element.
 * @param {string} [props.title] - An optional title for the drawer's content. It appears at the top of the drawer.
 * @param {string} [props.description] - An optional description that provides more details about the drawer's content. It is displayed below the title.
 * @param {React.ReactNode} props.content - The main content of the drawer. This can include text, forms, or any other React components.
 *
 * @returns {React.ReactElement} A component that renders a modal drawer with a customizable trigger, title, description, and content.
 *
 * @example
 * <CustomDrawer
 *   triggerElement={<button>Open Drawer</button>}
 *   title="Drawer Title"
 *   description="This is a detailed description of what's inside the drawer."
 *   content={<p>Here's some more detailed content, such as forms or information.</p>}
 * />
 */

export default function CustomDrawer({
  triggerElement,
  title,
  description,
  content,
}: {
  triggerElement: any;
  title?: string;
  description?: string;
  content: any;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerElement}</DrawerTrigger>
      <DrawerContent className="dark:bg-dark-4">
        <DrawerHeader className="text-left">
          <DrawerTitle className="text-body-medium">{title}</DrawerTitle>
          <DrawerDescription>{description}</DrawerDescription>
        </DrawerHeader>
        {content}
        <DrawerFooter className="pt-2">
          <DrawerClose asChild>
            <Button variant="solid" className="px-4 mx-auto mt-4 w-fit">
              Close
            </Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
