"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@xbase/design-system/components/ui/dropdown-menu";
import { IconColumns3 } from "@xbase/icons/tabler";
import type { DataTableColumn } from "@xbase/types/data/table";

interface DataTableColumnVisibilityProps<TData, TSortField extends string> {
  columns: DataTableColumn<TData, TSortField>[];
  onVisibilityChange: (columnId: string, isVisible: boolean) => void;
  visibility: Record<string, boolean>;
}

export function DataTableColumnVisibility<TData, TSortField extends string>({
  columns,
  visibility,
  onVisibilityChange,
}: DataTableColumnVisibilityProps<TData, TSortField>) {
  const hideableColumns = columns.filter((column) => column.hideable !== false);

  if (hideableColumns.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button leftIcon={<IconColumns3 />} type="button" variant="outline">
          Columns
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-44">
        <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {hideableColumns.map((column) => (
          <DropdownMenuCheckboxItem
            checked={visibility[column.id] ?? true}
            key={column.id}
            onCheckedChange={(checked) =>
              onVisibilityChange(column.id, checked === true)
            }
          >
            {column.label}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
