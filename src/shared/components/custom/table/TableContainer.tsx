import type React from "react";
import { cn } from "cn";

export type TContainerProps = React.ComponentProps<"div">;

function TableContainer(props: TContainerProps) {
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
