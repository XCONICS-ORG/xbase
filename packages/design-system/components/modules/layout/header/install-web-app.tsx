"use client";

import {
  Button,
  type ButtonProps,
} from "@xbase/design-system/components/ui/button";
import { cn } from "@xbase/design-system/lib/utils";
import { IconDownload } from "@xbase/icons/tabler";

export interface InstallWebAppProps {
  buttonVariant?: ButtonProps["variant"];
  className?: string;
  disabled?: boolean;
  label?: string;
  onInstall?: () => void;
  showLabel?: boolean;
}

export function InstallWebApp({
  buttonVariant = "ghost",
  className,
  disabled,
  label = "Install App",
  onInstall,
  showLabel = true,
}: InstallWebAppProps) {
  return (
    <Button
      aria-label={label}
      className={cn(showLabel ? "gap-2" : "", className)}
      disabled={disabled}
      onClick={onInstall}
      size={showLabel ? "default" : "icon"}
      type="button"
      variant={buttonVariant}
    >
      <IconDownload className="size-4 shrink-0" />
      {showLabel ? <span>{label}</span> : <span className="sr-only">{label}</span>}
    </Button>
  );
}
