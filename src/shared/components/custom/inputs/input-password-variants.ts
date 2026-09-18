import { cva } from "class-variance-authority";

export const inputPasswordIconVariants = cva(
  "size-4 transition-colors duration-75 stroke-(--text) group-hover:stroke-(--primary) group-focus-within:stroke-(--primary)",
  {
    variants: {
      invalid: {
        true: "stroke-(--danger) group-hover:stroke-(--danger) group-focus-within:stroke-(--danger)",
        false: "",
      },
    },
  },
);
