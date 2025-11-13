import Paper, { type PaperProps } from "./paper/Paper";
import { cn } from "src/utils/cn";

export type SubHeaderProps = PaperProps & {};
function SubHeader({ className, ...props }: SubHeaderProps) {
  return (
    <Paper
      className={cn(
        "flex justify-between px-16 py-3 max-xl:px-4 max-lg:flex-col gap-2 lg:min-h-[74px] max-lg:min-h-[111px] rounded-none ",
        className
      )}
      {...props}
    />
  );
}

export default SubHeader;
