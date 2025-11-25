import { forwardRef, useRef, useState, type ForwardedRef } from "react";
import { cn } from "src/utils/cn";
export type InputIconProps = React.InputHTMLAttributes<HTMLInputElement> & {
  ref?: HTMLInputElement | null;

  helperText?: string;

  helperTextProps?: React.HTMLAttributes<HTMLParagraphElement>;

  containerProps?: React.HTMLAttributes<HTMLParagraphElement>;

  inputFrameProps?: React.HTMLAttributes<HTMLDivElement>;

  error?: boolean;

  StartIcon?: React.FC<React.SVGProps<SVGSVGElement>>;

  EndIcon?: React.FC<React.SVGProps<SVGSVGElement>>;

  iconClassName?: string;
};

function InputIcon(
  {
    className,
    helperText = "",
    helperTextProps = {},
    containerProps = {},
    inputFrameProps = {},
    error,
    StartIcon,
    EndIcon,
    iconClassName,
    ...props
  }: InputIconProps,
  ref: ForwardedRef<HTMLInputElement>
) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [focus, setFocus] = useState(false);

  const iconClassNameCN = cn(
    `h-full`,
    focus ? "stroke-primary-main " : "",
    iconClassName
  );

  const handleInputRef = (el: HTMLInputElement | null) => {
    if (el) {
      inputRef.current = el;
      if (typeof ref === "function") ref(el);
      else if (ref) ref.current = el;
    }
  };

  return (
    <div
      {...containerProps}
      onClick={(e) => {
        if (inputRef.current) {
          inputRef.current.focus();
        }

        if (containerProps.onClick) {
          containerProps.onClick(e);
        }
      }}
      className={cn(`w-full rounded-full`, containerProps.className)}
    >
      <div
        {...inputFrameProps}
        className={cn(
          `flex items-stretch 
           bg-secondary-main rounded-full
           px-3 py-2 h-full justify-between`,
          props.disabled ? "opacity-60" : "",
          focus ? " outline outline-primary-main " : "",
          helperText && error ? "border-danger-main border border-solid" : "",
          inputFrameProps.className
        )}
        style={{ outlineWidth: 1 }}
      >
        {StartIcon && <StartIcon className={iconClassNameCN} />}
        <input
          {...props}
          ref={handleInputRef}
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
          className={cn(
            ` bg-transparent focus:outline-none w-full indent-1 p-1`,
            className
          )}
        />
        {EndIcon && <EndIcon className={iconClassNameCN} />}
      </div>
      <p
        {...helperTextProps}
        className={cn(
          "text-sm",
          error ? "text-danger-main" : "",
          helperTextProps.className
        )}
      >
        {helperText}
      </p>
    </div>
  );
}

export default forwardRef(InputIcon);
