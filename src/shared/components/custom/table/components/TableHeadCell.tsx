import { cn } from "cn";
import type React from "react";

export type TableHeadCellProps = React.ComponentProps<"th">;

function TableHeadCell(props: TableHeadCellProps) {
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

export default TableHeadCell;
