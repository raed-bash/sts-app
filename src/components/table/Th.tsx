import { cn } from "src/utils/cn";

export type ThProps = React.ThHTMLAttributes<HTMLTableCellElement>;

function Th(props: ThProps) {
  return (
    <th
      align="center"
      title={typeof props.children === "string" ? props.children : ""}
      {...props}
      className={cn(
        "text-primary-main text-base max-lg:text-xs max-lg:py-2 py-5 px-2",
        props.className
      )}
    />
  );
}

export default Th;
