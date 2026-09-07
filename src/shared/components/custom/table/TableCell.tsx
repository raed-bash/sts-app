import { cn } from "cn";

export type TableCellProps = React.ComponentProps<"td">;

function TableCell(props: TableCellProps) {
  return (
    <td
      title={typeof props.children === "string" ? props.children : ""}
      {...props}
      className={cn(`text-sm py-3 px-4 `, props.className)}
    />
  );
}

export default TableCell;
