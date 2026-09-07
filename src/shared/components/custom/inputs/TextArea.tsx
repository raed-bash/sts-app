import type React from "react";
import { cn } from "cn";

export type TextAreaProps = React.ComponentProps<"textarea">;

function TextArea(props: TextAreaProps) {
  return (
    <textarea
      {...props}
      className={cn(
        `min-h-[100px] w-full rounded-lg indent-1 border-black p-1 border`,
        props.className,
        props.disabled ? "opacity-60" : "",
      )}
    />
  );
}
export default TextArea;
