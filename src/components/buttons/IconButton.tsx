import { createElement, type HTMLElementType } from "react";
import { cn } from "src/utils/cn";

export type IconButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  as?: HTMLElementType;
};

function IconButton({
  as = "button",
  className,
  children,
  ...props
}: IconButtonProps) {
  return createElement(
    as,
    {
      ...props,
      className: cn(
        "hover:bg-[#DFDFDF88] duration-150 ease-in-out cursor-pointer p-2 rounded-full flex justify-center items-center max-lg:w-12 max-lg:h-12 max-md:w-9 max-md:h-9",
        className
      ),
    },
    children
  );
}

export default IconButton;
