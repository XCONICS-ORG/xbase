import type { Meta, StoryObj } from "@storybook/react";
import { Checkbox } from "@xbase/design-system/components/ui/checkbox";
import { Label } from "@xbase/design-system/components/ui/label";

const meta: Meta<typeof Checkbox> = {
  title: "UI/Checkbox",
  component: Checkbox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Checkbox id="terms" />
      <Label htmlFor="terms">Accept workspace terms</Label>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Checkbox id="checked" defaultChecked />
        <Label htmlFor="checked">Checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="unchecked" />
        <Label htmlFor="unchecked">Unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox id="disabled" disabled />
        <Label htmlFor="disabled">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Checkbox aria-invalid id="invalid" />
        <Label htmlFor="invalid">Invalid</Label>
      </div>
    </div>
  ),
};
