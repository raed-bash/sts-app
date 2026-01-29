export const TooltipPlacementStyle = {
  bottom: "top-[115%] left-1/2 -translate-x-1/2",
  top: "bottom-[115%] left-1/2 -translate-x-1/2",
  left: "right-[115%] top-1/2 -translate-y-1/2",
  right: "left-[115%] top-1/2 -translate-y-1/2",
};

export type TooltipPlacement = keyof typeof TooltipPlacementStyle;
