import { DesignSystemProvider } from "@turtle/design-system";
import type { ReactNode } from "react";
import "@turtle/design-system/globals.css";
import { createFontClassName } from "@turtle/design-system/lib/fonts";
import { cn } from "@turtle/design-system/lib/utils";

const appFonts = createFontClassName();

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html className={cn(appFonts)} lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <DesignSystemProvider
          enableTopLoader
          fontClassName={appFonts}
          topLoaderProps={{ color: "var(--primary)" }}
        >
          {children}
        </DesignSystemProvider>
      </body>
    </html>
  );
}
