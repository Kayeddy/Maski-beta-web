"use client";
import React from "react";
import {
  Navbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@nextui-org/navbar";
import Link from "next/link";

import { ThemeSwitcher } from "@/components/other/navigation/ThemeSwitcher";
import { useTheme } from "next-themes";
import { UserButton, SignedIn, SignedOut, useSession } from "@clerk/nextjs";
import { dark } from "@clerk/themes";
import { useLocale } from "next-intl";
import { Skeleton } from "@nextui-org/react";
import Image from "next/image";

export default function DesktopNavbar() {
  const currentLocale = useLocale();

  const { isLoaded } = useSession();

  const { theme } = useTheme();

  return (
    <Navbar
      //mx-auto fixed top-12 z-[100] w-[90%]  rounded-full
      className={`dark:bg-dark-1 bg-light-3 backdrop-blur-lg px-10 py-4 flex flex-row items-center justify-center  `}
    >
      <div className="flex flex-row items-center justify-around w-full gap-4">
        <Image
          src={`${
            theme === "dark"
              ? "/assets/core/logo_sm_dark.webp"
              : "/assets/core/logo_sm_light.webp"
          }`}
          width={60}
          height={60}
          alt="maski_navbar_logo"
          className="object-cover"
        ></Image>

        <ThemeSwitcher />

        <div className="flex flex-row gap-4">
          <SignedOut>
            <div className="flex flex-row gap-4">
              <Link
                href={`/${currentLocale}/sign-in`}
                className="light:text-dark-1 dark:text-light-1 text-body-medium"
              >
                Sign in
              </Link>

              <Link
                href={`/${currentLocale}/sign-up`}
                className="text-body-medium light:text-dark-1 dark:text-light-1"
              >
                Sign Up
              </Link>
            </div>
          </SignedOut>

          <SignedIn>
            {isLoaded ? (
              <UserButton
                appearance={{
                  baseTheme: theme === "dark" ? dark : undefined,
                }}
                afterSignOutUrl={`/${currentLocale}`}
              />
            ) : (
              <Skeleton className="w-10 h-10 rounded-full" />
            )}
          </SignedIn>
        </div>
      </div>
    </Navbar>
  );
}
