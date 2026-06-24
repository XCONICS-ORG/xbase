import type { Meta, StoryObj } from "@storybook/react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@xbase/design-system/components/ui/select";

const fruits = [
  { label: "Apple", value: "apple" },
  { label: "Banana", value: "banana" },
  { label: "Blueberry", value: "blueberry" },
  { label: "Grapes", value: "grapes" },
  { label: "Pineapple", value: "pineapple" },
];

const timezones = [
  {
    label: "North America",
    items: [
      { label: "Eastern Standard Time", value: "est" },
      { label: "Central Standard Time", value: "cst" },
      { label: "Mountain Standard Time", value: "mst" },
      { label: "Pacific Standard Time", value: "pst" },
    ],
  },
  {
    label: "Europe",
    items: [
      { label: "Greenwich Mean Time", value: "gmt" },
      { label: "Central European Time", value: "cet" },
      { label: "Eastern European Time", value: "eet" },
    ],
  },
];

const meta: Meta<typeof Select> = {
  title: "UI/Select",
  component: Select,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        {fruits.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const WithValue: Story = {
  render: () => (
    <Select defaultValue="banana">
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        {fruits.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Small: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-40" size="sm">
        <SelectValue placeholder="Small select" />
      </SelectTrigger>
      <SelectContent>
        {fruits.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Disabled: Story = {
  render: () => (
    <Select disabled>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Disabled" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const WithDisabledItem: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Select a fruit" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="apple">Apple</SelectItem>
        <SelectItem disabled value="banana">
          Banana
        </SelectItem>
        <SelectItem value="blueberry">Blueberry</SelectItem>
      </SelectContent>
    </Select>
  ),
};

export const Grouped: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-64">
        <SelectValue placeholder="Select a timezone" />
      </SelectTrigger>
      <SelectContent>
        {timezones.map((group, index) => (
          <SelectGroup key={group.label}>
            <SelectLabel>{group.label}</SelectLabel>
            {group.items.map((item) => (
              <SelectItem key={item.value} value={item.value}>
                {item.label}
              </SelectItem>
            ))}
            {index < timezones.length - 1 ? <SelectSeparator /> : null}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const PopperPosition: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-44">
        <SelectValue placeholder="Popper content" />
      </SelectTrigger>
      <SelectContent position="popper">
        {fruits.map((fruit) => (
          <SelectItem key={fruit.value} value={fruit.value}>
            {fruit.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  ),
};

export const Scrollable: Story = {
  render: () => (
    <Select>
      <SelectTrigger className="w-56">
        <SelectValue placeholder="Select a number" />
      </SelectTrigger>
      <SelectContent className="max-h-56">
        {Array.from({ length: 30 }, (_, index) => {
          const value = String(index + 1);

          return (
            <SelectItem key={value} value={value}>
              Number {value}
            </SelectItem>
          );
        })}
      </SelectContent>
    </Select>
  ),
};
