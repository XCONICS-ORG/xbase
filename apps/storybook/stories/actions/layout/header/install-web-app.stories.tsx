import type { Meta, StoryObj } from "@storybook/react";
import { InstallWebApp } from "@xbase/design-system/components/modules/layout/header";

const meta: Meta<typeof InstallWebApp> = {
  title: "Actions/Layout/Header/InstallWebApp",
  component: InstallWebApp,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    onInstall: () => undefined,
  },
  argTypes: {
    buttonVariant: {
      control: "select",
      options: ["ghost", "outline", "secondary"],
    },
    showLabel: {
      control: "boolean",
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const IconOnly: Story = {
  args: {
    showLabel: false,
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};
