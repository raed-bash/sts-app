import { cn } from "src/utils/cn";

export type TextAreaProps = React.DetailedHTMLProps<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  HTMLTextAreaElement
>;

function TextArea(props: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        `min-h-[100px] w-full rounded-lg indent-1 border-black p-1 border`,
        props.className,
        props.disabled ? "opacity-60" : ""
      )}
    />
  );
}
export default TextArea;
