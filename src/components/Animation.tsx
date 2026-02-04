import type { ComponentPropsWithRef } from "react";
import useAnimation from "src/hooks/useAnimation";
import { cn } from "src/utils/cn";

export type AnimationProps = ComponentPropsWithRef<"div"> & {
  isOpen: boolean;
  openClassName?: string;
  notOpenClassName?: string;
  duration?: number;
};

export default function Animation({
  children,
  isOpen = false,
  openClassName = "opacity-100",
  notOpenClassName = "opacity-0",
  duration = 300,
  ...props
}: AnimationProps) {
  const { show, showAnimation } = useAnimation({ isOpen, duration });

  return (
    <div
      {...props}
      className={cn(
        "transition-all ease-in-out",
        showAnimation ? openClassName : notOpenClassName,
        props.className,
      )}
      style={{ transitionDuration: `${duration}ms`, ...props.style }}
    >
      {show ? children : null}
    </div>
  );
}
