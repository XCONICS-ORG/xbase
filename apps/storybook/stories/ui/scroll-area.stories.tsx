import type { Meta, StoryObj } from "@storybook/react";
import {
  ScrollArea,
  ScrollBar,
} from "@xbase/design-system/components/ui/scroll-area";

const meta: Meta<typeof ScrollArea> = {
  title: "UI/ScrollArea",
  component: ScrollArea,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const packages = [
  "@xbase/design-system",
  "@xbase/env",
  "@xbase/bucket",
  "@xbase/utility",
  "@xbase/icons",
  "@xbase/libs",
  "@xbase/seo",
  "@xbase/feature-flags",
  "@xbase/internationalization",
  "@xbase/typescript-config",
];

export const Default: Story = {
  render: () => (
    <ScrollArea className="h-48 w-72 rounded-md border">
      <div className="p-4">
        <h4 className="mb-3 font-medium text-sm">Packages</h4>
        {packages.map((item) => (
          <div className="border-t py-2 text-xs" key={item}>
            {item}
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
};

export const Horizontal: Story = {
  render: () => (
    <ScrollArea className="w-72 whitespace-nowrap rounded-md border">
      <div className="flex w-max gap-3 p-4">
        {packages.map((item) => (
          <div className="rounded-md bg-muted px-3 py-2 text-xs" key={item}>
            {item}
          </div>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
};
