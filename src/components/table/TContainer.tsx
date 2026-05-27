import type React from "react";
import { cn } from "src/utils/cn";

export type TContainerProps = React.HTMLAttributes<HTMLDivElement>;

function TContainer(props: TContainerProps) {
  return (
    <div
      {...props}
      className={cn(
        "bg-secondary-main flex flex-col justify-between rounded-lg",
        props.className
      )}
    />
  );
}

export default TContainer;
