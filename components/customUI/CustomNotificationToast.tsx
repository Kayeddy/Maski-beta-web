import { format } from "date-fns";
import { toast } from "sonner";

interface ComponentProps {
  title: string;
  description?: string;
  buttonLabel?: string;
  customButtonCallback?: () => void;
}

export default function CustomNotificationToast({
  title,
  description,
  buttonLabel,
  customButtonCallback,
}: ComponentProps) {
  return toast(title, {
    description:
      description ?? format(new Date(), "EEEE, MMMM dd, yyyy 'at' h:mm a"),
    action: {
      label: buttonLabel ?? "Close",
      onClick: customButtonCallback || (() => {}),
    },
  });
}
