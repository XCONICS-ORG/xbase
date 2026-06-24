"use client";

import { cn } from "@xbase/design-system/lib/utils";
import { Avatar as AvatarPrimitive } from "radix-ui";
import type { ComponentProps } from "react";

function Avatar({
  className,
  ...properties
}: ComponentProps<typeof AvatarPrimitive.Root>) {
  return (
    <AvatarPrimitive.Root
      className={cn(
        "relative flex size-8 shrink-0 overflow-hidden rounded-full",
        className
      )}
      data-slot="avatar"
      {...properties}
    />
  );
}

function AvatarImage({
  className,
  ...properties
}: ComponentProps<typeof AvatarPrimitive.Image>) {
  return (
    <AvatarPrimitive.Image
      className={cn("aspect-square size-full", className)}
      data-slot="avatar-image"
      {...properties}
    />
  );
}

function AvatarFallback({
  className,
  ...properties
}: ComponentProps<typeof AvatarPrimitive.Fallback>) {
  return (
    <AvatarPrimitive.Fallback
      className={cn(
        "flex size-full items-center justify-center rounded-full bg-muted font-medium text-muted-foreground text-xs",
        className
      )}
      data-slot="avatar-fallback"
      {...properties}
    />
  );
}

export { Avatar, AvatarFallback, AvatarImage };
