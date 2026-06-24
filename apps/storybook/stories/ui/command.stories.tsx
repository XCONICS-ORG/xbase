import type { Meta, StoryObj } from "@storybook/react";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@xbase/design-system/components/ui/command";
import { IconPackage, IconSettings, IconUser } from "@xbase/icons/tabler";

const meta: Meta<typeof Command> = {
  title: "UI/Command",
  component: Command,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Command className="w-[420px] rounded-lg border">
      <CommandInput placeholder="Search workspace..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Packages">
          <CommandItem>
            <IconPackage />
            @xbase/design-system
            <CommandShortcut>DS</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconPackage />
            @xbase/env
            <CommandShortcut>ENV</CommandShortcut>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <IconUser />
            Profile
          </CommandItem>
          <CommandItem disabled>
            <IconSettings />
            Docs app
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  ),
};
