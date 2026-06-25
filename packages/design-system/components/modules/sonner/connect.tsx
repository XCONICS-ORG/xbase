"use client";

import {
  Button,
  type ButtonProps,
} from "@xbase/design-system/components/ui/button";
import type { MouseEvent, ReactNode } from "react";
import { useCallback, useEffect, useId, useRef, useState } from "react";
import { type ExternalToast, toast } from "sonner";

export type SonnerConnectVariant =
  | "default"
  | "success"
  | "info"
  | "warning"
  | "error";

export interface SonnerConnectProps
  extends Omit<ButtonProps, "loading" | "onClick" | "title"> {
  closeButton?: boolean;
  completed?: boolean;
  completedDescription?: ReactNode;
  completedTitle?: ReactNode;
  description?: ReactNode;
  errorDescription?: ReactNode;
  errorTitle?: ReactNode;
  failed?: boolean;
  loading?: boolean;
  loadingDescription?: ReactNode;
  loadingTitle?: ReactNode;
  onAction?: () => Promise<unknown> | unknown;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
  title?: ReactNode;
  toastId?: string | number;
  toastOptions?: ExternalToast;
  toastVariant?: SonnerConnectVariant;
}

const defaultTitles: Record<SonnerConnectVariant, string> = {
  default: "Notification",
  error: "Action failed",
  info: "Heads up",
  success: "Action completed",
  warning: "Needs attention",
};

const showToast = (
  variant: SonnerConnectVariant,
  title: ReactNode,
  options: ExternalToast
) => {
  if (variant === "default") {
    toast(title, options);
    return;
  }

  toast[variant](title, options);
};

export const dismissSonnerToasts = toast.dismiss;

export function SonnerConnect({
  children = "Show toast",
  closeButton = true,
  completed = false,
  completedDescription,
  completedTitle = "Completed",
  description,
  errorDescription,
  errorTitle = "Unable to complete",
  failed = false,
  loading = false,
  loadingDescription,
  loadingTitle = "Loading...",
  loadingText = "Loading...",
  onAction,
  onClick,
  title,
  toastId,
  toastOptions,
  toastVariant = "default",
  ...buttonProps
}: SonnerConnectProps) {
  const generatedId = useId().replaceAll(":", "");
  const stableToastId = useRef<string | number>(toastId ?? generatedId);
  const [isRunning, setIsRunning] = useState(false);
  const wasLoading = useRef(false);

  const getOptions = useCallback(
    (nextDescription?: ReactNode): ExternalToast => ({
      closeButton,
      description: nextDescription,
      id: stableToastId.current,
      ...toastOptions,
    }),
    [closeButton, toastOptions]
  );

  useEffect(() => {
    if (toastId !== undefined) {
      stableToastId.current = toastId;
    }
  }, [toastId]);

  useEffect(() => {
    if (loading) {
      wasLoading.current = true;
      toast.loading(loadingTitle, getOptions(loadingDescription));
      return;
    }

    if (completed && wasLoading.current) {
      wasLoading.current = false;
      toast.success(completedTitle, getOptions(completedDescription));
      return;
    }

    if (failed && wasLoading.current) {
      wasLoading.current = false;
      toast.error(errorTitle, getOptions(errorDescription));
    }
  }, [
    completed,
    completedDescription,
    completedTitle,
    errorDescription,
    errorTitle,
    failed,
    getOptions,
    loading,
    loadingDescription,
    loadingTitle,
  ]);

  const handleClick = async (event: MouseEvent<HTMLElement>) => {
    onClick?.(event);

    if (event.defaultPrevented) {
      return;
    }

    if (!onAction) {
      if (loading) {
        toast.loading(loadingTitle, getOptions(loadingDescription));
        return;
      }

      if (completed) {
        toast.success(completedTitle, getOptions(completedDescription));
        return;
      }

      if (failed) {
        toast.error(errorTitle, getOptions(errorDescription));
        return;
      }

      showToast(
        toastVariant,
        title ?? defaultTitles[toastVariant],
        getOptions(description)
      );
      return;
    }

    try {
      setIsRunning(true);
      toast.loading(loadingTitle, getOptions(loadingDescription));
      await onAction();
      toast.success(completedTitle, getOptions(completedDescription));
    } catch {
      toast.error(errorTitle, getOptions(errorDescription));
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <Button
      loading={loading || isRunning}
      loadingText={loadingText}
      onClick={handleClick}
      type="button"
      {...buttonProps}
    >
      {children}
    </Button>
  );
}
