"use client";

import { useQueryStates } from "@xbase/libs/nuqs";
import type {
  DataTableFilters,
  DataTableSortOrder,
} from "@xbase/types/data/table";
import {
  createElement,
  Fragment,
  useEffect,
  useState,
  useTransition,
} from "react";
import { DeletedRecordsSwitch } from "./deleted-records-switch";
import type { ServerDataTableProps } from "./server-data-table";

interface BaseTableQueryState<TSortField extends string> {
  limit: number;
  page: number;
  search: string | null;
  sortBy: TSortField | null;
  sortOrder: DataTableSortOrder;
}

const DEFAULT_SEARCH_DEBOUNCE_MS = 400;

type QueryStateSetter<TState> = (nextState: Partial<TState>) => void;
type TableStatePatch<TState, TSortField extends string> =
  | Partial<BaseTableQueryState<TSortField>>
  | Partial<TState>;

interface QueryBackedTableData<TItem> {
  items?: TItem[];
  offset?: number;
  totalItems?: number;
}

interface QueryBackedTableResult<TData, TError = unknown> {
  data?: TData;
  error?: TError | null;
  isFetching: boolean;
  isPending: boolean;
  refetch: () => Promise<unknown> | unknown;
}

type ServerDataTableConfig<TData, TSortField extends string> = Omit<
  ServerDataTableProps<TData, TSortField>,
  | "errorMessage"
  | "filters"
  | "getRowKey"
  | "isFetching"
  | "isPending"
  | "isRouting"
  | "items"
  | "offset"
  | "onPageChange"
  | "onPageSizeChange"
  | "onRefresh"
  | "onReset"
  | "onRetry"
  | "onSearchValueChange"
  | "onSortChange"
  | "searchValue"
  | "totalItems"
  | "totalPages"
> & {
  deletedRecordsEmptyMessage?: string;
  deletedRecordsFilterLabel?: string;
  dateRangeFilterFromKey?: string;
  dateRangeFilterLabel?: string;
  dateRangeFilterPlaceholder?: string;
  dateRangeFilterToKey?: string;
  enableDateRangeFilter?: boolean;
  enableDeletedRecordsFilter?: boolean;
};

export interface ServerDataTableStateResult<
  TFilters extends DataTableFilters<TSortField>,
  TSortField extends string,
  TState extends BaseTableQueryState<TSortField>,
> {
  filters: TFilters;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (limit: number) => void;
  handleReset: () => void;
  handleSortChange: (
    sortBy: TSortField | null,
    sortOrder: DataTableSortOrder
  ) => void;
  isRouting: boolean;
  searchValue: string;
  setSearchValue: (value: string) => void;
  updateQueryState: (nextState: TableStatePatch<TState, TSortField>) => void;
}

export function useServerDataTableState<
  TFilters extends DataTableFilters<TSortField>,
  TSortField extends string,
  TState extends BaseTableQueryState<TSortField>,
>({
  defaultState,
  params,
  parse,
  searchDebounceMs = DEFAULT_SEARCH_DEBOUNCE_MS,
}: {
  defaultState: TState;
  params: Record<string, unknown>;
  parse: (input: Partial<TState>) => TFilters;
  searchDebounceMs?: number;
}) {
  const [queryState, setQueryState] = useQueryStates(params as never, {
    history: "push",
    scroll: false,
  }) as unknown as [Partial<TState>, QueryStateSetter<TState>];
  const [searchInput, setSearchInput] = useState(queryState.search ?? "");
  const [isRouting, startRoutingTransition] = useTransition();

  const filters = parse(queryState as Partial<TState>);

  useEffect(() => {
    setSearchInput(queryState.search ?? "");
  }, [queryState.search]);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      const normalizedSearch = searchInput.trim();
      const nextSearch = normalizedSearch.length > 0 ? normalizedSearch : null;

      if (nextSearch === (queryState.search ?? null)) {
        return;
      }

      startRoutingTransition(() => {
        setQueryState({
          search: nextSearch,
          page: 1,
        } as Partial<TState>);
      });
    }, searchDebounceMs);

    return () => {
      window.clearTimeout(timeout);
    };
  }, [queryState.search, searchDebounceMs, searchInput, setQueryState]);

  const updateQueryState = (nextState: TableStatePatch<TState, TSortField>) => {
    startRoutingTransition(() => {
      setQueryState(nextState as Partial<TState>);
    });
  };

  const handleSortChange = (
    sortBy: TSortField | null,
    sortOrder: DataTableSortOrder
  ) => {
    updateQueryState({
      sortBy,
      sortOrder,
      page: 1,
    });
  };

  const handlePageChange = (page: number) => {
    updateQueryState({ page });
  };

  const handlePageSizeChange = (limit: number) => {
    updateQueryState({ limit, page: 1 });
  };

  const handleReset = () => {
    updateQueryState(defaultState);
  };

  return {
    filters,
    isRouting,
    searchValue: searchInput,
    setSearchValue: setSearchInput,
    updateQueryState,
    handlePageChange,
    handlePageSizeChange,
    handleReset,
    handleSortChange,
  } satisfies ServerDataTableStateResult<TFilters, TSortField, TState>;
}

