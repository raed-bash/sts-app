import { cva } from "class-variance-authority";

export const alertVariants = cva("mt-2 items-center", {
  variants: {
    color: {
      danger: "border-destructive/40 bg-destructive/10 text-destructive",
      warning: "border-warning/40 bg-warning/10 text-warning",
      info: "border-info/40 bg-info/10 text-info",
      success: "border-success/40 bg-success/10 text-success",
    },
  },
  defaultVariants: {
    color: "info",
  },
});
