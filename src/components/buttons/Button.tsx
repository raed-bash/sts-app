import { cn } from "src/utils/cn";
import {
  ButtonTheme,
  type ButtonColor,
  type ButtonVariant,
} from "./button-theme";

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
        "rounded-lg transition-all duration-150 ease-in-out text-[16px] py-2 px-4 w-full shadow-sm cursor-pointer",
        " outline-none focus:ring-[3px] ",
        "disabled:text-white disabled:bg-[#888] disabled:border-[#888] disabled:opacity-60 disabled:cursor-wait disabled:hover:bg-[#888]",
        !disabled && ButtonTheme[variant][color],
        className
      )}
      disabled={disabled}
      {...otherProps}
    />
  );
}
export default Button;
