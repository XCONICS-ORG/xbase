import type { Meta, StoryObj } from "@storybook/react";
import { UserNavDropdown } from "@xbase/design-system/components/modules/layout/header";
import {
  IconHelpCircle,
  IconSettings,
  IconUserCircle,
} from "@xbase/icons/tabler";

const meta: Meta<typeof UserNavDropdown> = {
  title: "Actions/Layout/Header/UserNavDropdown",
  component: UserNavDropdown,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    avatarStyle: "identicon",
    menuItems: [
      {
        id: "account",
        icon: <IconUserCircle className="size-4" />,
        label: "Account",
        onSelect: () => undefined,
      },
      {
        id: "settings",
        icon: <IconSettings className="size-4" />,
        label: "Settings",
        onSelect: () => undefined,
      },
      {
        id: "support",
        icon: <IconHelpCircle className="size-4" />,
        label: "Support",
        onSelect: () => undefined,
      },
    ],
    onLogout: () => undefined,
    user: {
      email: "suman@example.com",
      name: "Suman Mondal",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const NoEmail: Story = {
  args: {
    avatarStyle: "identicon",
    user: {
      name: "Suman Mondal",
    },
  },
};

export const ShapeGridVariant: Story = {
  args: {
    avatarStyle: "shapegrid",
  },
};

export const Loading: Story = {
  args: {
    user: null,
  },
};
