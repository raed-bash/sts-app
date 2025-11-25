import { useId, type ReactNode } from "react";
import Input from "./Input";
import { cn } from "src/utils/cn";
import {
  ButtonTheme,
  type ButtonColor,
  type ButtonVariant,
} from "../buttons/ButtonTheme";

export type CheckboxProps = React.InputHTMLAttributes<HTMLInputElement> & {
  label: ReactNode;

  /**
   * @default contained
   */
  mainVariant?: ButtonVariant;

  /**
   * @default primary
   */
  mainColor?: ButtonColor;

  /**
   * @default outlined
   */
  secondaryVariant?: ButtonVariant;

  /**
   * @default secondary
   */
  secondaryColor?: ButtonColor;

  disabled?: boolean;

  className?: string;

  checkedClassName?: string;

  notCheckedClassName?: string;
};

function Checkbox({
  label,
  mainVariant = "contained",
  mainColor = "primary",
  secondaryVariant = "outlined",
  secondaryColor = "secondary",
  disabled,
  className,
  checkedClassName,
  notCheckedClassName,
  ...props
}: CheckboxProps) {
  const hId = useId();

  const id = props.id || props.name || hId;

  const checked = props.checked;

  return (
    <div className="flex">
      <label
        htmlFor={id}
        className={cn(
          ButtonTheme[checked ? mainVariant : secondaryVariant][
            disabled ? "disabled" : checked ? mainColor : secondaryColor
          ],
          `rounded-[35px] transition-all duration-150 ease-in-out text-[16px]
           py-2 px-10 w-full cursor-pointer aria-disabled:pointer-events-none
           border text-center flex items-center justify-center`,
          checked ? checkedClassName : notCheckedClassName,
          className
        )}
        aria-disabled={disabled}
      >
        {label}
      </label>
      <Input type="checkbox" id={id} hidden {...props} />
    </div>
  );
}

export default Checkbox;
