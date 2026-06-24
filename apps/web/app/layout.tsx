import { DesignSystemProvider } from "@xbase/design-system";
import type { ReactNode } from "react";
import "@xbase/design-system/globals.css";
import { createFontClassName } from "@xbase/design-system/lib/fonts";
import { cn } from "@xbase/design-system/lib/utils";

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
