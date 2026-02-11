import { cn } from "src/utils/cn";
import Input from "./Input";
import { useId } from "react";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  disabled?: boolean;

  className?: string;

  secondaryStatus?: boolean;
};

function Checkbox({
  className,
  secondaryStatus = false,
  ...props
}: CheckboxProps) {
  const randomId = useId();
  const id = props.id || randomId;

  return (
    <div className="w-4 h-4">
      <label
        htmlFor={id}
        className={cn(
          "w-full h-full relative duration-150 before:duration-150 after:duration-150 inline-flex justify-center items-center bg-(--secondary)/10 rounded border border-(--secondary)/50 hover:border-(--primary)",
          "aria-checked:bg-(--primary) data-[secondary=true]:bg-(--primary)",
          "aria-checked:before:content-[''] before:absolute aria-checked:before:w-2.5 before:h-[1.5px] before:bg-white aria-checked:before:-rotate-52 before:right-0",
          "aria-checked:after:content-[''] after:absolute aria-checked:after:w-1 after:-translate-x-[2.3px] after:translate-y-[1.6px] after:h-[1.5px] after:bg-white after:rotate-45",
          "data-[secondary=true]:before:w-2.5 data-[secondary=true]:before:rotate-0 data-[secondary=true]:before:left-[50%] data-[secondary=true]:before:-translate-x-[50%] ",
        )}
        aria-checked={!secondaryStatus && props.checked}
        data-secondary={secondaryStatus}
      ></label>
      <Input
        type="checkbox"
        className={cn("", className)}
        hidden
        id={id}
        {...props}
      />
    </div>
  );
}

export default Checkbox;
