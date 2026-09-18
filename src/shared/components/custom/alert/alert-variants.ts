import { cva } from "class-variance-authority";

export const alertVariants = cva("mt-2 items-center", {
  variants: {
    color: {
      danger: "border-(--danger)/40 bg-(--danger)/10 text-(--danger)",
      warning: "border-(--warning)/40 bg-(--warning)/10 text-(--warning)",
      info: "border-(--info)/40 bg-(--info)/10 text-(--info)",
      success: "border-(--success)/40 bg-(--success)/10 text-(--success)",
    },
  },
  defaultVariants: {
    color: "info",
  },
});
