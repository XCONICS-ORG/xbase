import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@turtle/design-system/components/ui/button";
import { Loader2, Mail } from "@turtle/icons/lucide";

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

export const Link: Story = {
  args: {
    variant: "link",
    href: "https://google.com",
    target: "_blank",
  },
};

export const Loading: Story = {
  render: (args) => (
    <Button {...args}>
      <Loader2 className="animate-spin" />
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
