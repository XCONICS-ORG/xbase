"use client";

import { Input } from "@xbase/design-system/components/ui/input";
import { cn } from "@xbase/design-system/lib/utils";
import { EyeIcon, EyeSlashIcon } from "@xbase/icons/phosphor";
import { type ComponentProps, type ReactNode, useState } from "react";

export type PasswordInputProps = Omit<ComponentProps<typeof Input>, "type"> & {
  endAddon?: ReactNode;
};

export function PasswordInput({
  className,
  disabled,
  endAddon,
  ...props
}: PasswordInputProps) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="relative">
      <Input
        className={cn(endAddon ? "pr-16" : "pr-9", className)}
        disabled={disabled}
        type={visible ? "text" : "password"}
        {...props}
      />
      <div className="absolute top-1/2 right-1 flex -translate-y-1/2 items-center gap-1">
        {endAddon}
        <button
          aria-label={visible ? "Hide password" : "Show password"}
          className="inline-flex size-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:border-ring focus-visible:ring-2 focus-visible:ring-ring/30 disabled:pointer-events-none disabled:opacity-50"
          disabled={disabled}
          onClick={() => setVisible((current) => !current)}
          type="button"
        >
          {visible ? (
            <EyeSlashIcon className="size-3.5" />
          ) : (
            <EyeIcon className="size-3.5" />
          )}
        </button>
      </div>
    </div>
  );
}
