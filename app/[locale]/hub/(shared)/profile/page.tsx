import React from "react";
import { InteractiveProfileSection } from "@/components/sections/hub/shared/InteractiveProfileSection";

export default function Page() {
  // Render the actual content once the session is loaded
  return (
    <main className="flex flex-col items-start justify-center w-screen h-screen dark:bg-slate-950 bg-light-3 ">
      <InteractiveProfileSection />
    </main>
  );
}
