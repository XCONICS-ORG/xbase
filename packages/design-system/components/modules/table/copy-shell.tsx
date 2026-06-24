"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import { cn } from "@xbase/design-system/lib/utils";
import { Check, Copy } from "@xbase/icons/lucide";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface CopyShellProps {
  className?: string;
  value: string;
}

export function CopyShell({ className, value }: CopyShellProps) {
  const [isCopied, setIsCopied] = useState(false);

  useEffect(() => {
    if (!isCopied) {
      return;
    }

    const timeout = window.setTimeout(() => {
      setIsCopied(false);
    }, 1800);

    return () => window.clearTimeout(timeout);
  }, [isCopied]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(value);
      setIsCopied(true);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy to clipboard");
    }
  };

  return (
    <div className={cn("flex min-w-0 items-center gap-1.5", className)}>
      <span className="truncate font-mono text-xs">{value}</span>
      <Button
        aria-label={`Copy ${value}`}
        className="relative shrink-0"
        onClick={handleCopy}
        size="icon-xs"
        type="button"
        variant="ghost"
      >
        <Copy
          className={cn(
            "absolute size-3.5 stroke-[1.5px] transition-all duration-200",
            isCopied ? "scale-75 opacity-0" : "scale-100 opacity-100"
          )}
        />
        <Check
          className={cn(
            "absolute size-3.5 stroke-[1.5px] text-success transition-all duration-200",
            isCopied ? "scale-100 opacity-100" : "scale-75 opacity-0"
          )}
        />
      </Button>
    </div>
  );
}
