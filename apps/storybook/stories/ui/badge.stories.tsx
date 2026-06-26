import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@xbase/design-system/components/ui/badge";
import type { Color } from "@xbase/design-system/components/ui/badge";
import { IconCheck, IconSparkles, IconX } from "@xbase/icons/tabler";

const meta: Meta<typeof Badge> = {
  title: "UI/Badge",
  component: Badge,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const colors: Color[] = [
  "primary",
  "emerald",
  "red",
  "amber",
  "sky",
  "indigo",
  "orange",
];

export const Default: Story = {
  args: {
    children: "Stable",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="regular">Regular</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge color="emerald" variant="fancy">
        Fancy
      </Badge>
    </div>
  ),
};

export const Colors: Story = {
  render: () => (
    <div className="grid gap-4">
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <Badge color={color} key={`regular-${color}`} variant="regular">
            {color}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <Badge color={color} key={`outline-${color}`} variant="outline">
            {color}
          </Badge>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2">
        {colors.map((color) => (
          <Badge color={color} key={`fancy-${color}`} variant="fancy">
            {color}
          </Badge>
        ))}
      </div>
    </div>
  ),
};

export const WithDots: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      {colors.map((color) => (
        <Badge color={color} key={color} showDot variant="regular">
          {color}
        </Badge>
      ))}
    </div>
  ),
};

export const WithIcons: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>
        <IconCheck data-icon="inline-start" />
        Synced
      </Badge>
      <Badge variant="secondary">
        Beta
        <IconSparkles data-icon="inline-end" />
      </Badge>
      <Badge color="red" variant="fancy">
        <IconX data-icon="inline-start" />
        Blocked
      </Badge>
    </div>
  ),
};
