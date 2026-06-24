import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@xbase/design-system/components/ui/button";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@xbase/design-system/components/ui/drawer";

const meta: Meta<typeof Drawer> = {
  title: "UI/Drawer",
  component: Drawer,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

function DrawerExample({
  direction,
}: {
  direction: "bottom" | "right" | "left" | "top";
}) {
  return (
    <Drawer direction={direction}>
      <DrawerTrigger asChild>
        <Button variant="outline">Open {direction}</Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle>{direction} drawer</DrawerTitle>
          <DrawerDescription>
            Drawers are useful for mobile-first controls and focused workflows.
          </DrawerDescription>
        </DrawerHeader>
        <div className="px-4 text-muted-foreground text-xs">
          The Vaul direction prop controls the entrance edge.
        </div>
        <DrawerFooter>
          <DrawerClose asChild>
            <Button>Close</Button>
          </DrawerClose>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}

export const Default: Story = {
  args: {},
  render: () => <DrawerExample direction="bottom" />,
};

export const Directions: Story = {
  args: {},
  render: () => (
    <div className="flex flex-wrap gap-2">
      <DrawerExample direction="bottom" />
      <DrawerExample direction="right" />
      <DrawerExample direction="left" />
      <DrawerExample direction="top" />
    </div>
  ),
};
