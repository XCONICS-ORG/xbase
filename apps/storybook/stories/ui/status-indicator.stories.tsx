import type { Meta, StoryObj } from "@storybook/react";
import { StatusIndicator } from "@xbase/design-system/components/ui/status-indicator";

const meta: Meta<typeof StatusIndicator> = {
  title: "UI/Status Indicator",
  component: StatusIndicator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  args: {
    label: "Operational",
    size: "md",
    state: "active",
  },
  argTypes: {
    size: {
      control: "inline-radio",
      options: ["sm", "md", "lg"],
    },
    state: {
      control: "inline-radio",
      options: ["active", "down", "fixing", "idle"],
    },
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const States: Story = {
  render: () => (
    <div className="grid gap-3">
      <StatusIndicator label="Active" state="active" />
      <StatusIndicator label="Down" state="down" />
      <StatusIndicator label="Fixing" state="fixing" />
      <StatusIndicator label="Idle" state="idle" />
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <StatusIndicator label="Small" size="sm" state="active" />
      <StatusIndicator label="Medium" size="md" state="active" />
      <StatusIndicator label="Large" size="lg" state="active" />
    </div>
  ),
};

export const CustomColor: Story = {
  args: {
    color: "#7c3aed",
    label: "Queued",
    state: "fixing",
  },
};
