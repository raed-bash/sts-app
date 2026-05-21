import type { ComponentPropsWithRef, CSSProperties } from "react";
import useAnimation from "src/hooks/useAnimation";
import { cn } from "src/utils/cn";

export type AnimationProps = ComponentPropsWithRef<"div"> & {
  isOpen: boolean;
  openClassName?: string;
  notOpenClassName?: string;
  duration?: number;
  openStyle?: CSSProperties;
  notOpenStyle?: CSSProperties;
};

export default function Animation({
  children,
  isOpen = false,
  openClassName = "opacity-100",
  notOpenClassName = "opacity-0",
  duration = 300,
  openStyle = {},
  notOpenStyle = {},
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
      style={{
        transitionDuration: `${duration}ms`,
        ...(showAnimation ? openStyle : notOpenStyle),
        ...props.style,
      }}
    >
      {show ? children : null}
    </div>
  );
}
