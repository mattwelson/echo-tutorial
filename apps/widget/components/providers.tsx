"use client";

import * as React from "react";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ConvexProvider, ConvexReactClient } from "convex/react";
import { NuqsAdapter } from "nuqs/adapters/next/app";

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = new ConvexReactClient(
    process.env.NEXT_PUBLIC_CONVEX_URL ?? ""
  );
  return (
    <NuqsAdapter>
      <ConvexProvider client={convex}>
        <NextThemesProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
          enableColorScheme
        >
          {children}
        </NextThemesProvider>
      </ConvexProvider>
    </NuqsAdapter>
  );
}
