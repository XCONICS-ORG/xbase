import type { Meta, StoryObj } from "@storybook/react";
import { ModeToggle } from "@turtle/design-system/components/mode-toggle";

const meta: Meta<typeof ModeToggle> = {
  title: "Actions/ModeToggle",
  component: ModeToggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
