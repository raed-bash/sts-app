import type React from "react";
import { cn } from "cn";

export type TableContainerProps = React.ComponentProps<"div">;

function TableContainer(props: TableContainerProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-secondary-main flex flex-col justify-between rounded-lg",
        props.className,
      )}
    />
  );
}

export default TableContainer;
