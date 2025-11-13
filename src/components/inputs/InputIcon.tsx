import { memo, useMemo, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
/**
 * @typedef utils
 * @property {string} helperText
 * @property {boolean} error
 * @property {React.HTMLAttributes<HTMLDivElement>} containerProps
 * @property {React.HTMLAttributes<HTMLParagraphElement>} helperTextProps
 * @property {React.HTMLAttributes<HTMLParagraphElement>} inputFrameProps
 * @property {React.SVGProps<SVGSVGElement> & {title?: string;}} StartIcon
 * @property {React.SVGProps<SVGSVGElement> & {title?: string;}} EndIcon
 * @property {string} iconClassName
 */

/**
 * @param {React.InputHTMLAttributes<HTMLInputElement> & utils} props
 */
function InputIcon({
  className = "",
  helperText = "",
  helperTextProps = { className: "" },
  containerProps = { className: "" },
  inputFrameProps = { className: "" },
  error,
  StartIcon,
  EndIcon,
  iconClassName,
  ...props
}) {
  const inputRef = useRef(null);
  const [focus, setFocus] = useState(false);

  const containerClassNameMemo = useMemo(
    () => twMerge(`w-full rounded-full`, containerProps.className),
    [containerProps.className]
  );

  const inputFrameMemo = useMemo(
    () =>
      twMerge(
        `flex items-stretch bg-secondary-main rounded-full px-3 py-2 h-full justify-between
              ${props.disabled ? "opacity-60" : ""} ${
          focus ? " outline-1 outline outline-primary-main " : ""
        } ${
          helperText && error
            ? "border-danger-main border-[1px] border-solid"
            : ""
        } `,
        inputFrameProps.className
      ),
    [helperText, error, focus, props.disabled, inputFrameProps.className]
  );

  const classNameMemo = useMemo(
    () =>
      twMerge(
        ` bg-transparent focus:outline-none w-full indent-1 p-1`,
        className
      ),
    [className]
  );

  const helperTextClassNameMemo = useMemo(
    () =>
      twMerge(
        (error && "text-danger-main ") + " text-sm",
        helperTextProps.className
      ),
    [error, helperTextProps.className]
  );

  const iconClassNameMemo = useMemo(
    () =>
      twMerge(`${focus ? "stroke-primary-main " : ""} h-full `, iconClassName),
    [focus, iconClassName]
  );

  return (
    <div
      {...containerProps}
      onClick={(e) => {
        inputRef.current.focus();

        if (containerProps.onClick) {
          containerProps.onClick(e);
        }
      }}
      className={containerClassNameMemo}
    >
      <div
        {...inputFrameProps}
        className={inputFrameMemo}
        style={{ outlineWidth: 1 }}
      >
        {StartIcon && <StartIcon className={iconClassNameMemo} />}
        <input
          {...props}
          ref={(ref) => {
            inputRef.current = ref;
            props.ref = ref;
          }}
          onFocus={(e) => {
            setFocus(true);
            if (props.onFocus) {
              props.onFocus(e);
            }
          }}
          onBlur={(e) => {
            setFocus(false);
            if (props.onBlur) {
              props.onBlur(e);
            }
          }}
          className={classNameMemo}
        />
        {EndIcon && <EndIcon className={iconClassNameMemo} />}
      </div>
      <p {...helperTextProps} className={helperTextClassNameMemo}>
        {helperText}
      </p>
    </div>
  );
}

export default memo(InputIcon);
