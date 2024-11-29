"use client";

// Clerk
import { SignUp } from "@clerk/nextjs";
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
      <SignUp
        appearance={{
          baseTheme: theme === "dark" ? dark : undefined,
        }}
        redirectUrl={`/${useLocale()}/onboarding`}
      />
    </MotionPageWrapper>
  );
}
