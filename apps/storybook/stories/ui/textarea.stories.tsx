import type { Meta, StoryObj } from "@storybook/react";
import { Textarea } from "@xbase/design-system/components/ui/textarea";

const meta: Meta<typeof Textarea> = {
  title: "UI/Textarea",
  component: Textarea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    className: "w-[360px]",
    placeholder: "Write a note...",
  },
};

export const States: Story = {
  render: () => (
    <div className="grid w-[360px] gap-3">
      <Textarea defaultValue="Storybook examples document every available state." />
      <Textarea disabled placeholder="Disabled" />
      <Textarea aria-invalid defaultValue="This message needs review." />
    </div>
  ),
};
