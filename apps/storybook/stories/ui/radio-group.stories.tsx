import type { Meta, StoryObj } from "@storybook/react";
import { Label } from "@xbase/design-system/components/ui/label";
import {
  RadioGroup,
  RadioGroupItem,
} from "@xbase/design-system/components/ui/radio-group";

const meta: Meta<typeof RadioGroup> = {
  title: "UI/RadioGroup",
  component: RadioGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <RadioGroup defaultValue="comfortable">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="compact" value="compact" />
        <Label htmlFor="compact">Compact</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="comfortable" value="comfortable" />
        <Label htmlFor="comfortable">Comfortable</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem id="spacious" value="spacious" />
        <Label htmlFor="spacious">Spacious</Label>
      </div>
    </RadioGroup>
  ),
};

export const States: Story = {
  render: () => (
    <RadioGroup defaultValue="enabled">
      <div className="flex items-center gap-2">
        <RadioGroupItem id="enabled" value="enabled" />
        <Label htmlFor="enabled">Enabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem disabled id="disabled-radio" value="disabled" />
        <Label htmlFor="disabled-radio">Disabled</Label>
      </div>
      <div className="flex items-center gap-2">
        <RadioGroupItem aria-invalid id="invalid-radio" value="invalid" />
        <Label htmlFor="invalid-radio">Invalid</Label>
      </div>
    </RadioGroup>
  ),
};
