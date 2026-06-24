import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@xbase/design-system/components/ui/button";
import { ConfirmationDialog } from "@xbase/design-system/components/modules/dialog";
import { IconArchive, IconTrash } from "@xbase/icons/tabler";
import { type ComponentProps, useState } from "react";

const meta: Meta<typeof ConfirmationDialog> = {
  title: "Modules/Dialog/Confirmation",
  component: ConfirmationDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj;

type ConfirmationPreviewProps = {
  triggerLabel: string;
} & (
  | Omit<
      Extract<ComponentProps<typeof ConfirmationDialog>, { mode?: "alert" }>,
      "onConfirm" | "onOpenChange" | "open"
    >
  | Omit<
      Extract<ComponentProps<typeof ConfirmationDialog>, { mode: "text" }>,
      "onConfirm" | "onOpenChange" | "open"
    >
);

function ConfirmationPreview(
  props: ConfirmationPreviewProps
) {
  const [open, setOpen] = useState(false);
  const { triggerLabel, ...dialogProps } = props;

  return (
    <>
      <Button onClick={() => setOpen(true)} variant="outline">
        {triggerLabel}
      </Button>
      <ConfirmationDialog
        {...(dialogProps as ComponentProps<typeof ConfirmationDialog>)}
        onConfirm={() => setOpen(false)}
        onOpenChange={setOpen}
        open={open}
      />
    </>
  );
}

export const AlertConfirmation: Story = {
  render: () => (
    <ConfirmationPreview
      actionIcon={<IconTrash />}
      actionLabel="Delete project"
      description="This removes the project configuration from the workspace. The action cannot be undone."
      title="Delete this project?"
      triggerLabel="Open destructive confirmation"
    />
  ),
};

export const TextConfirmation: Story = {
  render: () => (
    <ConfirmationPreview
      actionIcon={<IconTrash />}
      actionLabel="Delete workspace"
      confirmText="delete xbase"
      description="Use typed confirmation for irreversible actions that need an extra safety step."
      inputLabel="delete xbase"
      inputPlaceholder="Type delete xbase"
      mode="text"
      title="Confirm workspace deletion"
      triggerLabel="Open typed confirmation"
    />
  ),
};

export const LoadingState: Story = {
  render: () => (
    <ConfirmationPreview
      actionIcon={<IconArchive />}
      actionLabel="Archive"
      actionLabelLoading="Archiving"
      description="The primary action can show a pending state while a request is running."
      loading
      title="Archive project?"
      triggerLabel="Open loading confirmation"
    />
  ),
};

export const VariantMatrix: Story = {
  render: () => (
    <div className="flex flex-wrap gap-2">
      <ConfirmationPreview
        actionLabel="Continue"
        confirmButtonVariant="default"
        description="Use a default action when the change is reversible."
        title="Continue with update?"
        triggerLabel="Default action"
      />
      <ConfirmationPreview
        actionLabel="Archive"
        confirmButtonVariant="secondary"
        description="Use a secondary action when the workflow is low risk."
        title="Archive item?"
        triggerLabel="Secondary action"
      />
      <ConfirmationPreview
        actionLabel="Remove"
        confirmButtonVariant="destructive"
        description="Use destructive styling for permanent or risky changes."
        title="Remove item?"
        triggerLabel="Destructive action"
      />
    </div>
  ),
};
