import type { Meta, StoryObj } from "@storybook/react";
import { Loader } from "@xbase/design-system/components/modules/system/loader";

const meta: Meta<typeof Loader> = {
  title: "Modules/System/Loader",
  component: Loader,
  tags: ["autodocs"],
  argTypes: {
    fullHeight: {
      control: "boolean",
    },
    fullPage: {
      control: "boolean",
    },
    size: {
      control: "select",
      options: ["sm", "md", "lg"],
    },
  },
  args: {
    fullHeight: false,
    size: "lg",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Playground: Story = {
  render: (args) => <Loader {...args} className="min-h-72" />,
};

export const Sizes: Story = {
  render: () => (
    <div className="flex min-h-72 items-center justify-center gap-6 bg-background">
      <div className="flex flex-col items-center gap-2">
        <Loader className="size-auto min-h-0" fullHeight={false} size="sm" />
        <span className="text-muted-foreground text-xs">Small</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loader className="size-auto min-h-0" fullHeight={false} size="md" />
        <span className="text-muted-foreground text-xs">Medium</span>
      </div>
      <div className="flex flex-col items-center gap-2">
        <Loader className="size-auto min-h-0" fullHeight={false} size="lg" />
        <span className="text-muted-foreground text-xs">Large</span>
      </div>
    </div>
  ),
};

export const FullHeight: Story = {
  args: {
    fullHeight: true,
    size: "lg",
  },
};

export const LoadingState: Story = {
  render: () => (
    <main className="flex min-h-72 min-w-80 items-center justify-center bg-background">
      <div className="flex flex-col items-center gap-4">
        <Loader className="size-auto min-h-0" fullHeight={false} size="lg" />
      </div>
    </main>
  ),
};
