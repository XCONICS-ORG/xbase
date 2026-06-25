"use client";

import {
  dismissSonnerToasts,
  SonnerConnect,
} from "@xbase/design-system/components/modules/sonner/connect";
import { Button } from "@xbase/design-system/components/ui/button";
import { useEffect, useState } from "react";

const wait = (duration = 1400) =>
  new Promise((resolve) => {
    window.setTimeout(resolve, duration);
  });

export function SonnerControls() {
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);

  useEffect(() => {
    if (!completed) {
      return;
    }

    const timeout = window.setTimeout(() => setCompleted(false), 800);

    return () => window.clearTimeout(timeout);
  }, [completed]);

  const runControlledState = () => {
    setCompleted(false);
    setLoading(true);

    window.setTimeout(() => {
      setLoading(false);
      setCompleted(true);
    }, 1400);
  };

  return (
    <div className="rounded-md border p-4 md:col-span-2">
      <div className="flex flex-col gap-1">
        <h2 className="font-medium text-sm">Sonner controls</h2>
        <p className="text-muted-foreground text-xs">
          Trigger single-toast variants, loading, completed state, and close
          button behavior.
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        <SonnerConnect description="Default app toast." title="Default toast">
          Default
        </SonnerConnect>
        <SonnerConnect
          description="Saved through the web app test panel."
          title="Saved successfully"
          toastVariant="success"
        >
          Success
        </SonnerConnect>
        <SonnerConnect
          description="This is an informational toast."
          toastVariant="info"
          variant="secondary"
        >
          Info
        </SonnerConnect>
        <SonnerConnect
          description="Storage is almost full."
          toastVariant="warning"
          variant="outline"
        >
          Warning
        </SonnerConnect>
        <SonnerConnect
          description="The request failed."
          toastVariant="error"
          variant="destructive"
        >
          Error
        </SonnerConnect>
        <SonnerConnect
          completedDescription="The app action completed in the same toast."
          completedTitle="Upload completed"
          loadingDescription="Uploading files..."
          loadingTitle="Uploading..."
          onAction={() => wait()}
          variant="secondary"
        >
          Loading flow
        </SonnerConnect>
        <SonnerConnect
          completed={completed}
          completedDescription="Controlled state changed to completed."
          completedTitle="Controlled completed"
          loading={loading}
          loadingDescription="Waiting on external state."
          loadingTitle="Controlled loading..."
          onClick={(event) => {
            event.preventDefault();
            runControlledState();
          }}
          variant="outline"
        >
          Controlled
        </SonnerConnect>
        <SonnerConnect
          closeButton={false}
          description="This toast hides the circular close button."
          title="Close disabled"
          variant="ghost"
        >
          No close
        </SonnerConnect>
        <Button
          onClick={() => dismissSonnerToasts()}
          type="button"
          variant="ghost"
        >
          Dismiss all
        </Button>
      </div>
    </div>
  );
}
