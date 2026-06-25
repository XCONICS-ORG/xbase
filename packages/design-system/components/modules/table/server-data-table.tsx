"use client";

import emptyTableIllustration from "@xbase/assets/images/modules/system/empty-table.svg";
import { SkeletonWrapper } from "@xbase/design-system/components/modules/skeleton/wrapper";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@xbase/design-system/components/ui/alert";
import { Button } from "@xbase/design-system/components/ui/button";
import { Card, CardContent } from "@xbase/design-system/components/ui/card";
import { Checkbox } from "@xbase/design-system/components/ui/checkbox";
import { Separator } from "@xbase/design-system/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@xbase/design-system/components/ui/table";
import { cn } from "@xbase/design-system/lib/utils";
import {
  IconChevronDown,
  IconChevronUp,
  IconGripVertical,
  IconSelector,
} from "@xbase/icons/tabler";
import type {
  DataTableColumn,
  DataTableDateRangeFilter,
  DataTableFilters,
  DataTableSortOption,
  DataTableSortOrder,
} from "@xbase/types/data/table";
import Image, { type ImageProps } from "next/image";
import { type ReactNode, useEffect, useMemo, useState } from "react";
import { DataTablePagination } from "./pagination";
import { DataTableRowContextMenu } from "./row-context-menu";
import { DataTableToolbar } from "./toolbar";
import {
  clampColumnWidth,
  getInitialColumnOrder,
  getInitialColumnVisibility,
  getInitialColumnWidths,
  getNextSortState,
  getTotalColumnWidth,
  syncColumnOrder,
  syncColumnVisibility,
  syncColumnWidths,
} from "./utils";

export interface ServerDataTableClassNames {
  bodyCell?: string;
  bodyRow?: string;
  content?: string;
  footer?: string;
  headerCell?: string;
  headerRow?: string;
  root?: string;
  table?: string;
  tableInner?: string;
  tableOuter?: string;
  toolbar?: string;
}

export interface ServerDataTableProps<TData, TSortField extends string> {
  className?: string;
  classNames?: ServerDataTableClassNames;
  columns: DataTableColumn<TData, TSortField>[];
  dateRangeFilter?: DataTableDateRangeFilter;
  emptyMessage?: string;
  emptyStateImageAlt?: string;
  emptyStateImageSrc?: ImageProps["src"];
  enableColumnResize?: boolean;
  enableRowSelection?: boolean;
  enableSettingsMenu?: boolean;
  errorMessage?: string;
  errorTitle?: string;
  exportFileNamePrefix?: string;
  filters: DataTableFilters<TSortField>;
  getRowKey: (row: TData) => string;
  isFetching?: boolean;
  isPending?: boolean;
  isRouting?: boolean;
  items: TData[];
  offset?: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (limit: number) => void;
  onRefresh: () => void;
  onReset: () => void;
  onRetry?: () => void;
  onSearchValueChange: (value: string) => void;
  onSortChange: (
    sortBy: TSortField | null,
    sortOrder: DataTableSortOrder
  ) => void;
  pageSizeOptions?: readonly number[];
  renderRowContextMenu?: (row: TData) => ReactNode;
  searchPlaceholder?: string;
  searchValue: string;
  sortOptions: DataTableSortOption<TSortField>[];
  toolbarEnd?: ReactNode;
  toolbarFilterSummary?: ReactNode;
  toolbarFilters?: ReactNode;
  toolbarLayout?: "default" | "stacked";
  toolbarStart?: ReactNode;
  totalItems: number;
  totalPages: number;
}

function DataTableSkeletonRows({
  columnCount,
  rowCount = 5,
}: {
  columnCount: number;
  rowCount?: number;
}) {
  const rows = Array.from(
    { length: rowCount },
    (_, index) => `loading-row-${index}`
  );
  const cells = Array.from(
    { length: columnCount },
    (_, index) => `loading-cell-${index}`
  );

  return (
    <>
      {rows.map((rowKey) => (
        <TableRow key={rowKey}>
          {cells.map((cellKey) => (
            <TableCell className="p-2" key={`${rowKey}-${cellKey}`}>
              <SkeletonWrapper
                fallback={
                  <div className="h-6 w-full animate-pulse rounded-none bg-muted" />
                }
                loading
                name="server-data-table-cell"
              >
                <div className="h-6 w-full rounded-none bg-muted" />
              </SkeletonWrapper>
            </TableCell>
          ))}
        </TableRow>
      ))}
    </>
  );
}

