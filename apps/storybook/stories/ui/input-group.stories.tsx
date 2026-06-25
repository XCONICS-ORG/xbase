import type { Meta, StoryObj } from "@storybook/react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
  InputGroupTextarea,
} from "@xbase/design-system/components/ui/input-group";
import { IconCopy, IconSearch, IconSend } from "@xbase/icons/tabler";

const meta: Meta<typeof InputGroup> = {
  title: "UI/InputGroup",
  component: InputGroup,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <InputGroup className="w-[360px]">
      <InputGroupAddon>
        <IconSearch />
      </InputGroupAddon>
      <InputGroupInput placeholder="Search components..." />
      <InputGroupAddon align="inline-end">
        <InputGroupText>⌘K</InputGroupText>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const InlineAddons: Story = {
  render: () => (
    <InputGroup className="w-[360px]">
      <InputGroupAddon>
        <InputGroupText>https://</InputGroupText>
      </InputGroupAddon>
      <InputGroupInput defaultValue="xbase.local" />
      <InputGroupAddon align="inline-end">
        <InputGroupButton size="icon-xs" variant="ghost">
          <IconCopy />
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};

export const BlockAddons: Story = {
  render: () => (
    <InputGroup className="w-[420px]">
      <InputGroupAddon align="block-start" className="border-b">
        <InputGroupText>Release note</InputGroupText>
      </InputGroupAddon>
      <InputGroupTextarea defaultValue="Updated the design-system stories." />
      <InputGroupAddon align="block-end" className="justify-end border-t">
        <InputGroupButton
          rightIcon={<IconSend />}
          size="sm"
          variant="secondary"
        >
          Send
        </InputGroupButton>
      </InputGroupAddon>
    </InputGroup>
  ),
};
