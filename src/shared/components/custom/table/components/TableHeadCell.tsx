import { cn } from "cn";
import type React from "react";

export type TableHeadCellProps = React.ComponentProps<"th">;

function TableHeadCell(props: TableHeadCellProps) {
  return (
    <th
      title={typeof props.children === "string" ? props.children : ""}
      {...props}
      className={cn(
        "text-muted-foreground text-xs font-semibold uppercase tracking-wide py-3 px-4 text-start whitespace-nowrap",
        props.className,
      )}
    />
  );
}

export default TableHeadCell;
