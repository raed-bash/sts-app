import {
  Dialog,
  Transition,
  TransitionChild,
  DialogPanel,
  DialogTitle,
} from "@headlessui/react";
import { Fragment, memo, useCallback, useState } from "react";

type PopupProps = {
  isOpen?: boolean;

  onClose?: () => void;

  title?: string;

  children:
    | React.ReactNode
    | ((
        props: {
          open: boolean;
          setOpen: (open: boolean) => void;
          inPopup: boolean;
          handleClose: () => void;
          handleOpen: () => void;
        },
        triggerProps?: { onClick: () => void }
      ) => React.ReactNode);
};
function Popup({ isOpen, onClose, title, children }: PopupProps) {
  const [open, setOpen] = useState(false);

  const show = typeof isOpen === "boolean" ? isOpen : open;

  const handleOpen = useCallback(() => {
    setOpen(true);
  }, []);

  const handleClose = useCallback(() => {
    setOpen(false);
  }, []);

  return (
    <>
      {typeof children === "function" ? (
        children(
          { open, setOpen, inPopup: false, handleClose, handleOpen },
          { onClick: handleOpen }
        )
      ) : (
        <></>
      )}
      <Transition appear show={show} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-100000"
          onClose={onClose || handleClose}
        >
          <div className="fixed inset-0 bg-black opacity-30" />
          <div className="fixed inset-0 flex items-center justify-center p-4">
            <TransitionChild
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <DialogPanel className=" bg-(--surface) rounded-lg p-6 shadow-lg font-[Calibri]">
                <DialogTitle className="text-center text-lg font-medium text-(--text)">
                  {title}
                </DialogTitle>
                <div className="mt-4 flex justify-center gap-4">
                  {typeof children === "function"
                    ? children({
                        open,
                        setOpen,
                        inPopup: true,
                        handleClose,
                        handleOpen,
                      })
                    : children}
                </div>
              </DialogPanel>
            </TransitionChild>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

export default memo(Popup);