export function useServerQueryDataTable<
  TFilters extends DataTableFilters<TSortField>,
  TSortField extends string,
  TState extends BaseTableQueryState<TSortField>,
  TItem,
  TQueryData extends QueryBackedTableData<TItem>,
  TError = unknown,
>({
  config,
  getErrorMessage,
  getRowKey,
  query,
  tableState,
}: {
  config: ServerDataTableConfig<TItem, TSortField>;
  getErrorMessage?: (error: TError) => string | undefined;
  getRowKey: (row: TItem) => string;
  query: QueryBackedTableResult<TQueryData, TError>;
  tableState: ServerDataTableStateResult<TFilters, TSortField, TState>;
}) {
  const items = query.data?.items ?? [];
  const totalItems = query.data?.totalItems ?? 0;
  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / tableState.filters.limit)
  );
  const currentPage = tableState.filters.page;
  const handlePageChange = tableState.handlePageChange;
  const refetch = query.refetch;
  const deletedRecordsEnabled = config.enableDeletedRecordsFilter === true;
  const dateRangeFilterEnabled = config.enableDateRangeFilter === true;
  const dateRangeFilterFromKey = config.dateRangeFilterFromKey ?? "dateFrom";
  const dateRangeFilterToKey = config.dateRangeFilterToKey ?? "dateTo";
  const tableFilters = tableState.filters as DataTableFilters<TSortField> &
    Record<string, unknown>;
  const deletedRecordsChecked = Boolean(
    (
      tableFilters as DataTableFilters<TSortField> & {
        isDeleted?: boolean | null;
      }
    ).isDeleted
  );
  const dateRangeFilter = dateRangeFilterEnabled
    ? {
        disabled: query.isFetching,
        startDate:
          typeof tableFilters[dateRangeFilterFromKey] === "string"
            ? tableFilters[dateRangeFilterFromKey]
            : null,
        label: config.dateRangeFilterLabel,
        onChange: ({
          startDate,
          endDate,
        }: {
          startDate: string | null;
          endDate: string | null;
        }) => {
          tableState.updateQueryState({
            [dateRangeFilterFromKey]: startDate,
            [dateRangeFilterToKey]: endDate,
            page: 1,
          } as unknown as Partial<TState>);
        },
        placeholder: config.dateRangeFilterPlaceholder,
        endDate:
          typeof tableFilters[dateRangeFilterToKey] === "string"
            ? tableFilters[dateRangeFilterToKey]
            : null,
      }
    : undefined;
  const deletedRecordsSwitch = deletedRecordsEnabled
    ? createElement(DeletedRecordsSwitch, {
        checked: deletedRecordsChecked,
        disabled: query.isFetching,
        label: config.deletedRecordsFilterLabel,
        onCheckedChange: (checked: boolean) => {
          tableState.updateQueryState({
            isDeleted: checked ? true : null,
            page: 1,
          } as unknown as Partial<TState>);
        },
      })
    : null;
  const toolbarEnd =
    deletedRecordsSwitch && config.toolbarEnd
      ? createElement(Fragment, null, deletedRecordsSwitch, config.toolbarEnd)
      : (deletedRecordsSwitch ?? config.toolbarEnd);

  useEffect(() => {
    if (!query.data) {
      return;
    }

    if (items.length > 0 || currentPage <= 1 || currentPage <= totalPages) {
      return;
    }

    handlePageChange(totalPages);
  }, [currentPage, handlePageChange, items.length, query.data, totalPages]);

  return {
    query,
    tableProps: {
      ...config,
      emptyMessage:
        deletedRecordsChecked && config.deletedRecordsEmptyMessage
          ? config.deletedRecordsEmptyMessage
          : config.emptyMessage,
      errorMessage: query.error ? getErrorMessage?.(query.error) : undefined,
      filters: tableState.filters,
      dateRangeFilter,
      getRowKey,
      isFetching: query.isFetching,
      isPending: query.isPending,
      isRouting: tableState.isRouting,
      items,
      offset: query.data?.offset,
      onPageChange: handlePageChange,
      onPageSizeChange: tableState.handlePageSizeChange,
      onRefresh: () => {
        refetch();
      },
      onReset: tableState.handleReset,
      onRetry: () => {
        refetch();
      },
      onSearchValueChange: tableState.setSearchValue,
      onSortChange: tableState.handleSortChange,
      searchValue: tableState.searchValue,
      totalItems,
      totalPages,
      toolbarEnd,
    } satisfies ServerDataTableProps<TItem, TSortField>,
    tableState,
  };
}
