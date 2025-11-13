import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";

/**
 * @typedef utils
 * @property {string} helperText
 * @property {boolean} error
 * @property {React.HTMLAttributes<HTMLDivElement>} containerProps
 * @property {React.HTMLAttributes<HTMLParagraphElement>} helperTextProps
 */

/**
 * @param {React.InputHTMLAttributes<HTMLInputElement> & utils} props
 */
function Input({ className, ...props } = { className: "", helperText: "" }) {
  const {
    helperTextProps = { className: "" },
    containerProps = { className: "" },
    error,
    helperText,
    ...otherProps
  } = props;

  const classNameMemo = useMemo(
    () =>
      twMerge(
        ` w-full rounded-lg indent-1 border-black p-1 border-[1px] ${
          helperText && error ? "border-danger-main" : ""
        } 
        ${props.disabled ? "opacity-60" : ""}
        `,
        className
      ),
    [className, helperText, props.disabled, error]
  );

  const containerClassNameMemo = useMemo(
    () => twMerge(`w-full`, containerProps.className),
    [containerProps.className]
  );

  const helperTextClassNameMemo = useMemo(
    () =>
      twMerge(
        (error && "text-danger-main ") + " text-sm",
        helperTextProps.className
      ),
    [error, helperTextProps.className]
  );

  return (
    <div {...containerProps} className={containerClassNameMemo}>
      <input {...otherProps} className={classNameMemo} />
      <p {...helperTextProps} className={helperTextClassNameMemo}>
        {helperText}
      </p>
    </div>
  );
}

export default memo(Input);
