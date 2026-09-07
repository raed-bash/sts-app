import { cn } from "cn";

export type TableRowProps = React.ComponentProps<"tr">;

function TableRow({ className, ...props }: TableRowProps) {
  return <tr className={cn(``, className)} {...props} />;
}

export default TableRow;
