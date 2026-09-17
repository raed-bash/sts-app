import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { Button } from "@/shared/components/ui/button";
import { Spinner } from "@/shared/components/ui/spinner";
import { XIcon } from "lucide-react";

export type ConfirmPopupProps = {
  isOpen?: boolean;

  title: string;

  message?: string;

  confirmLabel?: string;

  cancelLabel?: string;

  destructive?: boolean;

  loading?: boolean;

  onConfirm: () => void;

  onCancel: () => void;
};

export default function ConfirmPopup({
  isOpen,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  destructive = false,
  loading = false,
  onConfirm,
  onCancel,
}: ConfirmPopupProps) {
  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onCancel()}>
      <DialogContent showCloseButton={false} className="max-w-sm">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {message && <DialogDescription>{message}</DialogDescription>}
        </DialogHeader>
        <DialogFooter className="flex gap-2">
          <Button variant="outline" onClick={onCancel} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button
            variant={destructive ? "destructive" : "default"}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading && <Spinner />}
            {confirmLabel}
          </Button>
        </DialogFooter>
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-3 right-3 text-(--text-muted) hover:text-(--text)"
          aria-label="Close"
        >
          <XIcon size={16} />
        </button>
      </DialogContent>
    </Dialog>
  );
}