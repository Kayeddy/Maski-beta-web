// app/providers.tsx
"use client";

import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";
import { QueryClient, QueryClientProvider } from "react-query";

export function NextUiProvider({ children }: { children: React.ReactNode }) {
  return <NextUIProvider>{children}</NextUIProvider>;
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemesProvider
      defaultTheme="system"
      enableSystem
      {...props}
      attribute="class"
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}

export function ReactQueryProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  // Instantiate a new QueryClient
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        refetchOnWindowFocus: false,
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
