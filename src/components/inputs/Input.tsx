import { cn } from "src/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        `w-full rounded-lg indent-1 border-black p-1 border`,
        props.disabled ? "opacity-60" : "",
        props.className
      )}
    />
  );
}

export default Input;
