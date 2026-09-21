import { cva } from "class-variance-authority";

export const inputPasswordIconVariants = cva(
  "size-4 transition-colors duration-75 stroke-foreground group-hover:stroke-primary group-focus-within:stroke-primary",
  {
    variants: {
      invalid: {
        true: "stroke-destructive group-hover:stroke-destructive group-focus-within:stroke-destructive",
        false: "",
      },
    },
  },
);
