"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import { Input } from "@xbase/design-system/components/ui/input";
import { cn } from "@xbase/design-system/lib/utils";
import { IconRefresh, IconRotate2 } from "@xbase/icons/tabler";
import type {
  DataTableColumn,
  DataTableDateRangeFilter as DataTableDateRangeFilterConfig,
  DataTableFilters,
} from "@xbase/types/data/table";
import type { ReactNode } from "react";
import { DataTableColumnVisibility } from "./column-visibility";
import { DataTableDateRangeFilter } from "./date-range-filter";
import { DataTableExportMenu } from "./export-menu";
import { DataTableSettingsMenu } from "./settings-menu";

interface DataTableToolbarProps<TData, TSortField extends string> {
  className?: string;
  columns: DataTableColumn<TData, TSortField>[];
  columnVisibility: Record<string, boolean>;
  dateRangeFilter?: DataTableDateRangeFilterConfig;
  fileNamePrefix?: string;
  filters: DataTableFilters<TSortField>;
  isFetching?: boolean;
  layout?: "default" | "stacked";
  onClearSelection: () => void;
  onColumnVisibilityChange: (columnId: string, isVisible: boolean) => void;
  onRefresh: () => void;
  onReset: () => void;
  onResetColumnSizes: () => void;
  onResetColumnVisibility: () => void;
  onSearchValueChange: (value: string) => void;
  rows: TData[];
  searchPlaceholder?: string;
  searchValue: string;
  selectedRows: TData[];
  showSettingsMenu?: boolean;
  toolbarEnd?: ReactNode;
  toolbarStart?: ReactNode;
}

export function DataTableToolbar<TData, TSortField extends string>({
  className,
  columns,
  columnVisibility,
  dateRangeFilter,
  fileNamePrefix,
  isFetching = false,
  layout = "default",
  onClearSelection,
  onColumnVisibilityChange,
  onRefresh,
  onReset,
  onResetColumnVisibility,
  onResetColumnSizes,
  onSearchValueChange,
  rows,
  searchPlaceholder = "Search",
  searchValue,
  selectedRows,
  showSettingsMenu = true,
  toolbarStart,
  toolbarEnd,
}: DataTableToolbarProps<TData, TSortField>) {
  const shouldStackToolbar =
    layout === "stacked" && Boolean(toolbarStart || toolbarEnd);
  const searchInputClassName = "h-8 min-h-8 w-full lg:min-w-0 lg:flex-1";
  const secondaryControls = (
    <>
      {toolbarEnd}
      <DataTableExportMenu
        columns={columns.filter(
          (column) => columnVisibility[column.id] ?? true
        )}
        fileNamePrefix={fileNamePrefix}
        rows={rows}
        selectedRows={selectedRows}
      />
      <DataTableColumnVisibility
        columns={columns}
        onVisibilityChange={onColumnVisibilityChange}
        visibility={columnVisibility}
      />
    </>
  );
  const primaryControls = (
    <>
      {showSettingsMenu ? (
        <DataTableSettingsMenu
          hasSelection={selectedRows.length > 0}
          onClearSelection={onClearSelection}
          onResetColumnSizes={onResetColumnSizes}
          onResetColumnVisibility={onResetColumnVisibility}
        />
      ) : null}
      <Button
        leftIcon={<IconRotate2 />}
        onClick={onReset}
        type="button"
        variant="outline"
      >
        Reset
      </Button>
      <Button
        leftIcon={
          <IconRefresh className={cn(isFetching ? "animate-spin" : "")} />
        }
        onClick={onRefresh}
        type="button"
        variant="default"
      >
        Refresh
      </Button>
    </>
  );
  const searchControls = (
    <div
      className={cn(
        "grid min-w-0 flex-1 grid-cols-1 gap-2",
        dateRangeFilter
          ? "lg:grid-cols-[minmax(16rem,1fr)_minmax(14rem,24rem)]"
          : ""
      )}
    >
      <Input
        aria-label={searchPlaceholder}
        className={searchInputClassName}
        onChange={(event) => onSearchValueChange(event.target.value)}
        placeholder={searchPlaceholder}
        value={searchValue}
      />
      {dateRangeFilter ? (
        <DataTableDateRangeFilter {...dateRangeFilter} />
      ) : null}
    </div>
  );

  return (
    <div
      className={cn(
        shouldStackToolbar
          ? "flex flex-col gap-3"
          : "flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between",
        className
      )}
    >
      {shouldStackToolbar ? (
        <>
          <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            {toolbarStart ? (
              <div className="min-w-0 flex-1">{toolbarStart}</div>
            ) : (
              <div className="hidden lg:block lg:flex-1" />
            )}
            <div className="flex flex-wrap items-center justify-end gap-2 lg:flex-none">
              {secondaryControls}
            </div>
          </div>
          <div className="flex w-full flex-col gap-2 lg:flex-row lg:items-center lg:justify-between">
            {searchControls}
            <div className="flex w-full flex-wrap items-center justify-end gap-2 lg:w-auto lg:flex-none">
              {primaryControls}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="flex min-w-0 flex-1 flex-col gap-3">
            {toolbarStart ? <div className="w-full">{toolbarStart}</div> : null}
            {searchControls}
          </div>
          <div className="flex flex-wrap items-center gap-2 lg:flex-none lg:justify-end">
            {secondaryControls}
            {primaryControls}
          </div>
        </>
      )}
    </div>
  );
}
