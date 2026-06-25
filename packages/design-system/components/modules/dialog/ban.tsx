"use client";

import { Button } from "@xbase/design-system/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@xbase/design-system/components/ui/dialog";
import { Textarea } from "@xbase/design-system/components/ui/textarea";
import { useEffect, useState } from "react";

interface BanConfirmationDialogProps {
  actionLabel?: string;
  actionLabelLoading?: string;
  cancelLabel?: string;
  description: string;
  initialReason?: string | null;
  loading?: boolean;
  onConfirm: (reason: string) => void;
  onOpenChange: (open: boolean) => void;
  open: boolean;
  placeholder?: string;
  title: string;
}

export function BanConfirmationDialog({
  actionLabel = "Ban",
  actionLabelLoading,
  cancelLabel = "Cancel",
  description,
  initialReason,
  loading = false,
  onConfirm,
  onOpenChange,
  open,
  placeholder = "Enter ban reason",
  title,
}: BanConfirmationDialogProps) {
  const [reason, setReason] = useState("");
  const trimmedReason = reason.trim();

  useEffect(() => {
    if (open) {
      setReason(initialReason ?? "");
      return;
    }

    if (!open) {
      setReason("");
    }
  }, [initialReason, open]);

  return (
    <Dialog onOpenChange={onOpenChange} open={open}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <Textarea
          className="h-30 resize-none"
          disabled={loading}
          onChange={(event) => setReason(event.target.value)}
          placeholder={placeholder}
          rows={4}
          value={reason}
        />
        <DialogFooter>
          <Button
            onClick={() => onOpenChange(false)}
            type="button"
            variant="outline"
          >
            {cancelLabel}
          </Button>
          <Button
            disabled={loading || trimmedReason.length === 0}
            loading={loading}
            loadingText={actionLabelLoading}
            onClick={() => onConfirm(trimmedReason)}
            type="button"
            variant="destructive"
          >
            {actionLabel}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