function DataTableEmptyState({
  imageAlt,
  imageSrc,
  message,
}: {
  imageAlt: string;
  imageSrc: ImageProps["src"];
  message: string;
}) {
  return (
    <div className="pointer-events-none flex w-full flex-col items-center justify-center gap-4 text-center">
      <Image
        alt={imageAlt}
        className="h-auto w-full max-w-48 object-contain opacity-90"
        height={200}
        loading="eager"
        src={imageSrc}
        width={320}
      />
      <p className="max-w-md text-balance text-muted-foreground text-sm">
        {message}
      </p>
    </div>
  );
}

function DataTableEmptyStateRow({
  colSpan,
  imageAlt,
  imageSrc,
  message,
}: {
  colSpan: number;
  imageAlt: string;
  imageSrc: ImageProps["src"];
  message: string;
}) {
  return (
    <TableRow className="pointer-events-none hover:bg-transparent">
      <TableCell
        className="pointer-events-none select-none px-4 py-12"
        colSpan={colSpan}
      >
        <DataTableEmptyState
          imageAlt={imageAlt}
          imageSrc={imageSrc}
          message={message}
        />
      </TableCell>
    </TableRow>
  );
}

function DataTableColumnResizer({
  isResizing,
  onResizeStart,
}: {
  isResizing: boolean;
  onResizeStart: (
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => void;
}) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        "absolute inset-y-0 -right-2 z-30 flex w-4 cursor-col-resize touch-none select-none items-stretch justify-center",
        "opacity-0 transition-opacity duration-150 group-hover/th:opacity-100",
        isResizing && "opacity-100"
      )}
      data-resizing={isResizing ? "true" : undefined}
      onMouseDown={onResizeStart}
      onTouchStart={onResizeStart}
    >
      <div className="relative flex h-full w-full items-stretch justify-center overflow-visible">
        <Separator
          className={cn(
            "h-full w-0.5 transition-colors duration-150",
            isResizing ? "bg-primary" : "bg-border group-hover/th:bg-primary"
          )}
          decorative={false}
          orientation="vertical"
        />

        <IconGripVertical
          className={cn(
            "absolute top-1/2 z-40 size-3.5 -translate-y-1/2 text-muted-foreground/60 transition-colors duration-150",
            isResizing ? "text-primary" : "group-hover/th:text-primary"
          )}
          stroke={1.5}
        />
      </div>
    </div>
  );
}

function getSortButtonAlignmentClassName(
  align: DataTableColumn<unknown, string>["align"]
) {
  if (align === "center") {
    return "mx-auto justify-center";
  }

  if (align === "right") {
    return "ml-auto justify-end";
  }

  return "justify-start";
}

// biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Server table state and rendering stay colocated to keep the generic API contained.
export function ServerDataTable<TData, TSortField extends string>({
  className,
  classNames,
  columns,
  dateRangeFilter,
  enableColumnResize = true,
  enableRowSelection = false,
  enableSettingsMenu = true,
  emptyStateImageAlt = "Empty table",
  emptyStateImageSrc = emptyTableIllustration,
  emptyMessage = "No records matched the current filters.",
  errorMessage,
  errorTitle = "Unable to load records",
  exportFileNamePrefix,
  filters,
  getRowKey,
  isFetching = false,
  isPending = false,
  isRouting = false,
  items,
  offset,
  onPageChange,
  onPageSizeChange,
  onRefresh,
  onReset,
  onRetry,
  onSearchValueChange,
  onSortChange,
  pageSizeOptions,
  renderRowContextMenu,
  searchPlaceholder,
  searchValue,
  sortOptions,
  toolbarLayout = "default",
  toolbarStart,
  toolbarEnd,
  toolbarFilterSummary,
  toolbarFilters,
  totalItems,
  totalPages,
}: ServerDataTableProps<TData, TSortField>) {
  const [columnVisibility, setColumnVisibility] = useState(() =>
    getInitialColumnVisibility(columns)
  );
  const [columnOrder, setColumnOrder] = useState(() =>
    getInitialColumnOrder(columns)
  );
  const [columnWidths, setColumnWidths] = useState(() =>
    getInitialColumnWidths(columns)
  );
  const [activeResizingColumnId, setActiveResizingColumnId] = useState<
    string | null
  >(null);
  const [selectedRowIds, setSelectedRowIds] = useState<Record<string, boolean>>(
    {}
  );

  useEffect(() => {
    setColumnVisibility((currentState) =>
      syncColumnVisibility(columns, currentState)
    );
  }, [columns]);

  useEffect(() => {
    setColumnOrder((currentState) => syncColumnOrder(columns, currentState));
  }, [columns]);

  useEffect(() => {
    setColumnWidths((currentState) => syncColumnWidths(columns, currentState));
  }, [columns]);

  const visibleColumns = useMemo(
    () =>
      columnOrder
        .map((columnId) => columns.find((column) => column.id === columnId))
        .filter((column): column is DataTableColumn<TData, TSortField> =>
          Boolean(column)
        )
        .filter((column) => columnVisibility[column.id] ?? true),
    [columnOrder, columnVisibility, columns]
  );

  const allColumns = useMemo(() => {
    if (!enableRowSelection) {
      return visibleColumns;
    }

    return [
      {
        id: "__selection__",
        label: "Select",
        cell: () => null,
        align: "center" as const,
        size: 44,
        minSize: 44,
        maxSize: 44,
      },
      ...visibleColumns,
    ];
  }, [enableRowSelection, visibleColumns]);

  const allPageRowIds = useMemo(
    () => items.map((item) => getRowKey(item)),
    [getRowKey, items]
  );
  const selectedRows = useMemo(
    () => items.filter((item) => selectedRowIds[getRowKey(item)] === true),
    [getRowKey, items, selectedRowIds]
  );
  const selectedCount = useMemo(
    () => Object.values(selectedRowIds).filter(Boolean).length,
    [selectedRowIds]
  );
  const selectedPageCount = useMemo(
    () => allPageRowIds.filter((rowId) => selectedRowIds[rowId]).length,
    [allPageRowIds, selectedRowIds]
  );
  const allPageRowsSelected =
    allPageRowIds.length > 0 && selectedPageCount === allPageRowIds.length;
  const somePageRowsSelected = selectedPageCount > 0 && !allPageRowsSelected;
  const tableMinWidth = useMemo(
    () => getTotalColumnWidth(allColumns, columnWidths),
    [allColumns, columnWidths]
  );
  const showLoadingRows = (isPending || isFetching) && items.length === 0;
  const showEmptyState = !showLoadingRows && items.length === 0;
  const tableWidthStyle = {
    minWidth: `${tableMinWidth}px`,
    width: `max(100%, ${tableMinWidth}px)`,
  };
  let pageSelectionState: boolean | "indeterminate" = false;

  if (allPageRowsSelected) {
    pageSelectionState = true;
  } else if (somePageRowsSelected) {
    pageSelectionState = "indeterminate";
  }

  useEffect(() => {
    if (items.length === 0) {
      return;
    }

    setSelectedRowIds((currentState) => {
      const nextState = { ...currentState };

      for (const rowId of Object.keys(nextState)) {
        if (!nextState[rowId]) {
          delete nextState[rowId];
        }
      }

      return nextState;
    });
  }, [items]);

  useEffect(
    () => () => {
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      document.body.removeAttribute("data-resizing");
    },
    []
  );

  const resizeColumn = (
    columnId: string,
    startWidth: number,
    clientX: number,
    startX: number
  ) => {
    const column = allColumns.find((entry) => entry.id === columnId);

    if (!column) {
      return;
    }

    const nextWidth = clampColumnWidth(column, startWidth + (clientX - startX));

    setColumnWidths((currentState) => ({
      ...currentState,
      [columnId]: nextWidth,
    }));
  };

  const handleResizeStart = (
    columnId: string,
    event: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>
  ) => {
    if (!enableColumnResize) {
      return;
    }

    event.preventDefault();

    const startX =
      "touches" in event
        ? (event.touches[0]?.clientX ?? event.changedTouches[0]?.clientX ?? 0)
        : event.clientX;
    const startWidth = columnWidths[columnId] ?? 0;

    setActiveResizingColumnId(columnId);
    document.body.setAttribute("data-resizing", "true");
    document.body.style.cursor = "col-resize";
    document.body.style.userSelect = "none";

    const handleMouseMove = (moveEvent: MouseEvent) => {
      resizeColumn(columnId, startWidth, moveEvent.clientX, startX);
    };

    const handleTouchMove = (moveEvent: TouchEvent) => {
      moveEvent.preventDefault();

      const clientX =
        moveEvent.touches[0]?.clientX ??
        moveEvent.changedTouches[0]?.clientX ??
        startX;

      resizeColumn(columnId, startWidth, clientX, startX);
    };

    const handlePointerUp = () => {
      setActiveResizingColumnId((currentState) =>
        currentState === columnId ? null : currentState
      );
      document.body.removeAttribute("data-resizing");
      document.body.style.cursor = "";
      document.body.style.userSelect = "";
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handleTouchMove);
      window.removeEventListener("touchend", handlePointerUp);
      window.removeEventListener("touchcancel", handlePointerUp);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handleTouchMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
    window.addEventListener("touchcancel", handlePointerUp);
  };

  const resetTableState = () => {
    setColumnVisibility(getInitialColumnVisibility(columns));
    setColumnOrder(getInitialColumnOrder(columns));
    setColumnWidths(getInitialColumnWidths(columns));
    setSelectedRowIds({});
    setActiveResizingColumnId(null);
    document.body.style.cursor = "";
    document.body.style.userSelect = "";
    document.body.removeAttribute("data-resizing");
    onReset();
  };

  return (
    <Card
      className={cn(
        "min-h-0 w-full min-w-0 max-w-full flex-1 border-0",
        className,
        classNames?.root
      )}
    >
      <CardContent
        className={cn(
          "w-full min-w-0 max-w-full space-y-4 overflow-hidden px-3!",
          "flex min-h-0 flex-1 flex-col",
          "pt-0",
          classNames?.content
        )}
      >
        <DataTableToolbar
          className={classNames?.toolbar}
          columns={columns}
          columnVisibility={columnVisibility}
          dateRangeFilter={dateRangeFilter}
          fileNamePrefix={exportFileNamePrefix}
          filters={filters}
          isFetching={isFetching}
          layout={toolbarLayout}
          onClearSelection={() => {
            setSelectedRowIds({});
          }}
          onColumnVisibilityChange={(columnId, isVisible) => {
            setColumnVisibility((currentState) => ({
              ...currentState,
              [columnId]: isVisible,
            }));
          }}
          onRefresh={onRefresh}
          onReset={resetTableState}
          onResetColumnSizes={() => {
            setColumnWidths(getInitialColumnWidths(columns));
          }}
          onResetColumnVisibility={() => {
            setColumnVisibility(
              Object.fromEntries(columns.map((column) => [column.id, true]))
            );
          }}
          onSearchValueChange={onSearchValueChange}
          rows={items}
          searchPlaceholder={searchPlaceholder}
          searchValue={searchValue}
          selectedRows={selectedRows}
          showSettingsMenu={enableSettingsMenu}
          toolbarEnd={toolbarEnd}
          toolbarFilterSummary={toolbarFilterSummary}
          toolbarFilters={toolbarFilters}
          toolbarStart={toolbarStart}
        />

        {errorMessage ? (
          <Alert variant="destructive">
            <AlertTitle>{errorTitle}</AlertTitle>
            <AlertDescription>{errorMessage}</AlertDescription>
            {onRetry ? (
              <AlertAction>
                <Button
                  onClick={onRetry}
                  size="sm"
                  type="button"
                  variant="outline"
                >
                  Retry
                </Button>
              </AlertAction>
            ) : null}
          </Alert>
        ) : null}

        <div
          className={cn(
            "flex w-full min-w-0 max-w-full flex-1 flex-col overflow-hidden border",
            classNames?.tableOuter
          )}
        >
          <div
            className={cn(
              "min-h-0 w-full min-w-0 max-w-full flex-1 overflow-auto overscroll-contain",
              classNames?.tableInner
            )}
          >
            <div
              className="flex min-h-full flex-col"
              style={showEmptyState ? { width: "100%" } : tableWidthStyle}
            >
              <SkeletonWrapper loading={false} name="server-data-table">
                <Table
                  className={cn("table-fixed", classNames?.table)}
                  style={tableWidthStyle}
                >
                  <colgroup>
                    {allColumns.map((column) => (
                      <col
                        key={column.id}
                        style={{
                          width: clampColumnWidth(
                            column,
                            columnWidths[column.id] ?? column.size ?? 160
                          ),
                        }}
                      />
                    ))}
                  </colgroup>
                  <TableHeader className="bg-muted [&_th]:sticky [&_th]:top-0 [&_th]:z-10 [&_th]:bg-muted">
                    <TableRow
                      className={cn(
                        "bg-muted hover:bg-muted",
                        classNames?.headerRow
                      )}
                    >
                      {/* biome-ignore lint/complexity/noExcessiveCognitiveComplexity: Header cells handle selection, sorting, and resize controls in one generic renderer. */}
                      {allColumns.map((column, columnIndex) => {
                        if (column.id === "__selection__") {
                          return (
                            <TableHead
                              className={cn(
                                "w-11 text-center",
                                classNames?.headerCell
                              )}
                              key={column.id}
                            >
                              <Checkbox
                                aria-label="Select all rows on this page"
                                checked={pageSelectionState}
                                onCheckedChange={(checked) => {
                                  const isChecked = checked === true;

                                  setSelectedRowIds((currentState) => {
                                    const nextState = { ...currentState };

                                    for (const rowId of allPageRowIds) {
                                      if (isChecked) {
                                        nextState[rowId] = true;
                                      } else {
                                        delete nextState[rowId];
                                      }
                                    }

                                    return nextState;
                                  });
                                }}
                              />
                            </TableHead>
                          );
                        }

                        const isSorted =
                          column.sortKey && filters.sortBy === column.sortKey;
                        let sortIcon = (
                          <IconSelector className="size-4 opacity-60" />
                        );

                        if (isSorted) {
                          sortIcon =
                            filters.sortOrder === "asc" ? (
                              <IconChevronUp className="size-4" />
                            ) : (
                              <IconChevronDown className="size-4" />
                            );
                        }
                        const nextSortState = column.sortKey
                          ? getNextSortState(
                              filters,
                              column.sortKey,
                              sortOptions
                            )
                          : null;
                        const isLastRenderedColumn =
                          columnIndex === allColumns.length - 1;
                        const canResizeColumn =
                          enableColumnResize &&
                          column.id !== "__selection__" &&
                          column.resizable !== false &&
                          !isLastRenderedColumn;

                        return (
                          <TableHead
                            className={cn(
                              "group/th relative overflow-visible pr-0",
                              column.align === "center" ? "text-center" : "",
                              column.align === "right" ? "text-right" : "",
                              column.headerClassName,
                              classNames?.headerCell
                            )}
                            key={column.id}
                            style={{
                              width: clampColumnWidth(
                                column,
                                columnWidths[column.id] ?? column.size ?? 160
                              ),
                            }}
                          >
                            <div
                              className={cn(
                                "relative flex h-8 min-w-0 items-center pr-3",
                                column.align === "center"
                                  ? "justify-center"
                                  : "",
                                column.align === "right" ? "justify-end" : ""
                              )}
                            >
                              {nextSortState ? (
                                <Button
                                  className={cn(
                                    "-ml-2 flex h-auto min-w-0 max-w-full items-center gap-1 px-2 py-1 font-medium text-sm",
                                    getSortButtonAlignmentClassName(
                                      column.align
                                    )
                                  )}
                                  onClick={() =>
                                    onSortChange(
                                      nextSortState.sortBy,
                                      nextSortState.sortOrder
                                    )
                                  }
                                  size="sm"
                                  type="button"
                                  variant="ghost"
                                >
                                  <span className="truncate">
                                    {column.label}
                                  </span>
                                  <span className="shrink-0">{sortIcon}</span>
                                </Button>
                              ) : (
                                <span className="block truncate pr-2">
                                  {column.label}
                                </span>
                              )}

                              {canResizeColumn ? (
                                <DataTableColumnResizer
                                  isResizing={
                                    activeResizingColumnId === column.id
                                  }
                                  onResizeStart={(event) =>
                                    handleResizeStart(column.id, event)
                                  }
                                />
                              ) : null}
                            </div>
                          </TableHead>
                        );
                      })}
                    </TableRow>
                  </TableHeader>
                  {showEmptyState ? null : (
                    <TableBody>
                      {showLoadingRows ? (
                        <DataTableSkeletonRows
                          columnCount={Math.max(allColumns.length, 1)}
                        />
                      ) : null}
                      {showLoadingRows
                        ? null
                        : items.map((row) => {
                            const rowId = getRowKey(row);
                            const rowNode = (
                              <TableRow
                                className={cn(
                                  enableRowSelection && selectedRowIds[rowId]
                                    ? "bg-muted/40"
                                    : "",
                                  renderRowContextMenu
                                    ? "cursor-context-menu"
                                    : "",
                                  classNames?.bodyRow
                                )}
                                key={rowId}
                              >
                                {allColumns.map((column) => {
                                  if (column.id === "__selection__") {
                                    return (
                                      <TableCell
                                        className={cn(
                                          "text-center",
                                          classNames?.bodyCell
                                        )}
                                        key={`${rowId}-${column.id}`}
                                      >
                                        <Checkbox
                                          aria-label={`Select row ${rowId}`}
                                          checked={
                                            selectedRowIds[rowId] === true
                                          }
                                          onCheckedChange={(checked) => {
                                            setSelectedRowIds(
                                              (currentState) => {
                                                const nextState = {
                                                  ...currentState,
                                                };

                                                if (checked === true) {
                                                  nextState[rowId] = true;
                                                } else {
                                                  delete nextState[rowId];
                                                }

                                                return nextState;
                                              }
                                            );
                                          }}
                                        />
                                      </TableCell>
                                    );
                                  }

                                  return (
                                    <TableCell
                                      className={cn(
                                        column.align === "center"
                                          ? "text-center"
                                          : "",
                                        column.align === "right"
                                          ? "text-right"
                                          : "",
                                        column.className,
                                        classNames?.bodyCell
                                      )}
                                      key={column.id}
                                      style={{
                                        width: clampColumnWidth(
                                          column,
                                          columnWidths[column.id] ??
                                            column.size ??
                                            160
                                        ),
                                      }}
                                    >
                                      {column.cell(row)}
                                    </TableCell>
                                  );
                                })}
                              </TableRow>
                            );

                            if (!renderRowContextMenu) {
                              return rowNode;
                            }

                            return (
                              <DataTableRowContextMenu
                                content={renderRowContextMenu(row)}
                                key={rowId}
                              >
                                {rowNode}
                              </DataTableRowContextMenu>
                            );
                          })}
                      {showLoadingRows || items.length > 0 ? null : (
                        <DataTableEmptyStateRow
                          colSpan={Math.max(allColumns.length, 1)}
                          imageAlt={emptyStateImageAlt}
                          imageSrc={emptyStateImageSrc}
                          message={emptyMessage}
                        />
                      )}
                    </TableBody>
                  )}
                </Table>
              </SkeletonWrapper>

              {showEmptyState ? (
                <div className="flex min-h-0 flex-1 items-center justify-center px-6 py-10">
                  <DataTableEmptyState
                    imageAlt={emptyStateImageAlt}
                    imageSrc={emptyStateImageSrc}
                    message={emptyMessage}
                  />
                </div>
              ) : (
                <div className="min-h-0 flex-1" />
              )}
            </div>
          </div>
        </div>
      </CardContent>

      <DataTablePagination
        className={cn("shrink-0", classNames?.footer)}
        isRouting={isRouting}
        itemCount={items.length}
        limit={filters.limit}
        offset={offset}
        onPageChange={onPageChange}
        onPageSizeChange={onPageSizeChange}
        onSortChange={onSortChange}
        page={filters.page}
        pageSizeOptions={pageSizeOptions}
        selectedCount={selectedCount}
        sortBy={filters.sortBy ?? null}
        sortOptions={sortOptions}
        sortOrder={filters.sortOrder}
        totalItems={totalItems}
        totalPages={totalPages}
      />
    </Card>
  );
}
