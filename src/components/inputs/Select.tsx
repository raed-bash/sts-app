import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";

function Select(props = { className: "", helperText: "" }) {
  const {
    newClassName,
    options = [],
    helperTextProps = { className: "" },
    containerProps = { className: "" },
    error,
    helperText,
    ...otherProps
  } = props;
  const { newClassName: containerNewClassName, ...otherContainerProps } =
    containerProps;
  const { newClassNameHelperTextProps, ...otherHelperTextProps } =
    helperTextProps;

  const classNameMemo = useMemo(
    () =>
      twMerge(
        " h-full w-full rounded-lg indent-1 border-black p-1 border-[1px] bg-transparent",
        `${otherProps.className || ""} ${
          props.helperText && error ? "border-danger-main" : ""
        } ${props.disabled ? "opacity-60" : ""}`
      ),
    [otherProps.className, props.helperText, props.disabled, error]
  );

  return (
    <div
      {...otherContainerProps}
      className={"w-full " + otherContainerProps.className}
      {...(containerNewClassName ? { className: containerNewClassName } : {})}
    >
      <select
        {...otherProps}
        className={classNameMemo}
        {...(newClassName ? { className: newClassName } : {})}
      >
        {options.map(({ key, ...props }) => (
          <option key={key} {...props} />
        ))}
      </select>
      <p
        {...otherHelperTextProps}
        className={
          (error && "text-red-600 ") +
          otherHelperTextProps.className +
          " text-sm"
        }
        {...(newClassNameHelperTextProps
          ? { className: newClassNameHelperTextProps }
          : {})}
      >
        {helperText}
      </p>
    </div>
  );
}

export default memo(Select);
