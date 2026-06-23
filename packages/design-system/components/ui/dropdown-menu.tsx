"use client";

import { DropdownMenu as DropdownMenuPrimitive } from "radix-ui";
import type { ComponentProps } from "react";
import { cn } from "../../lib/utils";

function DropdownMenu({
  ...properties
}: ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return (
    <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...properties} />
  );
}

function DropdownMenuTrigger({
  ...properties
}: ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...properties}
    />
  );
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  ...properties
}: ComponentProps<typeof DropdownMenuPrimitive.Content>) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        className={cn(
          "z-50 min-w-32 overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md",
          "data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[state=open]:fade-in-0 data-[state=open]:zoom-in-95 data-[state=closed]:animate-out data-[state=open]:animate-in",
          className
        )}
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        {...properties}
      />
    </DropdownMenuPrimitive.Portal>
  );
}

function DropdownMenuItem({
  className,
  ...properties
}: ComponentProps<typeof DropdownMenuPrimitive.Item>) {
  return (
    <DropdownMenuPrimitive.Item
      className={cn(
        "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-disabled:pointer-events-none data-disabled:opacity-50",
        className
      )}
      data-slot="dropdown-menu-item"
      {...properties}
    />
  );
}

export {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
};
