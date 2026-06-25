import { cn } from "@xbase/design-system/lib/utils";
import type React from "react";

export default function PageContainer({
  children,
  scrollable = false,
  noPadding = false,
  className = "",
}: {
  children: React.ReactNode;
  scrollable?: boolean;
  noPadding?: boolean;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "mt-(--app-header-height,56px) h-[calc(100svh-var(--app-header-height,56px))] w-full min-w-0 max-w-full bg-background md:h-[calc(100lvh-var(--app-header-height,56px))]",
        scrollable ? "overflow-y-auto overflow-x-hidden" : "overflow-hidden",
        noPadding ? "p-0" : "px-2 py-2"
      )}
    >
      <div
        className={cn(
          "flex min-h-full min-w-0 max-w-full flex-col gap-2",
          scrollable && !noPadding ? "pb-2" : "mb-4",
          className
        )}
      >
        {children}
      </div>
    </div>
  );
}
