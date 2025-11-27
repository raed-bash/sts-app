import React, { useState, type ReactNode } from "react";
import { cn } from "src/utils/cn";
import {
  TooltipPlacementStyle,
  type TooltipPlacement,
} from "./TooltipPlacementStyle";

export type TooltipProps = Omit<
  React.DetailedHTMLProps<React.HTMLAttributes<HTMLDivElement>, HTMLDivElement>,
  "title"
> & {
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
            `absolute p-2 text-sm bg-(--background) text-(--text) rounded font-medium z-50 shadow-md`,
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
