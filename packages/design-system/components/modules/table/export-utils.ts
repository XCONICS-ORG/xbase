import type { DataTableColumn } from "@xbase/types/data/table";
import ExcelJS, { type Cell } from "exceljs";

const CSV_MIME_TYPE = "text/csv;charset=utf-8;";
const XLSX_MIME_TYPE =
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";

interface ExportColumn<TData> {
  label: string;
  value: (row: TData) => string;
}

const normalizeExportValue = (value: unknown) => {
  if (value === null || value === undefined) {
    return "";
  }

  if (value instanceof Date) {
    return value.toISOString();
  }

  if (Array.isArray(value)) {
    return value.join(", ");
  }

  if (typeof value === "object") {
    return JSON.stringify(value);
  }

  return String(value);
};

const downloadBlob = (
  content: BlobPart,
  fileName: string,
  mimeType: string
) => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = url;
  link.download = fileName;
  document.body.append(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
};

const buildTimestamp = (date = new Date()) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  return `${year}-${month}-${day}_${hours}-${minutes}-${seconds}`;
};

export const buildExportFileName = (
  prefix: string,
  suffix: string,
  extension: "csv" | "xlsx"
) => `${prefix}-${suffix}-${buildTimestamp()}.${extension}`;

export const buildExportColumns = <TData, TSortField extends string>(
  columns: DataTableColumn<TData, TSortField>[]
): ExportColumn<TData>[] =>
  columns
    .filter((column) => column.exportable !== false)
    .map((column) => ({
      label: column.label,
      value: (row: TData) => {
        if (column.exportValue) {
          return normalizeExportValue(column.exportValue(row));
        }

        const directValue =
          typeof row === "object" &&
          row !== null &&
          column.id in (row as Record<string, unknown>)
            ? (row as Record<string, unknown>)[column.id]
            : undefined;

        return normalizeExportValue(directValue);
      },
    }));

export const exportRowsToCsv = <TData, TSortField extends string>({
  columns,
  fileName,
  rows,
}: {
  columns: DataTableColumn<TData, TSortField>[];
  fileName: string;
  rows: TData[];
}) => {
  const exportColumns = buildExportColumns(columns);
  const csvRows = [
    exportColumns.map((column) => column.label),
    ...rows.map((row) => exportColumns.map((column) => column.value(row))),
  ].map((row) =>
    row.map((value) => `"${value.replaceAll('"', '""')}"`).join(",")
  );

  downloadBlob(`\uFEFF${csvRows.join("\n")}`, fileName, CSV_MIME_TYPE);
};

export const exportRowsToXlsx = async <TData, TSortField extends string>({
  columns,
  fileName,
  rows,
}: {
  columns: DataTableColumn<TData, TSortField>[];
  fileName: string;
  rows: TData[];
}) => {
  const exportColumns = buildExportColumns(columns);
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet("Data");

  worksheet.columns = exportColumns.map((column) => ({
    header: column.label,
    key: column.label,
    width: Math.max(14, Math.min(48, column.label.length + 4)),
  }));

  for (const row of rows) {
    const sheetRow = Object.fromEntries(
      exportColumns.map((column) => [column.label, column.value(row)])
    );

    worksheet.addRow(sheetRow);
  }

  const headerRow = worksheet.getRow(1);
  headerRow.font = { bold: true };
  headerRow.fill = {
    type: "pattern",
    pattern: "solid",
    fgColor: { argb: "FFF2F2F2" },
  };

  for (const column of worksheet.columns ?? []) {
    let maxLength = column.header ? String(column.header).length : 14;

    column.eachCell?.({ includeEmpty: true }, (cell: Cell) => {
      maxLength = Math.max(maxLength, String(cell.value ?? "").length);
    });

    column.width = Math.min(Math.max(maxLength + 2, 14), 48);
  }

  const buffer = await workbook.xlsx.writeBuffer();
  downloadBlob(buffer, fileName, XLSX_MIME_TYPE);
};
