"use client";

import { useTheme } from "next-themes";
import type { CSSProperties } from "react";
import type { ToasterProps as SonnerToasterProps } from "sonner";
import { Toaster as Sonner } from "sonner";

type SonnerToastOptions = NonNullable<SonnerToasterProps["toastOptions"]>;

const Toaster = ({
  closeButton = true,
  toastOptions,
  ...properties
}: SonnerToasterProps) => {
  const { theme = "system" } = useTheme();
  const classNames: SonnerToastOptions["classNames"] = {
    closeButton:
      "rounded-full border border-border bg-background text-foreground shadow-sm transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30",
    ...toastOptions?.classNames,
  };

  return (
    <Sonner
      className="toaster group"
      closeButton={closeButton}
      style={
        {
          "--normal-bg": "var(--popover)",
          "--normal-text": "var(--popover-foreground)",
          "--normal-border": "var(--border)",
          "--border-radius": "var(--radius)",
        } as CSSProperties
      }
      theme={theme as SonnerToasterProps["theme"]}
      toastOptions={{
        ...toastOptions,
        classNames,
      }}
      {...properties}
    />
  );
};

export type { ToasterProps } from "sonner";
export { Toaster };
