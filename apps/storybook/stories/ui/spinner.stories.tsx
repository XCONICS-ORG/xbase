import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "@turtle/design-system/components/ui/spinner";

const meta: Meta<typeof Spinner> = {
  title: "UI/Spinner",
  component: Spinner,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};
