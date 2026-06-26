import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@xbase/design-system/components/ui/button";
import { Loader2, Mail, Plus } from "@xbase/icons/lucide";

const meta: Meta<typeof Button> = {
  title: "UI/Button",
  component: Button,
  tags: ["autodocs"],
  argTypes: {
    children: {
      control: "text",
    },
  },
  parameters: {
    layout: "centered",
  },
  args: {
    variant: "default",
    size: "default",
    children: "Button",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
  args: {
    variant: "outline",
  },
};

export const Secondary: Story = {
  args: {
    variant: "secondary",
  },
};

export const Ghost: Story = {
  args: {
    variant: "ghost",
  },
};

export const Destructive: Story = {
  args: {
    variant: "destructive",
  },
};

export const DestructiveSoft: Story = {
  args: {
    variant: "destructive-soft",
  },
};

export const Link: Story = {
  args: {
    variant: "link",
    href: "https://google.com",
    target: "_blank",
  },
};

export const Loading: Story = {
  render: (args) => (
    <Button {...args} loadingState={true}>
      Loading
    </Button>
  ),
  args: {
    disabled: true,
    variant: "outline",
  },
};

export const RightIcon: Story = {
  render: (args) => (
    <Button {...args} rightIcon={<Mail className="size-4" />}>
      Login with email
    </Button>
  ),
  args: {
    variant: "secondary",
  },
};

export const LeftIcon: Story = {
  render: (args) => (
    <Button {...args} leftIcon={<Mail className="size-4" />}>
      Login with email
    </Button>
  ),
  args: {
    variant: "secondary",
  },
};

export const ExtraSmall: Story = {
  args: {
    size: "xs",
  },
};

export const Small: Story = {
  args: {
    size: "sm",
  },
};

export const Large: Story = {
  args: {
    size: "lg",
  },
};

export const Icon: Story = {
  args: {
    "aria-label": "Email",
    children: <Mail />,
    size: "icon",
    variant: "secondary",
  },
};

export const Disabled: Story = {
  args: {
    disabled: true,
  },
};

export const VariantMatrix: Story = {
  render: () => (
    <div className="grid grid-cols-3 gap-2">
      <Button>Default</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="destructive">Destructive</Button>
      <Button variant="destructive-soft">Destructive Soft</Button>
      <Button href="#" variant="link">
        Link
      </Button>
    </div>
  ),
};

export const SizeMatrix: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button size="xs">Extra small</Button>
      <Button size="sm">Small</Button>
      <Button size="default">Default</Button>
      <Button size="lg">Large</Button>
      <Button aria-label="Add" size="icon-xs" variant="outline">
        <Plus />
      </Button>
      <Button aria-label="Add" size="icon-sm" variant="outline">
        <Plus />
      </Button>
      <Button aria-label="Add" size="icon" variant="outline">
        <Plus />
      </Button>
      <Button aria-label="Add" size="icon-lg" variant="outline">
        <Plus />
      </Button>
    </div>
  ),
};

export const LoadingStates: Story = {
  render: () => (
    <div className="flex flex-wrap items-center gap-2">
      <Button loading>Saving</Button>
      <Button loading loadingText="Publishing..." variant="secondary">
        Publish
      </Button>
      <Button leftIcon={<Mail />} loading variant="outline">
        Email
      </Button>
      <Button loading rightIcon={<Mail />} variant="destructive">
        Delete
      </Button>
      <Button loading rightIcon={<Mail />} variant="destructive-soft">
        Archive
      </Button>
    </div>
  ),
};
