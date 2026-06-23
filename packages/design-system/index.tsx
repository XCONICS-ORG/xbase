"use client";

import type { ThemeProviderProps } from "next-themes";
import NextTopLoader, { type NextTopLoaderProps } from "nextjs-toploader";
import type { ReactNode } from "react";
import { Toaster } from "./components/ui/sonner";
import { TooltipProvider } from "./components/ui/tooltip";
import { cn } from "./lib/utils";
import { ThemeProvider } from "./providers/theme";
import { TweakcnLivePreview } from "./providers/tweakcn";

type DesignSystemProviderProperties = ThemeProviderProps & {
  children: ReactNode;
  className?: string;
  enableTopLoader?: boolean;
  fontClassName?: string;
  topLoaderProps?: NextTopLoaderProps;
};

export const DesignSystemProvider = ({
  children,
  className,
  enableTopLoader = true,
  fontClassName,
  topLoaderProps,
  ...properties
}: DesignSystemProviderProperties) => (
  <ThemeProvider {...properties}>
    <TweakcnLivePreview />
    {enableTopLoader ? (
      <NextTopLoader
        color="var(--primary)"
        showSpinner={false}
        {...topLoaderProps}
      />
    ) : null}
    <TooltipProvider>
      <div className={cn(fontClassName, className)} data-design-system="">
        {children}
      </div>
    </TooltipProvider>
    <Toaster />
  </ThemeProvider>
);
