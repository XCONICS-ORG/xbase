import type { Meta, StoryObj } from "@storybook/react";
import { SonnerConnect } from "@xbase/design-system/components/modules/sonner/connect";
import { Button } from "@xbase/design-system/components/ui/button";
import { Toaster } from "@xbase/design-system/components/ui/sonner";
import type { ReactNode } from "react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const meta: Meta<typeof Toaster> = {
  title: "UI/Sonner",
  component: Toaster,
  tags: ["autodocs"],
  args: {
    closeButton: true,
    position: "bottom-right",
  },
  argTypes: {
    closeButton: {
      control: "boolean",
    },
    position: {
      control: "select",
      options: [
        "top-left",
        "top-center",
        "top-right",
        "bottom-left",
        "bottom-center",
        "bottom-right",
      ],
    },
    richColors: {
      control: "boolean",
    },
  },
  parameters: {
    layout: "fullscreen",
  },
};

export default meta;

type Story = StoryObj<typeof meta>;

function ToastPreview({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-96 items-center justify-center p-6">
      <div className="flex max-w-3xl flex-wrap items-center justify-center gap-2">
        {children}
      </div>
    </div>
  );
}

const wait = (duration = 1400) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

function ControlledLoadingExample() {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!completed) {
      return;
    }

    const timeout = window.setTimeout(() => setCompleted(false), 800);

    return () => window.clearTimeout(timeout);
  }, [completed]);

  const start = () => {
    setCompleted(false);
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setCompleted(true);
    }, 1400);
  };

  return (
    <ToastPreview>
      <SonnerConnect
        completed={completed}
        completedDescription="The external loading state changed to completed."
        completedTitle="Sync completed"
        loading={loading}
        loadingDescription="Waiting for a controlled loading prop."
        loadingTitle="Syncing workspace..."
        onClick={(event) => {
          event.preventDefault();
          start();
        }}
        variant="secondary"
      >
        Controlled state
      </SonnerConnect>
    </ToastPreview>
  );
}

export const Default: Story = {
  render: () => (
    <ToastPreview>
      <SonnerConnect
        description={new Date().toLocaleString()}
        title="Event has been created"
      >
        Default
      </SonnerConnect>
    </ToastPreview>
  ),
};

export const Variants: Story = {
  args: {
    richColors: true,
  },
  render: () => (
    <ToastPreview>
      <SonnerConnect
        description="A neutral notification."
        title="Default toast"
      >
        Default
      </SonnerConnect>
      <SonnerConnect
        description="Your changes are now live."
        title="Saved successfully"
        toastVariant="success"
      >
        Success
      </SonnerConnect>
      <SonnerConnect
        description="This workspace has pending updates."
        toastVariant="info"
        variant="secondary"
      >
        Info
      </SonnerConnect>
      <SonnerConnect
        description="Upgrade or clear old assets to continue syncing."
        toastVariant="warning"
        variant="outline"
      >
        Warning
      </SonnerConnect>
      <SonnerConnect
        description="The request failed. Try again in a moment."
        toastVariant="error"
        variant="destructive"
      >
        Error
      </SonnerConnect>
    </ToastPreview>
  ),
};

export const LoadingToCompleted: Story = {
  render: () => (
    <ToastPreview>
      <SonnerConnect
        completedDescription="The import finished and the toast updated in place."
        completedTitle="Import completed"
        loadingDescription="Uploading rows and validating fields."
        loadingTitle="Importing data..."
        onAction={() => wait()}
        variant="secondary"
      >
        Async action
      </SonnerConnect>
    </ToastPreview>
  ),
};

export const ControlledStates: Story = {
  render: () => <ControlledLoadingExample />,
};

export const WithAction: Story = {
  render: () => (
    <ToastPreview>
      <SonnerConnect
        description="You can undo this action for a short time."
        title="File moved to archive"
        toastOptions={{
          action: {
            label: "Undo",
            onClick: () => toast.success("File restored"),
          },
        }}
      >
        Action
      </SonnerConnect>
    </ToastPreview>
  ),
};

export const CloseButton: Story = {
  render: () => (
    <ToastPreview>
      <SonnerConnect
        closeButton
        description="This toast has the circular close control."
        title="Closable toast"
      >
        Close enabled
      </SonnerConnect>
      <SonnerConnect
        closeButton={false}
        description="This toast hides the close control."
        title="Persistent toast"
        variant="outline"
      >
        Close disabled
      </SonnerConnect>
      <Button onClick={() => toast.dismiss()} type="button" variant="ghost">
        Dismiss all
      </Button>
    </ToastPreview>
  ),
};

export const RichColors: Story = {
  args: {
    richColors: true,
  },
  render: () => (
    <ToastPreview>
      <SonnerConnect
        completedDescription="This uses Sonner rich color styling."
        completedTitle="Rich success"
        onAction={() => wait(900)}
      >
        Rich loading
      </SonnerConnect>
    </ToastPreview>
  ),
};
