import type { Meta, StoryObj } from "@storybook/react";
import { BanConfirmationDialog } from "@xbase/design-system/components/modules/dialog";
import { Button } from "@xbase/design-system/components/ui/button";
import { type ComponentProps, useState } from "react";

const meta: Meta<typeof BanConfirmationDialog> = {
  title: "Modules/Dialog/BanConfirmation",
  component: BanConfirmationDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

type BanConfirmationPreviewProps = {
  triggerLabel: string;
} & Omit<
  ComponentProps<typeof BanConfirmationDialog>,
  "onConfirm" | "onOpenChange" | "open"
>;

function BanConfirmationPreview({
  triggerLabel,
  ...dialogProps
}: BanConfirmationPreviewProps) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {triggerLabel}
      </Button>
      <BanConfirmationDialog
        {...dialogProps}
        onConfirm={() => setOpen(false)}
        onOpenChange={setOpen}
        open={open}
      />
    </>
  );
}

export const Default: Story = {
  render: () => (
    <BanConfirmationPreview
      description="Add a clear reason before banning this member. The reason is saved to their account history."
      title="Ban this member?"
      triggerLabel="Open ban confirmation"
    />
  ),
};

export const WithInitialReason: Story = {
  render: () => (
    <BanConfirmationPreview
      actionLabel="Update ban"
      description="Use an initial reason when the action is editing an existing ban note."
      initialReason="Repeated policy violations after prior warnings."
      placeholder="Describe why this account should remain banned"
      title="Update ban reason"
      triggerLabel="Open with reason"
    />
  ),
};

export const LoadingState: Story = {
  render: () => (
    <BanConfirmationPreview
      actionLabel="Ban member"
      actionLabelLoading="Banning"
      description="The textarea and primary action are disabled while the ban request is pending."
      initialReason="Spam reports confirmed by moderation review."
      loading
      title="Ban member?"
      triggerLabel="Open loading state"
    />
  ),
};
