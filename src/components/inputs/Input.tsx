import { cn } from "src/utils/cn";

export type InputProps = React.InputHTMLAttributes<HTMLInputElement>;

function Input(props: InputProps) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-sm indent-1 p-1 border border-[lab(90.952%_0_-.0000119209)] duration-75 bg-transparent shadow-xs",
        "focus-visible:border-(--primary) outline-none focus-visible:ring-[3px] focus-visible:ring-(--primary)/30 ",
        "aria-invalid:border-(--danger) aria-invalid:ring-(--danger)/30",
        "disabled:opacity-60",
        props.className
      )}
    />
  );
}

export default Input;
