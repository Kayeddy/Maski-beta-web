// Components

// Containers
import InteractiveOnboardingSection from "@/components/sections/onboarding/shared/InteractiveOnboardingSection";
import { MotionPageWrapper } from "@/wrapper/motionWrapper";

export default async function Page() {
  return (
    <div className="flex items-center justify-center w-full h-full overflow-hidden bg-inherit lg:px-12">
      <MotionPageWrapper>
        <InteractiveOnboardingSection />
      </MotionPageWrapper>
    </div>
  );
}
