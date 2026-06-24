import { DesignSystemProvider } from "@xbase/design-system";
import { WebMetadata } from "@xbase/constants/metadata/web";
import { createMetadata } from "@xbase/seo/metadata";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import "@xbase/design-system/globals.css";
import { createFontClassName } from "@xbase/design-system/lib/fonts";
import { cn } from "@xbase/design-system/lib/utils";
import { PwaProvider } from "@xbase/libs/pwa/provider";

const appFonts = createFontClassName();

export const metadata: Metadata = createMetadata({
  title: WebMetadata.title,
  description: WebMetadata.description,
});

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
          <PwaProvider>{children}</PwaProvider>
        </DesignSystemProvider>
      </body>
    </html>
  );
}
