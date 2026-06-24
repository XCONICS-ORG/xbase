import type { Meta, StoryObj } from "@storybook/react";
import { FullscreenToggle } from "@xbase/design-system/components/modules/layout/header";

const meta: Meta<typeof FullscreenToggle> = {
  title: "Actions/Layout/Header/FullscreenToggle",
  component: FullscreenToggle,
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

export const IconOnly: Story = {
  args: {
    showLabel: false,
  },
};

export const Outline: Story = {
  args: {
    buttonVariant: "outline",
  },
};
