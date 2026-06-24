import type { ReactNode } from "react";

export type EntityId = string | number;

export interface BaseEntity<TId extends EntityId = string> {
  id: TId;
}

export interface TimestampedEntity {
  createdAt?: string | Date | null;
  updatedAt?: string | Date | null;
}

export interface SoftDeletedEntity {
  deletedAt?: string | Date | null;
  isDeleted?: boolean | null;
}

export type DataTableSortOrder = "asc" | "desc";

export const DATA_TABLE_DEFAULT_COLUMN_MIN_SIZE = 96;
export const DATA_TABLE_DEFAULT_COLUMN_SIZE = 160;
export const DATA_TABLE_DEFAULT_PAGE_SIZES = [10, 25, 50, 100] as const;
export const DATA_TABLE_DEFAULT_SORT_BY_VALUE = "__default";

export interface DataTableFilters<TSortField extends string> {
  limit: number;
  page: number;
  search?: string | null;
  sortBy?: TSortField | null;
  sortOrder: DataTableSortOrder;
}

export interface DataTableSortOption<TSortField extends string> {
  initialOrder?: DataTableSortOrder;
  label: string;
  value: TSortField;
}

export interface DataTableDateRangeValue {
  endDate: string | null;
  startDate: string | null;
}

export interface DataTableDateRangeFilter {
  disabled?: boolean;
  endDate?: string | null;
  label?: string;
  onChange: (range: DataTableDateRangeValue) => void;
  placeholder?: string;
  startDate?: string | null;
}

export interface DataTableColumn<TData, TSortField extends string = never> {
  align?: "left" | "center" | "right";
  cell: (row: TData) => ReactNode;
  className?: string;
  exportable?: boolean;
  exportValue?: (row: TData) => boolean | null | number | string | undefined;
  headerClassName?: string;
  hideable?: boolean;
  id: string;
  isVisible?: boolean;
  label: string;
  maxSize?: number;
  minSize?: number;
  resizable?: boolean;
  size?: number;
  sortKey?: TSortField;
}
