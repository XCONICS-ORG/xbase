import type { Meta, StoryObj } from "@storybook/react";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@xbase/design-system/components/ui/alert";
import { Button } from "@xbase/design-system/components/ui/button";
import { IconAlertTriangle, IconInfoCircle } from "@xbase/icons/tabler";

const meta: Meta<typeof Alert> = {
  title: "UI/Alert",
  component: Alert,
  tags: ["autodocs"],
  parameters: {
    layout: "centered",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
  render: () => (
    <Alert className="w-[420px]">
      <IconInfoCircle />
      <AlertTitle>Workspace synced</AlertTitle>
      <AlertDescription>
        Design-system packages were checked and are ready to use.
      </AlertDescription>
    </Alert>
  ),
};

export const Destructive: Story = {
  render: () => (
    <Alert className="w-[420px]" variant="destructive">
      <IconAlertTriangle />
      <AlertTitle>Migration failed</AlertTitle>
      <AlertDescription>
        Review the environment values before running the migration again.
      </AlertDescription>
    </Alert>
  ),
};

export const WithAction: Story = {
  render: () => (
    <Alert className="w-[520px]">
      <IconInfoCircle />
      <AlertTitle>New component stories available</AlertTitle>
      <AlertDescription>
        Publish the Storybook build after reviewing the updated examples.
      </AlertDescription>
      <AlertAction>
        <Button size="xs" variant="outline">
          Review
        </Button>
      </AlertAction>
    </Alert>
  ),
};
