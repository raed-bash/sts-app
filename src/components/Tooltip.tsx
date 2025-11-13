import React, { useState, type ReactNode } from "react";
import { cn } from "src/utils/cn";

export const TooltipPlacementStyle = {
  bottom: "top-[115%] left-1/2 -translate-x-1/2",
  top: "bottom-[115%] left-1/2 -translate-x-1/2",
  left: "right-[115%] top-1/2 -translate-y-1/2",
  right: "left-[115%] top-1/2 -translate-y-1/2",
};

export type TooltipPlacement = keyof typeof TooltipPlacementStyle;

export type TooltipProps = React.HTMLAttributes<HTMLDivElement> & {
  title?: ReactNode;
  placement?: TooltipPlacement;
  tooltipProps?: React.HTMLAttributes<HTMLDivElement>;
};

function Tooltip({
  className,
  children,
  title,
  placement = "bottom",
  tooltipProps = {},
  ...props
}: TooltipProps) {
  const [mouseIn, setMouseIn] = useState(false);

  return (
    <div
      {...props}
      className={cn(`relative`, className)}
      onMouseEnter={() => setMouseIn(true)}
      onMouseLeave={() => setMouseIn(false)}
    >
      {children}
      {mouseIn && title && (
        <div
          {...tooltipProps}
          className={cn(
            `absolute p-2 text-sm bg-dark-light text-white rounded font-medium z-50`,
            TooltipPlacementStyle[placement],
            tooltipProps.className
          )}
        >
          {title}
        </div>
      )}
    </div>
  );
}

export default Tooltip;
