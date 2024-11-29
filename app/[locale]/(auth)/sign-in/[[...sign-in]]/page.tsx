"use client";

// Clerk
import { SignIn } from "@clerk/nextjs";
import { dark } from "@clerk/themes";

// NextUI
import { useTheme } from "next-themes";

// Containers
import { MotionPageWrapper } from "@/wrapper/motionWrapper";

// Next intl
import { useLocale } from "next-intl";

export default function Page() {
  const { theme } = useTheme();

  return (
    <MotionPageWrapper>
      <SignIn
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
        redirectUrl={`/${useLocale()}`}
      />
    </MotionPageWrapper>
  );
}
