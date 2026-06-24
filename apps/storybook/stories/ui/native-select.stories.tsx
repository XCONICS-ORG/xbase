import type { Meta, StoryObj } from "@storybook/react";
import {
  NativeSelect,
  NativeSelectOptGroup,
  NativeSelectOption,
} from "@xbase/design-system/components/ui/native-select";

const meta: Meta<typeof NativeSelect> = {
  title: "UI/NativeSelect",
  component: NativeSelect,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <NativeSelect defaultValue="design-system">
      <NativeSelectOption value="design-system">Design system</NativeSelectOption>
      <NativeSelectOption value="env">Env</NativeSelectOption>
      <NativeSelectOption value="bucket">Bucket</NativeSelectOption>
    </NativeSelect>
  ),
};

export const SizesAndGroups: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-3">
      <NativeSelect defaultValue="web">
        <NativeSelectOptGroup label="Apps">
          <NativeSelectOption value="web">Web</NativeSelectOption>
          <NativeSelectOption value="storybook">Storybook</NativeSelectOption>
        </NativeSelectOptGroup>
        <NativeSelectOptGroup label="Packages">
          <NativeSelectOption value="design-system">Design system</NativeSelectOption>
          <NativeSelectOption value="env">Env</NativeSelectOption>
        </NativeSelectOptGroup>
      </NativeSelect>
      <NativeSelect defaultValue="sm" size="sm">
        <NativeSelectOption value="sm">Small</NativeSelectOption>
        <NativeSelectOption value="default">Default</NativeSelectOption>
      </NativeSelect>
      <NativeSelect disabled>
        <NativeSelectOption>Disabled</NativeSelectOption>
      </NativeSelect>
    </div>
  ),
};
