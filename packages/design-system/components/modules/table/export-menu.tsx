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
import { IconDownload } from "@xbase/icons/tabler";
import type { DataTableColumn } from "@xbase/types/data/table";
import { toast } from "sonner";
import {
  buildExportFileName,
  exportRowsToCsv,
  exportRowsToXlsx,
} from "./export-utils";

interface DataTableExportMenuProps<TData, TSortField extends string> {
  columns: DataTableColumn<TData, TSortField>[];
  fileNamePrefix?: string;
  rows: TData[];
  selectedRows: TData[];
}

export function DataTableExportMenu<TData, TSortField extends string>({
  columns,
  fileNamePrefix = "table-export",
  rows,
  selectedRows,
}: DataTableExportMenuProps<TData, TSortField>) {
  const hasRows = rows.length > 0;
  const hasSelectedRows = selectedRows.length > 0;

  const exportSelected = async (type: "csv" | "xlsx") => {
    if (!hasSelectedRows) {
      toast.error("No selected rows to export.");
      return;
    }

    if (type === "csv") {
      exportRowsToCsv({
        columns,
        fileName: buildExportFileName(fileNamePrefix, "selected", "csv"),
        rows: selectedRows,
      });
    } else {
      await exportRowsToXlsx({
        columns,
        fileName: buildExportFileName(fileNamePrefix, "selected", "xlsx"),
        rows: selectedRows,
      });
    }

    toast.success(
      `Exported ${selectedRows.length} selected row(s) as ${type.toUpperCase()}.`
    );
  };

  const exportCurrentPage = async (type: "csv" | "xlsx") => {
    if (!hasRows) {
      toast.error("No rows available to export.");
      return;
    }

    if (type === "csv") {
      exportRowsToCsv({
        columns,
        fileName: buildExportFileName(fileNamePrefix, "current-page", "csv"),
        rows,
      });
    } else {
      await exportRowsToXlsx({
        columns,
        fileName: buildExportFileName(fileNamePrefix, "current-page", "xlsx"),
        rows,
      });
    }

    toast.success(
      `Exported ${rows.length} row(s) from the current page as ${type.toUpperCase()}.`
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button leftIcon={<IconDownload />} type="button" variant="outline">
          Export
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>Export data</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!hasSelectedRows}
          onClick={async () => exportSelected("csv")}
        >
          Export selected as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!hasSelectedRows}
          onClick={async () => exportSelected("xlsx")}
        >
          Export selected as XLSX
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={!hasRows}
          onClick={async () => exportCurrentPage("csv")}
        >
          Export current page as CSV
        </DropdownMenuItem>
        <DropdownMenuItem
          disabled={!hasRows}
          onClick={async () => exportCurrentPage("xlsx")}
        >
          Export current page as XLSX
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
