"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import { cn } from "@xbase/design-system/lib/utils";
import { Check, Copy } from "@xbase/icons/lucide";
import { motion } from "motion/react";
import {
  type ComponentProps,
  type ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { toast } from "sonner";

type CopyButtonValue = boolean | Date | number | string | null | undefined;

type ButtonProps = ComponentProps<typeof Button>;

export interface CopyButtonProps
  extends Omit<ButtonProps, "children" | "onClick" | "value"> {
  children?: ReactNode;
  copiedLabel?: ReactNode;
  errorMessage?: string;
  iconClassName?: string;
  label?: ReactNode;
  onCopied?: (value: string) => void;
  onCopyError?: (error: unknown) => void;
  resetDelay?: number;
  showLabel?: boolean;
  successMessage?: string;
  toastEnabled?: boolean;
  value?: CopyButtonValue;
  valueFormatter?: (value: CopyButtonValue) => string;
}

function defaultValueFormatter(value: CopyButtonValue) {
  if (value instanceof Date) {
    return value.toISOString();
  }

  if (value === null || value === undefined) {
    return "";
  }

  return String(value);
}

export function CopyButton({
  children,
  className,
  copiedLabel = "Copied",
  disabled,
  errorMessage = "Failed to copy to clipboard",
  iconClassName,
  label = "Copy",
  onCopied,
  onCopyError,
  resetDelay = 1800,
  showLabel = false,
  size,
  successMessage = "Copied to clipboard",
  toastEnabled = true,
  type = "button",
  value,
  valueFormatter = defaultValueFormatter,
  variant = "ghost",
  ...props
}: CopyButtonProps) {
  const [isCopied, setIsCopied] = useState(false);

  const copyValue = useMemo(
    () => valueFormatter(value),
    [value, valueFormatter]
  );
  const isDisabled = disabled || copyValue.length === 0;

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsCopied(false);
    }, resetDelay);

    return () => window.clearTimeout(timeout);
  }, [isCopied, resetDelay]);

  const handleCopy = async () => {
    if (isDisabled) {
      return;
    }

    try {
      await navigator.clipboard.writeText(copyValue);
      setIsCopied(true);
      onCopied?.(copyValue);

      if (toastEnabled) {
        toast.success(successMessage);
      }
    } catch (error) {
      onCopyError?.(error);

      if (toastEnabled) {
        toast.error(errorMessage);
      }
    }
  };

  let visibleLabel = children ?? null;

  if (!(visibleLabel || !showLabel)) {
    visibleLabel = isCopied ? copiedLabel : label;
  }

  const resolvedSize = size ?? (visibleLabel ? "sm" : "icon-sm");

  return (
    <Button
      aria-label={typeof label === "string" ? label : "Copy value"}
      className={cn("relative", visibleLabel && "gap-1.5", className)}
      disabled={isDisabled}
      onClick={handleCopy}
      size={resolvedSize}
      type={type}
      variant={variant}
      {...props}
    >
      <span className="relative inline-grid size-3.5 shrink-0 place-items-center">
        <motion.span
          animate={{
            opacity: isCopied ? 0 : 1,
            rotate: isCopied ? -12 : 0,
            scale: isCopied ? 0.65 : 1,
          }}
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center"
          initial={false}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          <Copy className={cn("size-3.5 stroke-[1.5px]", iconClassName)} />
        </motion.span>
        <motion.span
          animate={{
            opacity: isCopied ? 1 : 0,
            rotate: isCopied ? 0 : 12,
            scale: isCopied ? 1 : 0.65,
          }}
          aria-hidden="true"
          className="absolute inset-0 grid place-items-center"
          initial={false}
          transition={{ duration: 0.16, ease: "easeOut" }}
        >
          <Check
            className={cn(
              "size-3.5 stroke-[1.5px] text-success",
              iconClassName
            )}
          />
        </motion.span>
      </span>
      {visibleLabel ? <span className="truncate">{visibleLabel}</span> : null}
    </Button>
  );
}
