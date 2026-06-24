import type { Meta, StoryObj } from "@storybook/react";
import { ModeToggle } from "@xbase/design-system/components/modules/layout/mode-toggle";

const meta: Meta<typeof ModeToggle> = {
  title: "Actions/Layout/ModeToggle",
  component: ModeToggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
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

export const WithLabel: Story = {
  args: {
    buttonVariant: "outline",
    showLabel: true,
  },
};

export const Secondary: Story = {
  args: {
    buttonVariant: "secondary",
    showLabel: true,
  },
};
