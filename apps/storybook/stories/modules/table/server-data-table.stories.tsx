import type { Meta, StoryObj } from "@storybook/react";
import {
  ActionSwitcher,
  CopyShell,
  DataTableCellAction,
  type DataTableColumn,
  type DataTableFilters,
  type DataTableSortOption,
  type DataTableSortOrder,
  ServerDataTable,
} from "@xbase/design-system/components/modules/table";
import { Badge } from "@xbase/design-system/components/ui/badge";
import { Button } from "@xbase/design-system/components/ui/button";
import {
  IconArchive,
  IconEdit,
  IconFilter,
  IconTrash,
} from "@xbase/icons/tabler";
import { useMemo, useState } from "react";

type UserSortField = "createdAt" | "email" | "name" | "status";

interface UserRecord {
  createdAt: string;
  email: string;
  id: string;
  name: string;
  role: string;
  status: "Active" | "Invited" | "Suspended";
}

const users: UserRecord[] = [
  {
    createdAt: "2026-06-10",
    email: "aarya@example.com",
    id: "usr_1001",
    name: "Aarya Shah",
    role: "Admin",
    status: "Active",
  },
  {
    createdAt: "2026-06-12",
    email: "benjamin@example.com",
    id: "usr_1002",
    name: "Benjamin Lee",
    role: "Manager",
    status: "Invited",
  },
  {
    createdAt: "2026-06-16",
    email: "chitra@example.com",
    id: "usr_1003",
    name: "Chitra Iyer",
    role: "Editor",
    status: "Active",
  },
  {
    createdAt: "2026-06-18",
    email: "dion@example.com",
    id: "usr_1004",
    name: "Dion Martin",
    role: "Viewer",
    status: "Suspended",
  },
];

const sortOptions: DataTableSortOption<UserSortField>[] = [
  { label: "Created date", value: "createdAt", initialOrder: "desc" },
  { label: "Name", value: "name" },
  { label: "Email", value: "email" },
  { label: "Status", value: "status" },
];

const createUserActions = (row: UserRecord) => [
  {
    id: "edit",
    icon: <IconEdit />,
    label: `Edit ${row.name}`,
    onClick: () => undefined,
  },
  {
    id: "archive",
    icon: <IconArchive />,
    label: `Archive ${row.name}`,
    onClick: () => undefined,
  },
  {
    id: "delete",
    icon: <IconTrash />,
    label: `Delete ${row.name}`,
    onClick: () => undefined,
    variant: "delete" as const,
  },
];

const createColumns = (
  actionShowType: "dropdown" | "inline" = "dropdown"
): DataTableColumn<UserRecord, UserSortField>[] => [
  {
    id: "id",
    label: "ID",
    cell: (row) => <CopyShell value={row.id} />,
    exportValue: (row) => row.id,
    sortKey: "createdAt",
    size: 160,
  },
  {
    id: "name",
    label: "Name",
    cell: (row) => (
      <div className="min-w-0">
        <div className="truncate font-medium">{row.name}</div>
        <div className="truncate text-muted-foreground text-xs">
          {row.email}
        </div>
      </div>
    ),
    exportValue: (row) => row.name,
    sortKey: "name",
    size: 220,
  },
  {
    id: "role",
    label: "Role",
    cell: (row) => <Badge variant="secondary">{row.role}</Badge>,
    size: 128,
  },
  {
    id: "status",
    label: "Status",
    cell: (row) => (
      <ActionSwitcher
        checked={row.status === "Active"}
        disabled={row.status === "Suspended"}
        inactiveLabel={row.status}
        onCheckedChange={() => undefined}
      />
    ),
    exportValue: (row) => row.status,
    sortKey: "status",
    size: 160,
  },
  {
    id: "createdAt",
    label: "Created",
    cell: (row) => row.createdAt,
    sortKey: "createdAt",
    size: 132,
  },
  {
    id: "actions",
    label: "Actions",
    align: "right",
    cell: (row) => (
      <DataTableCellAction
        actions={createUserActions(row)}
        align="right"
        showType={actionShowType}
      />
    ),
    exportable: false,
    hideable: false,
    maxSize: 120,
    minSize: 92,
    size: 104,
  },
];

