import { cn } from "src/utils/cn";
import Input from "./Input";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  secondaryStatus?: boolean;
};

function Checkbox({
  className,
  secondaryStatus = false,
  ...props
}: CheckboxProps) {
  return (
    <Input
      type="checkbox"
      className={cn(
        "appearance-none w-4 h-4 relative duration-150 before:duration-150 after:duration-150 inline-flex justify-center items-center bg-(--secondary)/10 rounded border border-(--secondary)/50 hover:border-(--primary)",

        "checked:bg-(--primary) data-[secondary=true]:bg-(--primary)",

        "checked:before:content-[''] before:absolute checked:before:w-2.5 before:h-[1.5px] before:bg-white checked:before:-rotate-52 before:right-px",

        "checked:after:content-[''] after:absolute checked:after:w-1 after:-translate-x-[3.5px] after:translate-y-[1.6px] after:h-[1.5px] after:bg-white after:rotate-45",

        "data-[secondary=true]:before:w-2.5 data-[secondary=true]:before:rotate-0 data-[secondary=true]:before:left-[50%] data-[secondary=true]:before:-translate-x-[50%] ",
        className
      )}
      aria-checked={!secondaryStatus && props.checked}
      data-secondary={secondaryStatus}
      {...props}
    />
  );
}

export default Checkbox;
