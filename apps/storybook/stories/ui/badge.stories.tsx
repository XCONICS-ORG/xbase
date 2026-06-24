import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@xbase/design-system/components/ui/badge";
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

export const Default: Story = {
  args: {
    children: "Stable",
  },
};

export const Variants: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Badge>Default</Badge>
      <Badge variant="secondary">Secondary</Badge>
      <Badge variant="destructive">Destructive</Badge>
      <Badge variant="outline">Outline</Badge>
      <Badge variant="ghost">Ghost</Badge>
      <Badge variant="link">Link</Badge>
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
      <Badge variant="destructive">
        <IconX data-icon="inline-start" />
        Blocked
      </Badge>
    </div>
  ),
};
