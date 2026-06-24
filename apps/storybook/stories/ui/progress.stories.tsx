import type { Meta, StoryObj } from "@storybook/react";
import { Progress } from "@xbase/design-system/components/ui/progress";

const meta: Meta<typeof Progress> = {
  title: "UI/Progress",
  component: Progress,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "w-[320px]",
    value: 64,
  },
};

export const Values: Story = {
  render: () => (
    <div className="grid w-[320px] gap-3">
      <Progress value={15} />
      <Progress value={50} />
      <Progress value={85} />
    </div>
  ),
};
