import type { Meta, StoryObj } from "@storybook/react";
import { Badge } from "@xbase/design-system/components/ui/badge";
import { Button } from "@xbase/design-system/components/ui/button";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemHeader,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@xbase/design-system/components/ui/item";
import { IconBell, IconPackage, IconSettings } from "@xbase/icons/tabler";

const meta: Meta<typeof Item> = {
  title: "UI/Item",
  component: Item,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Item className="w-[420px]">
      <ItemMedia variant="icon">
        <IconPackage />
      </ItemMedia>
      <ItemContent>
        <ItemTitle>Design system</ItemTitle>
        <ItemDescription>Shared UI primitives and modules.</ItemDescription>
      </ItemContent>
      <ItemActions>
        <Button size="sm" variant="outline">
          Open
        </Button>
      </ItemActions>
    </Item>
  ),
};

export const Variants: Story = {
  render: () => (
    <ItemGroup className="w-[460px]">
      <Item>
        <ItemMedia variant="icon">
          <IconPackage />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Default item</ItemTitle>
          <ItemDescription>Transparent surface for plain lists.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="outline">
        <ItemMedia variant="icon">
          <IconSettings />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Outline item</ItemTitle>
          <ItemDescription>Use when the item needs stronger grouping.</ItemDescription>
        </ItemContent>
      </Item>
      <Item variant="muted">
        <ItemMedia variant="icon">
          <IconBell />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>Muted item</ItemTitle>
          <ItemDescription>Use for selected or highlighted rows.</ItemDescription>
        </ItemContent>
      </Item>
    </ItemGroup>
  ),
};

export const RichList: Story = {
  render: () => (
    <ItemGroup className="w-[480px]">
      <Item variant="outline">
        <ItemHeader>
          <ItemTitle>Packages</ItemTitle>
          <Badge variant="secondary">12 active</Badge>
        </ItemHeader>
        <ItemContent>
          <ItemDescription>
            Design-system, env, bucket, utility, and app support packages.
          </ItemDescription>
        </ItemContent>
      </Item>
      <ItemSeparator />
      <Item size="xs" variant="muted">
        <ItemMedia variant="icon">
          <IconPackage />
        </ItemMedia>
        <ItemContent>
          <ItemTitle>@xbase/design-system</ItemTitle>
        </ItemContent>
        <ItemActions>
          <Button size="xs" variant="ghost">
            View
          </Button>
        </ItemActions>
      </Item>
    </ItemGroup>
  ),
};
