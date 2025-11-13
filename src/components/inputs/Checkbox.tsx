import { memo, useMemo } from "react";
import Input from "./Input";
import { buttonTheme } from "../buttons/Button";
import { twMerge } from "tailwind-merge";

/**
 * @typedef buttonProps
 * @type {import("../buttons/Button").buttonProps}
 */

/**
 * @typedef utils
 * @property {string} label
 * @property {buttonProps['variant']} mainVariant
 * @property {buttonProps['color']} mainColor
 * @property {buttonProps['variant']} secondaryVariant
 * @property {buttonProps['color']} secondaryColor
 * @property {string} checkedClassName
 * @property {string} notCheckedClassName
 */

/**
 * @typedef checkboxProps
 * @type {React.InputHTMLAttributes<HTMLInputElement> & import("./Input").utils & utils}
 */

/**
 * @param {checkboxProps} props
 */
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
}) {
  const id = useMemo(
    () => props.id || props.name || Math.random().toString(16).slice(2),
    [props.name, props.id]
  );

  const checked = props.checked;

  const classNameMemo = useMemo(
    () =>
      twMerge(
        ` ${
          buttonTheme[checked ? mainVariant : secondaryVariant][
            disabled ? "disabled" : checked ? mainColor : secondaryColor
          ]
        }  rounded-[35px] transition-all duration-150 ease-in-out text-[16px] py-2 px-10 w-full cursor-pointer aria-disabled:pointer-events-none border text-center flex items-center justify-center ${
          checked ? checkedClassName : notCheckedClassName
        }`,
        className
      ),
    [
      className,
      mainColor,
      mainVariant,
      disabled,
      secondaryVariant,
      secondaryColor,
      checked,
      checkedClassName,
      notCheckedClassName,
    ]
  );

  return (
    <div className="flex">
      <label htmlFor={id} className={classNameMemo} aria-disabled={disabled}>
        {label}
      </label>
      <Input type="checkbox" id={id} hidden {...props} />
    </div>
  );
}

export default memo(Checkbox);
