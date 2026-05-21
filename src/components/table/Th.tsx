import { cn } from "src/utils/cn";

export type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;

function Th(props: ThProps) {
  return (
    <th
      title={typeof props.children === "string" ? props.children : ""}
      {...props}
      className={cn(
        "text-gray-800 dark:text-gray-200 text-xs font-semibold uppercase py-3 px-4 text-left",
        props.className,
      )}
    />
  );
}

export default Th;
