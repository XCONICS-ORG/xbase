import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@xbase/design-system/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@xbase/design-system/components/ui/sheet";

const meta: Meta<typeof Sheet> = {
  title: "UI/Sheet",
  component: Sheet,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function SheetExample({ side }: { side: "top" | "right" | "bottom" | "left" }) {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="outline">Open {side}</Button>
      </SheetTrigger>
      <SheetContent side={side}>
        <SheetHeader>
          <SheetTitle>{side} sheet</SheetTitle>
          <SheetDescription>
            Use sheets for contextual forms, navigation, and secondary panels.
          </SheetDescription>
        </SheetHeader>
        <div className="px-6 text-muted-foreground text-xs">
          Content stays close to the edge it enters from.
        </div>
        <SheetFooter>
          <SheetClose asChild>
            <Button>Close</Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export const Default: Story = {
  render: () => <SheetExample side="right" />,
};

export const Sides: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <SheetExample side="top" />
      <SheetExample side="right" />
      <SheetExample side="bottom" />
      <SheetExample side="left" />
    </div>
  ),
};
