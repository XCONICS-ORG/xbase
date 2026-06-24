import type { Meta, StoryObj } from "@storybook/react";
import { QuickActionDropdown } from "@xbase/design-system/components/modules/layout/header";
import { IconBuilding, IconListDetails, IconShield, IconUsers } from "@xbase/icons/tabler";

const actions = [
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
    id: "properties",
    icon: <IconListDetails className="size-5" />,
    label: "View Properties",
    description: "Assigned property listings",
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

const meta: Meta<typeof QuickActionDropdown> = {
  title: "Actions/Layout/Header/QuickActionDropdown",
  component: QuickActionDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    actions,
  },
  argTypes: {
    buttonVariant: {
      control: "select",
      options: ["ghost", "outline", "secondary"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const CompactLabel: Story = {
  args: {
    label: "Actions",
  },
};

export const Outline: Story = {
  args: {
    buttonVariant: "outline",
  },
};
