import type { Meta, StoryObj } from "@storybook/react";
import { Slider } from "@xbase/design-system/components/ui/slider";

const meta: Meta<typeof Slider> = {
  title: "UI/Slider",
  component: Slider,
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
    defaultValue: [40],
    max: 100,
    step: 1,
  },
};

export const Range: Story = {
  render: () => (
    <div className="grid w-[320px] gap-6">
      <Slider defaultValue={[25]} max={100} step={1} />
      <Slider defaultValue={[20, 80]} max={100} step={1} />
      <Slider defaultValue={[30]} disabled max={100} step={1} />
    </div>
  ),
};
