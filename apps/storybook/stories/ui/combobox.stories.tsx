import type { Meta, StoryObj } from "@storybook/react";
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@xbase/design-system/components/ui/combobox";

const meta: Meta<typeof Combobox> = {
  title: "UI/Combobox",
  component: Combobox,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const options = [
  "@xbase/design-system",
  "@xbase/env",
  "@xbase/bucket",
  "@xbase/utility",
];

export const Default: Story = {
  render: () => (
    <Combobox items={options}>
      <ComboboxInput placeholder="Select package..." showClear />
      <ComboboxContent>
        <ComboboxEmpty>No package found.</ComboboxEmpty>
        <ComboboxList>
          <ComboboxGroup>
            <ComboboxLabel>Packages</ComboboxLabel>
            {options.map((option) => (
              <ComboboxItem key={option} value={option}>
                {option}
              </ComboboxItem>
            ))}
          </ComboboxGroup>
          <ComboboxSeparator />
          <ComboboxGroup>
            <ComboboxLabel>Apps</ComboboxLabel>
            <ComboboxItem value="web">Web</ComboboxItem>
            <ComboboxItem disabled value="docs">
              Docs removed
            </ComboboxItem>
          </ComboboxGroup>
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Combobox disabled items={options}>
      <ComboboxInput disabled placeholder="Disabled combobox" />
    </Combobox>
  ),
};