const defaultFilters: DataTableFilters<UserSortField> = {
  limit: 10,
  page: 1,
  search: null,
  sortBy: "createdAt",
  sortOrder: "desc",
};

interface TablePreviewProps {
  actionShowType?: "dropdown" | "inline";
  enableDateRangeFilter?: boolean;
  enableRowContextMenu?: boolean;
  enableRowSelection?: boolean;
  errorMessage?: string;
  isFetching?: boolean;
  isPending?: boolean;
  items?: UserRecord[];
  toolbarLayout?: "default" | "stacked";
  withToolbarEnd?: boolean;
}

function TablePreview({
  actionShowType = "dropdown",
  enableDateRangeFilter = false,
  enableRowContextMenu = true,
  enableRowSelection = false,
  errorMessage,
  isFetching = false,
  isPending = false,
  items = users,
  toolbarLayout = "default",
  withToolbarEnd = false,
}: TablePreviewProps) {
  const [filters, setFilters] = useState(defaultFilters);
  const [searchValue, setSearchValue] = useState("");
  const [dateRange, setDateRange] = useState({
    endDate: "2026-06-24" as string | null,
    startDate: "2026-06-01" as string | null,
  });
  const columns = useMemo(
    () => createColumns(actionShowType),
    [actionShowType]
  );

  const handleSortChange = (
    sortBy: UserSortField | null,
    sortOrder: DataTableSortOrder
  ) => {
    setFilters((current) => ({ ...current, page: 1, sortBy, sortOrder }));
  };

  return (
    <div className="w-[min(1180px,calc(100vw-3rem))]">
      <ServerDataTable
        columns={columns}
        dateRangeFilter={
          enableDateRangeFilter
            ? {
                ...dateRange,
                label: "Created date",
                onChange: setDateRange,
                placeholder: "Created date",
              }
            : undefined
        }
        description="Reusable server-driven table shell for app modules."
        enableRowSelection={enableRowSelection}
        errorMessage={errorMessage}
        exportFileNamePrefix="storybook-users"
        filters={filters}
        getRowKey={(row) => row.id}
        isFetching={isFetching}
        isPending={isPending}
        items={items}
        onPageChange={(page) => setFilters((current) => ({ ...current, page }))}
        onPageSizeChange={(limit) =>
          setFilters((current) => ({ ...current, limit, page: 1 }))
        }
        onRefresh={() => undefined}
        onReset={() => {
          setFilters(defaultFilters);
          setSearchValue("");
        }}
        onSearchValueChange={setSearchValue}
        onSortChange={handleSortChange}
        renderRowContextMenu={
          enableRowContextMenu
            ? (row) => (
                <DataTableCellAction
                  actions={createUserActions(row)}
                  align="left"
                  showType="context-menu"
                />
              )
            : undefined
        }
        searchPlaceholder="Search users"
        searchValue={searchValue}
        sortOptions={sortOptions}
        title="Users"
        toolbarEnd={
          withToolbarEnd ? (
            <Button leftIcon={<IconFilter />} type="button" variant="outline">
              More filters
            </Button>
          ) : undefined
        }
        toolbarLayout={toolbarLayout}
        totalItems={items.length}
        totalPages={1}
      />
    </div>
  );
}

const meta: Meta<typeof ServerDataTable> = {
  title: "Modules/ServerDataTable",
  component: ServerDataTable,
  tags: ["autodocs"],
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <TablePreview />,
};

export const StackedToolbar: Story = {
  render: () => (
    <TablePreview
      enableDateRangeFilter
      toolbarLayout="stacked"
      withToolbarEnd
    />
  ),
};

export const RowSelectionAndInlineActions: Story = {
  render: () => <TablePreview actionShowType="inline" enableRowSelection />,
};

export const WithoutRowContextMenu: Story = {
  render: () => <TablePreview enableRowContextMenu={false} />,
};

export const Loading: Story = {
  render: () => <TablePreview isFetching isPending items={[]} />,
};

export const ErrorState: Story = {
  render: () => (
    <TablePreview errorMessage="The demo API returned a simulated error." />
  ),
};

export const Empty: Story = {
  render: () => <TablePreview items={[]} />,
};
