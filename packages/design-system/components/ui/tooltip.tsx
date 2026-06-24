"use client";

import { cn } from "@xbase/design-system/lib/utils";
import { Tooltip as TooltipPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

function TooltipProvider({
  delayDuration = 0,
  ...properties
}: ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...properties}
    />
  );
}

function Tooltip({
  ...properties
}: ComponentProps<typeof TooltipPrimitive.Root>) {
  return <TooltipPrimitive.Root data-slot="tooltip" {...properties} />;
}

function TooltipTrigger({
  ...properties
}: ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return (
    <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...properties} />
  );
}

function TooltipContent({
  className,
  sideOffset = 4,
  ...properties
}: ComponentProps<typeof TooltipPrimitive.Content>) {
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        className={cn(
          "z-50 overflow-hidden rounded-md bg-foreground px-3 py-1.5 text-background text-xs shadow-md",
          "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=open]:animate-in",
          className
        )}
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        {...properties}
      />
    </TooltipPrimitive.Portal>
  );
}

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger };
