import { Suspense } from "react";
import "../../globals.scss";
import DesktopNavbar from "@/components/shared/navigation/DesktopNavbar";

import PageTransitionLoader from "@/components/shared/loaders/PageTransitionLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <Suspense fallback={<PageTransitionLoader />}>
      <DesktopNavbar />
      <div className="w-screen h-screen dark:bg-dark-1 bg-light-3">
        {children}
      </div>
    </Suspense>
  );
}
