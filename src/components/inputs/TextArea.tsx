import { cn } from "src/utils/cn";

export type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
> & {
  helperText?: string;

  error?: boolean;

  helperTextProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLParagraphElement>,
    HTMLParagraphElement
  >;

  containerProps?: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >;
};

function TextArea(
  {
    helperTextProps = {},
    containerProps = {},
    error,
    helperText,
    ...props
  }: TextAreaProps = { helperText: "" }
) {
  return (
    <div
      {...containerProps}
      className={cn(containerProps.className, " w-full")}
    >
      <textarea
        {...props}
        className={cn(
          `min-h-[100px] w-full rounded-lg indent-1 border-black p-1 border`,
          helperText && error ? "border-danger-main" : "",
          props.className,
          props.disabled ? "opacity-60" : ""
        )}
      />
      <p
        {...helperTextProps}
        className={cn(
          error && "text-red-600 ",
          helperTextProps.className,
          "text-sm"
        )}
      >
        {helperText}
      </p>
    </div>
  );
}
export default TextArea;
