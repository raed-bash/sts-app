import { cn } from "src/utils/cn";
import {
  ButtonTheme,
  type ButtonColor,
  type ButtonVariant,
} from "./ButtonTheme";

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  color?: ButtonColor;
};

function Button({
  className,
  color = "primary",
  variant = "contained",
  disabled,
  ...otherProps
}: ButtonProps) {
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
