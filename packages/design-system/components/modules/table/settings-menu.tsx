"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@xbase/design-system/components/ui/dropdown-menu";
import {
  IconCheckbox,
  IconColumns3,
  IconRefresh,
  IconSettings,
} from "@xbase/icons/tabler";

interface DataTableSettingsMenuProps {
  hasSelection: boolean;
  onClearSelection: () => void;
  onResetColumnSizes: () => void;
  onResetColumnVisibility: () => void;
}

export function DataTableSettingsMenu({
  hasSelection,
  onClearSelection,
  onResetColumnVisibility,
  onResetColumnSizes,
}: DataTableSettingsMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button leftIcon={<IconSettings />} type="button" variant="outline">
          Settings
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Table settings</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onResetColumnSizes}>
          <IconRefresh />
          Reset column sizes
        </DropdownMenuItem>
        <DropdownMenuItem onClick={onResetColumnVisibility}>
          <IconColumns3 />
          Reset column visibility
        </DropdownMenuItem>
        <DropdownMenuItem disabled={!hasSelection} onClick={onClearSelection}>
          <IconCheckbox />
          Clear selection
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
