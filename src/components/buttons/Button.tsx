import { cn } from "src/utils/cn";

const disabled = "text-white bg-[#888] border-[#888] opacity-60";

export const ButtonTheme = {
  contained: {
    primary: "text-white bg-primary-main hover:bg-primary-dark",
    secondary: "text-black bg-secondary-main hover:bg-dark-dark",
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

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  color?: ButtonColor;
};

function Button(props: ButtonProps) {
  const {
    className,
    color = "primary",
    variant = "contained",
    disabled,
    ...otherProps
  } = props;

  return (
    <button
      className={cn(
        "rounded-lg transition-all duration-150 ease-in-out text-[16px] py-2 px-4 w-full",
        ButtonTheme[variant][disabled ? "disabled" : color],
        className
      )}
      disabled={disabled}
      {...otherProps}
    />
  );
}
export default Button;
