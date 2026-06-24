import type { Meta, StoryObj } from "@storybook/react";
import { Toggle } from "@xbase/design-system/components/ui/toggle";
import { IconBold, IconItalic, IconUnderline } from "@xbase/icons/tabler";

const meta: Meta<typeof Toggle> = {
  title: "UI/Toggle",
  component: Toggle,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Toggle aria-label="Toggle bold">
      <IconBold />
    </Toggle>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Default toggle">
        <IconBold />
      </Toggle>
      <Toggle aria-label="Outline toggle" variant="outline">
        <IconItalic />
      </Toggle>
      <Toggle aria-label="Pressed toggle" defaultPressed variant="outline">
        <IconUnderline />
      </Toggle>
      <Toggle aria-label="Disabled toggle" disabled variant="outline">
        <IconBold />
      </Toggle>
    </div>
  ),
};

export const Sizes: Story = {
  render: () => (
    <div className="flex items-center gap-2">
      <Toggle aria-label="Small bold" size="sm" variant="outline">
        <IconBold />
      </Toggle>
      <Toggle aria-label="Default italic" variant="outline">
        <IconItalic />
      </Toggle>
      <Toggle aria-label="Large underline" size="lg" variant="outline">
        <IconUnderline />
      </Toggle>
    </div>
  ),
};
