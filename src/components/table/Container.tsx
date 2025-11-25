import type React from "react";
import { cn } from "src/utils/cn";

export type ContainerProps = React.HTMLAttributes<HTMLDivElement>;

function Container(props: ContainerProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-secondary-main  flex flex-col justify-between",
        props.className
      )}
    />
  );
}

export default Container;
