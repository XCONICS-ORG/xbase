import type { Meta, StoryObj } from "@storybook/react";
import { PingIndicator } from "@xbase/design-system/components/modules/layout/header";

const meta: Meta<typeof PingIndicator> = {
  title: "Actions/Layout/Header/PingIndicator",
  component: PingIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  argTypes: {
    latencyMs: {
      control: "number",
    },
    showLabel: {
      control: "boolean",
    },
    status: {
      control: "select",
      options: ["disconnected", "excellent", "good", "poor"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    latencyMs: 132,
  },
};

export const Good: Story = {
  args: {
    latencyMs: 744,
  },
};

export const Poor: Story = {
  args: {
    latencyMs: 1140,
  },
};

export const IconOnly: Story = {
  args: {
    latencyMs: 132,
    showLabel: false,
  },
};

export const Disconnected: Story = {
  args: {
    latencyMs: null,
  },
};
