import type { Meta, StoryObj } from "@storybook/react";
import {
  AppHeader,
  type HeaderOrganization,
} from "@xbase/design-system/components/modules/layout/header";
import { Logo } from "@xbase/design-system/components/shared/logo";
import {
  IconBuilding,
  IconListDetails,
  IconShield,
  IconUserCircle,
  IconUsers,
} from "@xbase/icons/tabler";
import { useState } from "react";

const organizations: HeaderOrganization[] = [
  { id: "org-xbase", name: "Xbase Systems" },
  { id: "org-north", name: "Northwind Operations" },
  { id: "org-acme", name: "Acme Field Services" },
];
const defaultOrganizationId = "org-xbase";

const quickActions = [
  {
    id: "members",
    icon: <IconUsers className="size-5" />,
    label: "Manage Members",
    description: "Company member access",
    onSelect: () => undefined,
  },
  {
    id: "directory",
    icon: <IconBuilding className="size-5" />,
    label: "Company Directory",
    description: "Open organization records",
    onSelect: () => undefined,
  },
  {
    id: "roles",
    icon: <IconShield className="size-5" />,
    label: "Role Control",
    description: "Roles and permission rules",
    onSelect: () => undefined,
  },
];

function HeaderPreview({ compact = false }: { compact?: boolean }) {
  const [activeOrganizationId, setActiveOrganizationId] = useState(defaultOrganizationId);

  return (
    <div className="min-h-64 w-[min(1180px,calc(100vw-3rem))] overflow-hidden border bg-muted/20">
      <AppHeader
        brand={<Logo className="w-28" href={undefined} priority variant="text" />}
        fixed={false}
        fullscreenToggleProps={{ showLabel: !compact }}
        installWebAppProps={{
          onInstall: () => undefined,
          showLabel: !compact,
        }}
        modeToggleProps={{ showLabel: !compact }}
        orgSwitcherProps={{
          activeOrganizationId,
          onAddOrganization: () => undefined,
          onOrganizationChange: (organization) => setActiveOrganizationId(organization.id),
          organizations,
        }}
        pingIndicatorProps={{
          latencyMs: 128,
          showLabel: !compact,
        }}
        quickActionDropdownProps={{
          actions: quickActions,
          label: compact ? "Actions" : "Quick Actions",
        }}
        userNavDropdownProps={{
          menuItems: [
            {
              id: "account",
              icon: <IconUserCircle className="size-4" />,
              label: "Account",
              onSelect: () => undefined,
            },
            {
              id: "activity",
              icon: <IconListDetails className="size-4" />,
              label: "Activity",
              onSelect: () => undefined,
            },
          ],
          onLogout: () => undefined,
          user: {
            email: "suman@example.com",
            name: "Suman Mondal",
          },
        }}
      />
      <div className="p-6 text-muted-foreground text-sm">
        Header actions are rendered in the same shell used by app layouts.
      </div>
    </div>
  );
}

const meta: Meta<typeof AppHeader> = {
  title: "Actions/Layout/Header/AppHeader",
  component: AppHeader,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => <HeaderPreview />,
};

export const CompactActions: Story = {
  render: () => <HeaderPreview compact />,
};
