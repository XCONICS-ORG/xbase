import { Figtree, Geist_Mono, Outfit } from "next/font/google";
import { cn } from "@xbase/design-system/lib/utils";

type FontClassValue = false | null | string | undefined;

export interface DesignSystemFontClassNames {
  className?: FontClassValue;
  heading?: FontClassValue;
  mono?: FontClassValue;
  sans?: FontClassValue;
}

export const fontVariables = {
  sans: "--font-sans",
  heading: "--font-heading",
  mono: "--font-mono",
} as const;

const headingFont = Figtree({
  subsets: ["latin"],
  variable: "--font-heading",
});

const sansFont = Outfit({ subsets: ["latin"], variable: "--font-sans" });

const monoFont = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
});

export const defaultFontClassNames = {
  sans: sansFont.variable,
  heading: headingFont.variable,
  mono: monoFont.variable,
} as const;

export const createFontClassName = ({
  sans = defaultFontClassNames.sans,
  heading = defaultFontClassNames.heading,
  mono = defaultFontClassNames.mono,
  className,
}: DesignSystemFontClassNames = {}) =>
  cn(
    "touch-manipulation font-sans antialiased",
    sans,
    heading,
    mono,
    className
  );

export const fonts = createFontClassName();

/*
  Local font setup:

  1. Put font files in the app, for example:
     apps/web/app/fonts/brand-sans.woff2
     apps/web/app/fonts/brand-heading.otf

  2. Create static next/font/local imports in that app's layout:

     import localFont from "next/font/local";
     import { createFontClassName, fontVariables } from "@xbase/design-system/lib/fonts";

     const brandSans = localFont({
       src: "./fonts/brand-sans.woff2",
       variable: "--font-sans",
     });

     const brandHeading = localFont({
       src: "./fonts/brand-heading.otf",
       variable: "--font-heading",
     });

     const appFonts = createFontClassName({
       sans: brandSans.variable,
       heading: brandHeading.variable,
     });

  3. Use it on the app root:

     <html className={appFonts} lang="en" suppressHydrationWarning>

  You can also pass the same class to DesignSystemProvider fontClassName for
  nested app shells, previews, or multi-brand sections that need isolated fonts.
*/
