export type {
  BaseEntity,
  DataTableColumn,
  DataTableDateRangeFilter,
  DataTableDateRangeValue,
  DataTableFilters,
  DataTableSortOption,
  DataTableSortOrder,
  EntityId,
  SoftDeletedEntity,
  TimestampedEntity,
} from "@xbase/types/data/table";
// biome-ignore lint/performance/noBarrelFile: Compatibility facade for table constants.
export {
  DATA_TABLE_DEFAULT_COLUMN_MIN_SIZE,
  DATA_TABLE_DEFAULT_COLUMN_SIZE,
  DATA_TABLE_DEFAULT_PAGE_SIZES,
  DATA_TABLE_DEFAULT_SORT_BY_VALUE,
} from "@xbase/types/data/table";
