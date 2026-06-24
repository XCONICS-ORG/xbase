"use client";

import { Label } from "@xbase/design-system/components/ui/label";
import { Switch } from "@xbase/design-system/components/ui/switch";

export interface DeletedRecordsSwitchProps {
  checked: boolean;
  disabled?: boolean;
  label?: string;
  onCheckedChange: (checked: boolean) => void;
}

export function DeletedRecordsSwitch({
  checked,
  disabled,
  label = "Deleted",
  onCheckedChange,
}: DeletedRecordsSwitchProps) {
  return (
    <div className="flex h-8 shrink-0 items-center gap-2 rounded-none border bg-background px-2.5">
      <Switch
        aria-label="Show deleted records"
        checked={checked}
        disabled={disabled}
        id="deleted-records-switch"
        onCheckedChange={onCheckedChange}
      />
      <Label
        className="whitespace-nowrap text-xs leading-none"
        htmlFor="deleted-records-switch"
      >
        {label}
      </Label>
    </div>
  );
}
