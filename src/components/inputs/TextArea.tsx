import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";

function TextArea(props = { className: "", helperText: "" }) {
  const {
    newClassName,
    helperTextProps = { className: "" },
    containerProps = { className: "" },
    error,
    helperText,
    ...otherProps
  } = props;
  const { newClassNameContainer, ...otherContainerProps } = containerProps;
  const { newClassNameHelperText, ...otherHelperTextProps } = helperTextProps;
  const classNameMemo = useMemo(
    () =>
      twMerge(
        ` min-h-[100px] w-full rounded-lg indent-1 border-black p-1 border-[1px] ${
          props.helperText && error ? "border-danger-main" : ""
        }`,
        `${otherProps.className || ""} ${props.disabled ? "opacity-60" : ""}`
      ),
    [props.helperText, otherProps.className, props.disabled, error]
  );

  return (
    <div
      {...otherContainerProps}
      className={otherContainerProps.className + " w-full"}
      {...(newClassNameContainer ? { className: newClassNameContainer } : {})}
    >
      <textarea
        {...otherProps}
        className={classNameMemo}
        {...(newClassName ? { className: newClassName } : {})}
      />
      <p
        {...otherHelperTextProps}
        className={
          (error && "text-red-600 ") +
          otherHelperTextProps.className +
          " text-sm"
        }
        {...(newClassNameHelperText
          ? { className: newClassNameHelperText }
          : {})}
      >
        {helperText}
      </p>
    </div>
  );
}
export default memo(TextArea);
