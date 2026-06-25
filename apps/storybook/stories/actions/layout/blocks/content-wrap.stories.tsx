import type { Meta, StoryObj } from "@storybook/react";
import { ContentWrap } from "@xbase/design-system/components/modules/layout/blocks";
import { Button } from "@xbase/design-system/components/ui/button";
import { Input } from "@xbase/design-system/components/ui/input";
import { Switch } from "@xbase/design-system/components/ui/switch";
import { IconDeviceFloppy, IconPlus } from "@xbase/icons/tabler";

const meta: Meta<typeof ContentWrap> = {
  title: "Actions/Layout/Blocks/ContentWrap",
  component: ContentWrap,
  tags: ["autodocs"],
  parameters: {
    layout: "padded",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <ContentWrap
      actions={
        <Button
          leftIcon={<IconPlus />}
          size="sm"
          type="button"
          variant="outline"
        >
          Add
        </Button>
      }
      className="max-w-2xl"
      description="A controlled content wrapper for settings, forms, detail panels, and operational blocks."
      title="Organization Details"
    >
      <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
        <Input readOnly value="Northstar Labs" />
        <Input readOnly value="finance@northstar.example" />
      </div>
    </ContentWrap>
  ),
};

export const Variants: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
      <ContentWrap title="Bordered">Default bordered wrapper</ContentWrap>
      <ContentWrap title="Card" variant="card">
        Card wrapper with rounded corners and shadow.
      </ContentWrap>
      <ContentWrap title="Muted" variant="muted">
        Muted wrapper for secondary areas.
      </ContentWrap>
      <ContentWrap title="Ghost" variant="ghost">
        Unframed wrapper for custom composition.
      </ContentWrap>
    </div>
  ),
};

export const States: Story = {
  render: () => (
    <div className="grid max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
      <ContentWrap loading title="Loading" />
      <ContentWrap empty title="Empty" />
      <ContentWrap
        empty
        emptyState={
          <div className="rounded-md border border-dashed p-6 text-center text-muted-foreground text-xs">
            Invite members to start using this workspace.
          </div>
        }
        title="Custom Empty"
      />
      <ContentWrap
        footer={
          <Button leftIcon={<IconDeviceFloppy />} size="sm" type="button">
            Save
          </Button>
        }
        title="Footer"
      >
        <div className="flex items-center justify-between rounded-md border p-3">
          <span className="text-sm">Enable billing alerts</span>
          <Switch />
        </div>
      </ContentWrap>
    </div>
  ),
};
