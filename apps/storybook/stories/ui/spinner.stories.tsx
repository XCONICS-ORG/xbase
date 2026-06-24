import type { Meta, StoryObj } from "@storybook/react";
import { Spinner } from "@xbase/design-system/components/ui/spinner";

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

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-4">
      <Spinner className="size-3" />
      <Spinner />
      <Spinner className="size-5" />
      <Spinner className="size-6" />
    </div>
  ),
};
