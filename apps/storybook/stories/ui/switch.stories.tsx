import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@xbase/design-system/components/ui/label";
import { Switch } from "@xbase/design-system/components/ui/switch";

const meta: Meta<typeof Switch> = {
  title: "UI/Switch",
  component: Switch,
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
      <Switch id="sync" />
      <Label htmlFor="sync">Auto sync</Label>
    </div>
  ),
};

export const StatesAndSizes: Story = {
  render: () => (
    <div className="grid gap-3">
      <div className="flex items-center gap-2">
        <Switch defaultChecked id="default-switch" />
        <Label htmlFor="default-switch">Default checked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch id="small-switch" size="sm" />
        <Label htmlFor="small-switch">Small unchecked</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch disabled id="disabled-switch" />
        <Label htmlFor="disabled-switch">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <Switch aria-invalid id="invalid-switch" />
        <Label htmlFor="invalid-switch">Invalid</Label>
      </div>
    </div>
  ),
};
