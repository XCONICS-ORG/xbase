import type { Meta, StoryObj } from "@storybook/react";
import { Separator } from "@xbase/design-system/components/ui/separator";

const meta: Meta<typeof Separator> = {
  title: "UI/Separator",
  component: Separator,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <div className="w-[360px]">
      <div className="space-y-1">
        <h4 className="font-medium text-sm">xbase</h4>
        <p className="text-muted-foreground text-xs">
          Workspace packages and apps.
        </p>
      </div>
      <Separator className="my-4" />
      <div className="flex h-5 items-center gap-4 text-xs">
        <span>Apps</span>
        <Separator orientation="vertical" />
        <span>Packages</span>
        <Separator orientation="vertical" />
        <span>Config</span>
      </div>
    </div>
  ),
};
