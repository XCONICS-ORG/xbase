"use client";

import type { ThemeProviderProps } from "next-themes";
import NextTopLoader, { type NextTopLoaderProps } from "nextjs-toploader";
import type { ReactNode } from "react";
import { Toaster } from "@xbase/design-system/components/ui/sonner";
import { TooltipProvider } from "@xbase/design-system/components/ui/tooltip";
import { cn } from "@xbase/design-system/lib/utils";
import { ThemeProvider } from "@xbase/design-system/providers/theme";
import { TweakcnLivePreview } from "@xbase/design-system/providers/tweakcn";

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
