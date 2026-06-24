import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@xbase/design-system/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@xbase/design-system/components/ui/popover";

const meta: Meta<typeof Popover> = {
  title: "UI/Popover",
  component: Popover,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Open popover</Button>
      </PopoverTrigger>
      <PopoverContent className="w-72">
        <PopoverHeader>
          <PopoverTitle>Component details</PopoverTitle>
          <PopoverDescription>
            Small contextual panels for nearby actions and metadata.
          </PopoverDescription>
        </PopoverHeader>
      </PopoverContent>
    </Popover>
  ),
};

export const Alignment: Story = {
  render: () => (
    <div className="flex gap-2">
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">Start</Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-56">
          Aligned to the start edge.
        </PopoverContent>
      </Popover>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline">End</Button>
        </PopoverTrigger>
        <PopoverContent align="end" className="w-56" side="bottom">
          Aligned to the end edge.
        </PopoverContent>
      </Popover>
    </div>
  ),
};
