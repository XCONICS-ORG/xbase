"use client";

import { Switch } from "@xbase/design-system/components/ui/switch";
import { cn } from "@xbase/design-system/lib/utils";

export interface ActionSwitcherProps {
  activeLabel?: string;
  checked: boolean;
  className?: string;
  disabled?: boolean;
  inactiveLabel?: string;
  isUpdating?: boolean;
  onCheckedChange: (checked: boolean) => void;
}

export function ActionSwitcher({
  checked,
  onCheckedChange,
  isUpdating = false,
  activeLabel = "Active",
  inactiveLabel = "Inactive",
  disabled = false,
  className,
}: ActionSwitcherProps) {
  let statusText = inactiveLabel;
  if (isUpdating) {
    statusText = "Updating";
  } else if (checked) {
    statusText = activeLabel;
  }

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Switch
        checked={checked}
        disabled={isUpdating || disabled}
        onCheckedChange={onCheckedChange}
      />
      <span
        className={cn(
          "font-medium text-xs transition-colors",
          checked ? "text-success" : "text-muted-foreground",
          (isUpdating || disabled) &&
            "pointer-events-none text-muted-foreground"
        )}
      >
        {statusText}
      </span>
    </div>
  );
}
