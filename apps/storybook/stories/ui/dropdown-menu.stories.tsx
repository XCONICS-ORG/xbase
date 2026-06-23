import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@turtle/design-system/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@turtle/design-system/components/ui/dropdown-menu";

const meta: Meta<typeof DropdownMenu> = {
  title: "UI/DropdownMenu",
  component: DropdownMenu,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuItem>Profile</DropdownMenuItem>
        <DropdownMenuItem>Billing</DropdownMenuItem>
        <DropdownMenuItem>Team</DropdownMenuItem>
        <DropdownMenuItem>Subscription</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const DisabledItem: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger asChild>
        <Button variant="outline">Open</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-44">
        <DropdownMenuItem>Available</DropdownMenuItem>
        <DropdownMenuItem disabled>Disabled</DropdownMenuItem>
        <DropdownMenuItem>Another action</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
};
