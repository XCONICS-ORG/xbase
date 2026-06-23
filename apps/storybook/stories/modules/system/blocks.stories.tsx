import type { Meta, StoryObj } from "@storybook/react";
import {
  ComingSoonBlock,
  DataNotFoundBlock,
} from "@turtle/design-system/components/modules/system/blocks";

const meta: Meta<typeof ComingSoonBlock> = {
  title: "Modules/System/Blocks",
  component: ComingSoonBlock,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const ComingSoon: Story = {
  render: () => <ComingSoonBlock className="min-h-[420px]" />,
};

export const DataNotFound: Story = {
  render: () => (
    <DataNotFoundBlock
      className="min-h-[420px]"
      description="There is no data available for this view yet."
      onAction={() => undefined}
      title="No Data Found"
    />
  ),
};
