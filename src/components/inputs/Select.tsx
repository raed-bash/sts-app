import { cn } from "src/utils/cn";

export type SelectProps = React.DetailedHTMLProps<
  React.SelectHTMLAttributes<HTMLSelectElement>,
  HTMLSelectElement
>;
function Select({ ...props }: SelectProps) {
  return (
    <select
      {...props}
      className={cn(
        " h-full w-full rounded-lg indent-1 border-black p-1 border bg-transparent",
        props.className,
        props.disabled ? "opacity-60" : ""
      )}
    />
  );
}

export default Select;
