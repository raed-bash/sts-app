export const disabled = "text-white bg-[#888] border-[#888] opacity-60";

export const ButtonTheme = {
  contained: {
    primary: "text-white bg-(--secondary) hover:bg-(--primary)",
    secondary: "text-black bg-(--secondary) hover:bg-dark-dark",
    danger: "text-white bg-danger-main hover:bg-danger-dark",
    dark: "text-white bg-black hover:bg-dark-light",
    disabled,
  },
  outlined: {
    primary:
      "text-primary-main border-primary-main border-[1px] hover:bg-primary-light",
    secondary:
      "text-secondary-secondary border-secondary-secondary border-[1px] hover:bg-secondary-main",
    danger:
      "text-danger-main border-danger-main border-[1px] hover:bg-danger-light",
    dark: "text-black border-black border-[1px]  hover:bg-dark-dark",
    disabled,
  },
};

export type ButtonVariant = keyof typeof ButtonTheme;

export type ButtonColor = keyof (typeof ButtonTheme)["contained"];
