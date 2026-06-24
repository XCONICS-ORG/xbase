"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@xbase/design-system/components/ui/select";
import { cn } from "@xbase/design-system/lib/utils";
import {
  IconChevronLeft,
  IconChevronRight,
  IconChevronsLeft,
  IconChevronsRight,
} from "@xbase/icons/tabler";
import type {
  DataTableSortOption,
  DataTableSortOrder,
} from "@xbase/types/data/table";
import {
  DEFAULT_PAGE_SIZES,
  DEFAULT_SORT_BY_VALUE,
  getShowingRange,
  getSortInitialOrder,
} from "./utils";

interface DataTablePaginationProps<TSortField extends string> {
  className?: string;
  isRouting?: boolean;
  itemCount: number;
  limit: number;
  offset?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onSortChange: (
    sortBy: TSortField | null,
    sortOrder: DataTableSortOrder
  ) => void;
  page: number;
  pageSizeOptions?: readonly number[];
  selectedCount?: number;
  sortBy?: TSortField | null;
  sortOptions: DataTableSortOption<TSortField>[];
  sortOrder: DataTableSortOrder;
  totalItems: number;
  totalPages: number;
}

export function DataTablePagination<TSortField extends string>({
  className,
  itemCount,
  offset,
  page,
  limit,
  totalItems,
  totalPages,
  pageSizeOptions = DEFAULT_PAGE_SIZES,
  selectedCount = 0,
  sortBy = null,
  sortOptions,
  sortOrder,
  onPageChange,
  onPageSizeChange,
  onSortChange,
}: DataTablePaginationProps<TSortField>) {
  const showing = getShowingRange({
    totalItems,
    page,
    limit,
    itemCount,
    offset,
  });

  return (
    <div
      className={cn(
        "w-full min-w-0 max-w-full overflow-x-auto border-t",
        className
      )}
    >
      <div className="flex min-w-max items-center justify-between gap-2.5 px-4 pt-2.5">
        <div className="flex shrink-0 items-center gap-1.5 whitespace-nowrap">
          <div className="mr-3 flex shrink-0 items-center gap-2 whitespace-nowrap text-muted-foreground text-sm leading-none">
            <span>
              {selectedCount > 0
                ? `${selectedCount} selected`
                : `Showing ${showing.from}-${showing.to} of ${totalItems}`}
            </span>
          </div>

          <Select
            onValueChange={(value) => onPageSizeChange(Number(value))}
            value={String(limit)}
          >
            <SelectTrigger className="h-8 w-28 shrink-0 border border-border px-2.5 text-sm">
              <SelectValue placeholder="Rows" />
            </SelectTrigger>
            <SelectContent>
              {pageSizeOptions.map((size) => (
                <SelectItem key={size} value={String(size)}>
                  {size} rows
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) => {
              const nextSortBy =
                value === DEFAULT_SORT_BY_VALUE ? null : (value as TSortField);
              const nextSortOrder = nextSortBy
                ? getSortInitialOrder(sortOptions, nextSortBy)
                : "desc";

              onSortChange(nextSortBy, nextSortOrder);
            }}
            value={sortBy ?? DEFAULT_SORT_BY_VALUE}
          >
            <SelectTrigger className="h-8 w-34 shrink-0 border border-border px-2.5 text-sm">
              <SelectValue placeholder="Default sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={DEFAULT_SORT_BY_VALUE}>
                Default sort
              </SelectItem>
              {sortOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select
            onValueChange={(value) =>
              onSortChange(sortBy ?? null, value as DataTableSortOrder)
            }
            value={sortOrder}
          >
            <SelectTrigger className="h-8 w-34 shrink-0 border border-border px-2.5 text-sm">
              <SelectValue placeholder="Sort order" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="desc">Descending</SelectItem>
              <SelectItem value="asc">Ascending</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex shrink-0 items-center gap-2 whitespace-nowrap">
          <Button
            aria-label="Go to first page"
            className="h-8 w-8 p-0"
            disabled={page <= 1}
            onClick={() => onPageChange(1)}
            size="sm"
            type="button"
            variant="outline"
          >
            <IconChevronsLeft className="h-4 w-4" />
          </Button>

          <Button
            aria-label="Go to previous page"
            className="h-8 w-8 p-0"
            disabled={page <= 1}
            onClick={() => onPageChange(Math.max(1, page - 1))}
            size="sm"
            type="button"
            variant="outline"
          >
            <IconChevronLeft className="h-4 w-4" />
          </Button>

          <div className="px-1 font-medium text-foreground text-sm">
            Page {page} of {Math.max(totalPages, 1)}
          </div>

          <Button
            aria-label="Go to next page"
            className="h-8 w-8 p-0"
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.min(totalPages, page + 1))}
            size="sm"
            type="button"
            variant="outline"
          >
            <IconChevronRight className="h-4 w-4" />
          </Button>

          <Button
            aria-label="Go to last page"
            className="h-8 w-8 p-0"
            disabled={page >= totalPages}
            onClick={() => onPageChange(Math.max(totalPages, 1))}
            size="sm"
            type="button"
            variant="outline"
          >
            <IconChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
