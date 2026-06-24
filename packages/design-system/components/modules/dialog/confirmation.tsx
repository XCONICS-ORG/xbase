"use client";

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@xbase/design-system/components/ui/alert-dialog";
import {
  Button,
  type ButtonProps,
} from "@xbase/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@xbase/design-system/components/ui/dialog";
import { Input } from "@xbase/design-system/components/ui/input";
import { IconCheck, IconCopy } from "@xbase/icons/tabler";
import * as React from "react";
import { toast } from "sonner";

type ConfirmationDialogBaseProps = {
  actionIcon?: React.ReactNode;
  actionLabel?: string;
  actionLabelLoading?: string;
  cancelLabel?: string;
  children?: React.ReactNode;
  confirmDisabled?: boolean;
  confirmButtonVariant?: ButtonProps["variant"];
  description: string;
  loading?: boolean;
  onConfirm: () => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  title: string;
};

type AlertConfirmationDialogProps = ConfirmationDialogBaseProps & {
  mode?: "alert";
};

type TextConfirmationDialogProps = ConfirmationDialogBaseProps & {
  confirmText: string;
  inputLabel?: string;
  inputPlaceholder?: string;
  mode: "text";
};

export type ConfirmationDialogProps =
  | AlertConfirmationDialogProps
  | TextConfirmationDialogProps;

export function ConfirmationDialog(props: ConfirmationDialogProps) {
  const {
    actionIcon,
    actionLabel = "Continue",
    actionLabelLoading,
    cancelLabel = "Cancel",
    children,
    confirmDisabled = false,
    confirmButtonVariant = "destructive",
    description,
    loading = false,
    onConfirm,
    onOpenChange,
    open,
    title,
  } = props;

  const [inputValue, setInputValue] = React.useState("");
  const [isCopied, setIsCopied] = React.useState(false);

  React.useEffect(() => {
    if (!open) {
      setInputValue("");
      setIsCopied(false);
    }
  }, [open]);

  if (props.mode === "text") {
    const confirmTextLabel = props.inputLabel ?? props.confirmText;
    const canConfirm = inputValue === props.confirmText;

    const handleCopy = async () => {
      try {
        await navigator.clipboard.writeText(props.confirmText);
        setIsCopied(true);
        window.setTimeout(() => setIsCopied(false), 2000);
        toast.success("Copied to clipboard");
      } catch {
        toast.error("Failed to copy");
      }
    };

    return (
      <AlertDialog onOpenChange={onOpenChange} open={open}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{title}</AlertDialogTitle>
            <AlertDialogDescription>{description}</AlertDialogDescription>
          </AlertDialogHeader>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <p className="text-secondary-foreground text-sm">
                To confirm, type <span className="font-semibold">{confirmTextLabel}</span> below.
              </p>
              <Button onClick={handleCopy} size="icon-sm" type="button" variant="ghost">
                {isCopied ? (
                  <IconCheck className="size-4 text-success" />
                ) : (
                  <IconCopy className="size-4" />
                )}
                <span className="sr-only">Copy confirmation text</span>
              </Button>
            </div>

            <Input
              autoFocus
              disabled={loading}
              onChange={(event) => setInputValue(event.target.value)}
              placeholder={props.inputPlaceholder ?? "Type here..."}
              value={inputValue}
            />
          </div>

          {children}

          <AlertDialogFooter>
            <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
              {cancelLabel}
            </Button>
            <Button
              disabled={!canConfirm || confirmDisabled || loading}
              rightIcon={actionIcon}
              loading={loading}
              loadingText={actionLabelLoading}
              onClick={onConfirm}
              type="button"
              variant={confirmButtonVariant}
            >
              {actionLabel}
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    );
  }

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent className="p-4!" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="font-semibold text-md! text-secondary-foreground">
            {title}
          </DialogTitle>
          <DialogDescription className="text-sm!">{description}</DialogDescription>
        </DialogHeader>

        {children}

        <DialogFooter>
          <Button onClick={() => onOpenChange(false)} type="button" variant="outline">
            {cancelLabel}
          </Button>
          <Button
            disabled={confirmDisabled || loading}
            rightIcon={actionIcon}
            loading={loading}
            loadingText={actionLabelLoading}
            onClick={onConfirm}
            type="button"
            variant={confirmButtonVariant}
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
