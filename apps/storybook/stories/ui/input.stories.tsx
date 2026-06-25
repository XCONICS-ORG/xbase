import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@xbase/design-system/components/ui/input";

const meta: Meta<typeof Input> = {
  title: "UI/Input",
  component: Input,
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
    placeholder: "Workspace name",
  },
};

export const States: Story = {
  render: () => (
    <div className="grid w-[320px] gap-3">
      <Input defaultValue="xbase" />
      <Input disabled placeholder="Disabled" />
      <Input aria-invalid defaultValue="@xbase/docs" />
      <Input type="file" />
    </div>
  ),
};
