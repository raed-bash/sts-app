import { cn } from "src/utils/cn";
import Input from "./Input";

export type CheckboxProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "type"
> & {
  disabled?: boolean;

  className?: string;
};

function Checkbox({ className, ...props }: CheckboxProps) {
  return <Input type="checkbox" className={cn("w-4", className)} {...props} />;
}

export default Checkbox;
