import type {
  DataTableColumn,
  DataTableFilters,
  DataTableSortOption,
  DataTableSortOrder,
} from "@xbase/types/data/table";
import {
  DATA_TABLE_DEFAULT_COLUMN_MIN_SIZE,
  DATA_TABLE_DEFAULT_COLUMN_SIZE,
  DATA_TABLE_DEFAULT_PAGE_SIZES,
  DATA_TABLE_DEFAULT_SORT_BY_VALUE,
} from "@xbase/types/data/table";

export const DEFAULT_PAGE_SIZES = DATA_TABLE_DEFAULT_PAGE_SIZES;
export const DEFAULT_SORT_BY_VALUE = DATA_TABLE_DEFAULT_SORT_BY_VALUE;
export const DEFAULT_COLUMN_SIZE = DATA_TABLE_DEFAULT_COLUMN_SIZE;
export const DEFAULT_COLUMN_MIN_SIZE = DATA_TABLE_DEFAULT_COLUMN_MIN_SIZE;

export const buildVisiblePages = (currentPage: number, totalPages: number) => {
  const startPage = Math.max(1, currentPage - 2);
  const endPage = Math.min(totalPages, startPage + 4);

  return Array.from(
    { length: endPage - startPage + 1 },
    (_, index) => startPage + index
  );
};

export const getShowingRange = ({
  totalItems,
  page,
  limit,
  itemCount,
  offset,
}: {
  totalItems: number;
  page: number;
  limit: number;
  itemCount: number;
  offset?: number;
}) => {
  if (totalItems === 0 || itemCount === 0) {
    return {
      from: 0,
      to: 0,
    };
  }

  const start = offset ?? (page - 1) * limit;

  return {
    from: start + 1,
    to: Math.min(start + itemCount, totalItems),
  };
};

export const buildOffsetTableQuery = <
  TSortField extends string,
  TFilters extends DataTableFilters<TSortField>,
>(
  filters: TFilters
) =>
  ({
    ...filters,
    offset: (filters.page - 1) * filters.limit,
  }) as TFilters & { offset: number };

export const getInitialColumnVisibility = <TData, TSortField extends string>(
  columns: DataTableColumn<TData, TSortField>[]
) =>
  Object.fromEntries(
    columns.map((column) => [column.id, column.isVisible ?? true])
  ) as Record<string, boolean>;

export const syncColumnVisibility = <TData, TSortField extends string>(
  columns: DataTableColumn<TData, TSortField>[],
  currentState: Record<string, boolean>
) => {
  const nextState = getInitialColumnVisibility(columns);

  for (const column of columns) {
    const currentValue = currentState[column.id];

    if (typeof currentValue === "boolean") {
      nextState[column.id] = currentValue;
    }
  }

  return nextState;
};

export const getInitialColumnOrder = <TData, TSortField extends string>(
  columns: DataTableColumn<TData, TSortField>[]
) => columns.map((column) => column.id);

export const syncColumnOrder = <TData, TSortField extends string>(
  columns: DataTableColumn<TData, TSortField>[],
  currentState: string[]
) => {
  const availableColumnIds = new Set(columns.map((column) => column.id));
  const orderedExisting = currentState.filter((columnId) =>
    availableColumnIds.has(columnId)
  );
  const missingColumns = columns
    .map((column) => column.id)
    .filter((columnId) => !orderedExisting.includes(columnId));

  return [...orderedExisting, ...missingColumns];
};

export const getSortInitialOrder = <TSortField extends string>(
  sortOptions: DataTableSortOption<TSortField>[],
  sortBy: TSortField,
  fallback: DataTableSortOrder = "asc"
) =>
  sortOptions.find((option) => option.value === sortBy)?.initialOrder ??
  fallback;

export const getNextSortState = <TSortField extends string>(
  filters: DataTableFilters<TSortField>,
  sortBy: TSortField,
  sortOptions: DataTableSortOption<TSortField>[]
) => {
  if (filters.sortBy === sortBy) {
    return {
      sortBy,
      sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
    } as const;
  }

  return {
    sortBy,
    sortOrder: getSortInitialOrder(sortOptions, sortBy),
  } as const;
};

export const getColumnWidth = <TData, TSortField extends string>(
  column: DataTableColumn<TData, TSortField>
) => column.size ?? DEFAULT_COLUMN_SIZE;

export const getColumnMinWidth = <TData, TSortField extends string>(
  column: DataTableColumn<TData, TSortField>
) => column.minSize ?? DEFAULT_COLUMN_MIN_SIZE;

export const clampColumnWidth = <TData, TSortField extends string>(
  column: DataTableColumn<TData, TSortField>,
  width: number
) => {
  const minWidth = getColumnMinWidth(column);
  const maxWidth = column.maxSize;

  if (maxWidth !== undefined) {
    return Math.max(minWidth, Math.min(width, maxWidth));
  }

  return Math.max(minWidth, width);
};

export const getInitialColumnWidths = <TData, TSortField extends string>(
  columns: DataTableColumn<TData, TSortField>[]
) =>
  Object.fromEntries(
    columns.map((column) => [column.id, getColumnWidth(column)])
  ) as Record<string, number>;

export const syncColumnWidths = <TData, TSortField extends string>(
  columns: DataTableColumn<TData, TSortField>[],
  currentState: Record<string, number>
) => {
  const nextState = getInitialColumnWidths(columns);

  for (const column of columns) {
    const currentWidth = currentState[column.id];

    if (typeof currentWidth === "number") {
      nextState[column.id] = clampColumnWidth(column, currentWidth);
    }
  }

  return nextState;
};

export const getTotalColumnWidth = <TData, TSortField extends string>(
  columns: DataTableColumn<TData, TSortField>[],
  widths: Record<string, number>
) =>
  columns.reduce(
    (total, column) =>
      total +
      clampColumnWidth(column, widths[column.id] ?? getColumnWidth(column)),
    0
  );
