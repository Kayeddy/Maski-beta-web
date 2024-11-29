import "../../globals.scss";
import Sidebar from "@/components/shared/navigation/DesktopSidebar";
import { Suspense } from "react";
import MobileNavbar from "@/components/shared/navigation/MobileNavbar";
import PageTransitionLoader from "@/components/shared/loaders/PageTransitionLoader";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <Suspense fallback={<PageTransitionLoader />}>
      <main className="relative w-screen h-screen dark:bg-dark-1 bg-light-3">
        <Sidebar />
        <MobileNavbar />
        {children}
      </main>
    </Suspense>
  );
}
