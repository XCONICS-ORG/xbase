import type { Meta, StoryObj } from "@storybook/react";
import { Button } from "@xbase/design-system/components/ui/button";
import { Toaster } from "@xbase/design-system/components/ui/sonner";
import { toast } from "sonner";

const meta: Meta<typeof Toaster> = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  args: {
    position: "bottom-right",
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

const ToastPreview = ({
  args,
  children,
}: {
  args: React.ComponentProps<typeof Toaster>;
  children: React.ReactNode;
}) => (
  <div className="flex min-h-96 items-center justify-center p-6">
    <div className="flex flex-wrap items-center justify-center gap-2">
      {children}
    </div>
    <Toaster {...args} />
  </div>
);

export const Default: Story = {
  render: (args) => (
    <ToastPreview args={args}>
      <Button
        onClick={() =>
          toast("Event has been created", {
            description: new Date().toLocaleString(),
          })
        }
        type="button"
      >
        Show toast
      </Button>
    </ToastPreview>
  ),
};

export const Success: Story = {
  render: (args) => (
    <ToastPreview args={args}>
      <Button
        onClick={() =>
          toast.success("Saved successfully", {
            description: "Your changes are now live.",
          })
        }
        type="button"
      >
        Show success
      </Button>
    </ToastPreview>
  ),
};

export const Info: Story = {
  render: (args) => (
    <ToastPreview args={args}>
      <Button
        onClick={() =>
          toast.info("Heads up", {
            description: "This workspace has pending updates.",
          })
        }
        type="button"
        variant="secondary"
      >
        Show info
      </Button>
    </ToastPreview>
  ),
};

export const Warning: Story = {
  render: (args) => (
    <ToastPreview args={args}>
      <Button
        onClick={() =>
          toast.warning("Storage almost full", {
            description: "Upgrade or clear old assets to continue syncing.",
          })
        }
        type="button"
        variant="outline"
      >
        Show warning
      </Button>
    </ToastPreview>
  ),
};

export const ErrorToast: Story = {
  render: (args) => (
    <ToastPreview args={args}>
      <Button
        onClick={() =>
          toast.error("Something went wrong", {
            description: "The request failed. Try again in a moment.",
          })
        }
        type="button"
        variant="destructive"
      >
        Show error
      </Button>
    </ToastPreview>
  ),
};

export const WithAction: Story = {
  render: (args) => (
    <ToastPreview args={args}>
      <Button
        onClick={() =>
          toast("File moved to archive", {
            description: "You can undo this action for a short time.",
            action: {
              label: "Undo",
              onClick: () => toast.success("File restored"),
            },
          })
        }
        type="button"
      >
        Show action
      </Button>
    </ToastPreview>
  ),
};

export const PromiseToast: Story = {
  render: (args) => (
    <ToastPreview args={args}>
      <Button
        onClick={() =>
          toast.promise(
            new Promise((resolve) => {
              setTimeout(resolve, 1200);
            }),
            {
              loading: "Saving changes...",
              success: "Changes saved",
              error: "Unable to save changes",
            }
          )
        }
        type="button"
        variant="secondary"
      >
        Show promise
      </Button>
    </ToastPreview>
  ),
};

export const RichColors: Story = {
  args: {
    richColors: true,
  },
  render: (args) => (
    <ToastPreview args={args}>
      <Button
        onClick={() =>
          toast.success("Rich color toast", {
            description: "This uses Sonner's rich color styling.",
          })
        }
        type="button"
      >
        Show rich colors
      </Button>
    </ToastPreview>
  ),
};

export const Variants: Story = {
  args: {
    richColors: true,
  },
  render: (args) => (
    <ToastPreview args={args}>
      <Button onClick={() => toast("Default toast")} type="button">
        Default
      </Button>
      <Button onClick={() => toast.success("Success toast")} type="button">
        Success
      </Button>
      <Button onClick={() => toast.info("Info toast")} type="button">
        Info
      </Button>
      <Button onClick={() => toast.warning("Warning toast")} type="button">
        Warning
      </Button>
      <Button onClick={() => toast.error("Error toast")} type="button">
        Error
      </Button>
    </ToastPreview>
  ),
};
