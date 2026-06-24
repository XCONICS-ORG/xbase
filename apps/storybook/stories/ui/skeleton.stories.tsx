import type { Meta, StoryObj } from "@storybook/react";
import { Skeleton } from "@xbase/design-system/components/ui/skeleton";

const meta: Meta<typeof Skeleton> = {
  title: "UI/Skeleton",
  component: Skeleton,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex w-[360px] items-center gap-3">
      <Skeleton className="size-10 rounded-full" />
      <div className="grid flex-1 gap-2">
        <Skeleton className="h-3 w-2/3" />
        <Skeleton className="h-3 w-full" />
      </div>
    </div>
  ),
};

export const CardLoading: Story = {
  render: () => (
    <div className="grid w-[360px] gap-3 rounded-lg border p-4">
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-24 w-full" />
      <div className="flex justify-end gap-2">
        <Skeleton className="h-7 w-16" />
        <Skeleton className="h-7 w-20" />
      </div>
    </div>
  ),
};
