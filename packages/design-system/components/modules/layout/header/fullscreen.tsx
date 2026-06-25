"use client";

import {
  Button,
  type ButtonProps,
} from "@xbase/design-system/components/ui/button";
import { cn } from "@xbase/design-system/lib/utils";
import { IconArrowsMaximize, IconArrowsMinimize } from "@xbase/icons/tabler";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export interface FullscreenToggleProps {
  buttonVariant?: ButtonProps["variant"];
  className?: string;
  showLabel?: boolean;
}

export function FullscreenToggle({
  buttonVariant = "ghost",
  className,
  showLabel = true,
}: FullscreenToggleProps) {
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    handleFullscreenChange();
    document.addEventListener("fullscreenchange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
    };
  }, []);

  const handleToggle = async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await document.documentElement.requestFullscreen();
      }
    } catch {
      toast.error("Failed to toggle fullscreen");
    }
  };

  const Icon = isFullscreen ? IconArrowsMinimize : IconArrowsMaximize;
  const label = isFullscreen ? "Exit fullscreen" : "Fullscreen";

  return (
    <Button
      aria-label={label}
      className={cn(showLabel ? "gap-2" : "", className)}
      onClick={handleToggle}
      size={showLabel ? "default" : "icon"}
      type="button"
      variant={buttonVariant}
    >
      <Icon className="size-4 shrink-0" />
      {showLabel ? (
        <span>{label}</span>
      ) : (
        <span className="sr-only">{label}</span>
      )}
    </Button>
  );
}
