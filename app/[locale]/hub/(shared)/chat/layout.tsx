"use client";

import "../../../../globals.scss";

import { SocketContextProvider } from "@/context/socketContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  return <SocketContextProvider>{children}</SocketContextProvider>;
}
