import useAnimation from "src/hooks/useAnimation";
import { cn } from "src/utils/cn";

export type AnimationProps = React.HTMLAttributes<HTMLDivElement> & {
  isOpen: boolean;
  openClassName?: string;
  notOpenClassName?: string;
};

export default function Animation({
  className,
  children,
  isOpen = false,
  openClassName = "opacity-100",
  notOpenClassName = "opacity-0",
  ...props
}: AnimationProps) {
  const { show, showAnimation } = useAnimation({ isOpen });

  return (
    <div
      className={cn(
        `transition-all duration-300 ease-in-out ${
          showAnimation ? openClassName : notOpenClassName
        }`,
        className,
      )}
      {...props}
    >
      {show ? children : null}
    </div>
  );
}
