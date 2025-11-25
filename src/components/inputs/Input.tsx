import { cn } from "src/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  error?: boolean;

  helperText?: string;

  helperTextProps?: React.HTMLAttributes<HTMLParagraphElement>;

  containerProps?: React.HTMLAttributes<HTMLDivElement>;
};

function Input({ className, ...props }: InputProps) {
  const {
    helperTextProps = { className: "" },
    containerProps = { className: "" },
    error,
    helperText,
    ...otherProps
  } = props;

  return (
    <div {...containerProps} className={cn(`w-full`, containerProps.className)}>
      <input
        {...otherProps}
        className={cn(
          `w-full rounded-lg indent-1 border-black p-1 border`,
          helperText && error ? "border-danger-main" : "",
          props.disabled ? "opacity-60" : "",
          className
        )}
      />
      <p
        {...helperTextProps}
        className={cn(
          error && "text-danger-main ",
          "text-sm",
          helperTextProps.className
        )}
      >
        {helperText}
      </p>
    </div>
  );
}

export default Input;
