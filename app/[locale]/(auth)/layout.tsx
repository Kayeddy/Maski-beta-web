import "@/app/globals.scss";
import { Suspense } from "react";
import Loading from "../loading";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <Suspense fallback={<Loading />}>
      <div className="flex items-center justify-center w-full min-h-screen">
        {children}
      </div>
    </Suspense>
  );
}
