import type { Meta, StoryObj } from "@storybook/react";
import { Input } from "@xbase/design-system/components/ui/input";
import { Label } from "@xbase/design-system/components/ui/label";

const meta: Meta<typeof Label> = {
  title: "UI/Label",
  component: Label,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="grid w-[320px] gap-2">
      <Label htmlFor="label-input">Package name</Label>
      <Input id="label-input" placeholder="@xbase/design-system" />
    </div>
  ),
};

export const RequiredAndDisabled: Story = {
  render: () => (
    <div className="grid w-[320px] gap-4">
      <div className="grid gap-2">
        <Label htmlFor="required-input">
          Workspace name <span className="text-destructive">*</span>
        </Label>
        <Input id="required-input" defaultValue="xbase" />
      </div>
      <div className="grid gap-2 opacity-50">
        <Label htmlFor="disabled-input">Disabled label</Label>
        <Input disabled id="disabled-input" placeholder="Disabled" />
      </div>
    </div>
  ),
};
