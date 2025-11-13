import { cn } from "src/utils/cn";

export type ExpandContainerProps = React.HTMLAttributes<HTMLDivElement> & {
  expand: boolean;
  expanedClassName?: string;
  notExpanedClassName?: string;
};

function ExpandContainer({
  className,
  expand = false,
  expanedClassName = "",
  notExpanedClassName = "",
  ...props
}: ExpandContainerProps) {
  return (
    <div
      className={cn(
        `duration-150 ease-in-out`,
        expand
          ? `max-h-[10000px] overflow-animate ${expanedClassName}`
          : `max-h-0 overflow-hidden ${notExpanedClassName}`,
        className
      )}
      {...props}
    />
  );
}

export default ExpandContainer;
