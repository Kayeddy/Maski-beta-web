import { fredoka } from "@/config/fonts";
import "@/app/globals.scss";
import { ClerkProvider } from "@clerk/nextjs";
import {
  NextUiProvider,
  ReactQueryProvider,
  ThemeProvider,
} from "@/components/shared/providers";

import { Suspense } from "react";
import RouteLoader from "@/components/shared/loaders/RouteLoader";
import PageTransitionLoader from "@/components/shared/loaders/PageTransitionLoader";
import { DataProvider } from "@/context/DataProvider";

import "../globals.scss";
import CustomDonationBanner from "@/components/customUI/CustomDonationBanner";
import { Toaster } from "sonner";
import { cn } from "@/lib/utils";
import { SocketContextProvider } from "@/context/socketContext";

import Head from "next/head";
import CustomBetaAnnouncementBanner from "@/components/customUI/CustomBetaAnnouncementBanner";

// SEO optimization
export const metadata = {
  title: "Maski",
  description:
    "Maski is a digital adoption platform and community that streamlines the pet adoption process, connecting potential adopters with shelter animals through a user-friendly interface and community engagement.",
};

export default function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return (
    <html lang={locale} suppressHydrationWarning>
      <Head>
        <title>{metadata.title}</title>
        <meta name="description" content={metadata.description} />
        <meta
          http-equiv="Content-Security-Policy"
          content="upgrade-insecure-requests"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <body className={`${fredoka.className} antialiased`}>
        <ClerkProvider>
          <ReactQueryProvider>
            <DataProvider>
              <SocketContextProvider>
                <ThemeProvider>
                  <NextUiProvider>
                    <Suspense fallback={<PageTransitionLoader />}>
                      {/* <RouteLoader /> */}
                      <div className="w-screen h-screen min-h-screen dark:bg-dark-1 bg-light-3">
                        {children}
                        <CustomDonationBanner />
                        <CustomBetaAnnouncementBanner />
                        <Toaster />
                      </div>
                    </Suspense>
                  </NextUiProvider>
                </ThemeProvider>
              </SocketContextProvider>
            </DataProvider>
          </ReactQueryProvider>
        </ClerkProvider>
      </body>
    </html>
  );
}
