import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/shared/components/ui/dialog";
import { useCallback, useState, type ReactNode } from "react";
import { cn } from "cn";

type PopupProps = {
  isOpen?: boolean;

  onClose?: () => void;

  title?: string;

  description?: string;

  className?: string;

  children:
    | ReactNode
    | ((props: {
        isOpen: boolean;
        setIsOpen: (open: boolean) => void;
        inPopup: boolean;
        handleClose: () => void;
        handleOpen: () => void;
      }) => ReactNode);
};

function Popup({
  isOpen: controlledIsOpen,
  onClose,
  title,
  description,
  className,
  children,
}: PopupProps) {
  const isControlled = controlledIsOpen !== undefined;

  const [uncontrolledIsOpen, setUncontrolledIsOpen] = useState(false);

  const isOpen = isControlled ? controlledIsOpen : uncontrolledIsOpen;

  const setIsOpen = useCallback(
    (open: boolean) => {
      if (!isControlled) setUncontrolledIsOpen(open);
      if (!open) onClose?.();
    },
    [isControlled, onClose],
  );

  const handleOpen = useCallback(() => setIsOpen(true), [setIsOpen]);
  const handleClose = useCallback(() => setIsOpen(false), [setIsOpen]);

  return (
    <>
      {typeof children === "function"
        ? children({ isOpen, setIsOpen, inPopup: false, handleClose, handleOpen })
        : null}
      <Dialog
        open={isOpen}
        onOpenChange={(open) => (open ? handleOpen() : handleClose())}
      >
        <DialogContent
          showCloseButton
          className={cn("sm:max-w-lg", className)}
        >
          {(title || description) && (
            <DialogHeader>
              {title && <DialogTitle>{title}</DialogTitle>}
              {description && (
                <DialogDescription>{description}</DialogDescription>
              )}
            </DialogHeader>
          )}
          <div className="mt-2 flex flex-col gap-3">
            {typeof children === "function"
              ? children({ isOpen, setIsOpen, inPopup: true, handleClose, handleOpen })
              : children}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default Popup;
