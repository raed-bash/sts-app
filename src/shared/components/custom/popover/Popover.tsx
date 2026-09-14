import * as React from "react";
import { Popover as PopoverPrimitive } from "@base-ui/react/popover";
import { GripVerticalIcon } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { cn } from "cn";
import { useMoveablePopover } from "@/shared/hooks";
import {
  Popover,
  PopoverContent as PopoverContentBase,
  PopoverTrigger,
} from "@/shared/components/ui/popover";

export { Popover, PopoverTrigger };

export function PopoverContent({
  moveable = true,
  className,
  align = "center",
  alignOffset = 0,
  side = "bottom",
  sideOffset = 4,
  ...props
}: PopoverPrimitive.Popup.Props &
  Pick<
    PopoverPrimitive.Positioner.Props,
    "align" | "alignOffset" | "side" | "sideOffset"
  > & { moveable?: boolean }) {
  const { ref, isGrabbing, isReleased, onPopoverOpenChange, onGrab } =
    useMoveablePopover();

  if (!moveable) {
    return <PopoverContentBase className={className} {...props} />;
  }

  return (
    <PopoverPrimitive.Portal>
      <PopoverPrimitive.Positioner
        ref={ref}
        align={align}
        alignOffset={alignOffset}
        side={side}
        sideOffset={sideOffset}
        className="isolate z-200"
        style={
          isReleased ? { transform: "none", position: "fixed" } : undefined
        }
        render={(positionerProps, state) => {
          return (
            <PopoverInnerContent
              positionerProps={positionerProps}
              isOpen={state.open}
              onGrab={onGrab}
              className={className}
              isGrabbing={isGrabbing}
              onOpenChange={onPopoverOpenChange}
              {...props}
            />
          );
        }}
      />
    </PopoverPrimitive.Portal>
  );
}

function PopoverInnerContent({
  positionerProps,
  isOpen,
  className,
  onGrab,
  isGrabbing,
  onOpenChange,
  ...props
}: {
  positionerProps: React.ComponentProps<"div">;
  isOpen: boolean;
  isGrabbing: boolean;
  onOpenChange: (isOpen: boolean) => void;
  onGrab: React.MouseEventHandler<HTMLButtonElement>;
} & PopoverPrimitive.Popup.Props) {
  React.useEffect(() => {
    onOpenChange(isOpen);
  }, [isOpen, onOpenChange]);

  return (
    <div {...positionerProps}>
      <Button
        data-slot="grip-button"
        className="cursor-grab mb-1 data-[grabbing=true]:cursor-grabbing"
        variant="outline"
        data-grabbing={isGrabbing}
        onMouseDown={onGrab}
      >
        <GripVerticalIcon />
      </Button>

      <PopoverPrimitive.Popup
        data-slot="popover-content"
        className={cn(
          " max-h-[90vh] overflow-auto z-50 flex w-72 origin-(--transform-origin) flex-col gap-2.5 rounded-lg bg-popover p-2.5 text-sm text-popover-foreground shadow-md ring-1 ring-foreground/10 outline-hidden duration-100 data-[side=bottom]:slide-in-from-top-2 data-[side=inline-end]:slide-in-from-left-2 data-[side=inline-start]:slide-in-from-right-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 data-open:animate-in data-open:fade-in-0 data-open:zoom-in-95 data-closed:animate-out data-closed:fade-out-0 data-closed:zoom-out-95",
          className,
        )}
        {...props}
      />
    </div>
  );
}
