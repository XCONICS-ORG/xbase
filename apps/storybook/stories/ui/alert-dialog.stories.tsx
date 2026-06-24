import type { Meta, StoryObj } from "@storybook/react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@xbase/design-system/components/ui/alert-dialog";
import { Button } from "@xbase/design-system/components/ui/button";
import { IconAlertTriangle, IconTrash } from "@xbase/icons/tabler";

const meta: Meta<typeof AlertDialog> = {
  title: "UI/AlertDialog",
  component: AlertDialog,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="outline">Delete project</Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This removes the project metadata from the workspace.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel size="default" variant="outline">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction size="default" variant="destructive">
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};

export const WithMedia: Story = {
  render: () => (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">Open warning</Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogMedia>
          <IconAlertTriangle className="size-5 text-destructive" />
        </AlertDialogMedia>
        <AlertDialogHeader>
          <AlertDialogTitle>Remove production bucket?</AlertDialogTitle>
          <AlertDialogDescription>
            Connected uploads will stop working until another bucket is configured.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel size="default" variant="outline">
            Keep bucket
          </AlertDialogCancel>
          <AlertDialogAction size="default" variant="destructive">
            Remove <IconTrash data-icon="inline-end" />
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
};
