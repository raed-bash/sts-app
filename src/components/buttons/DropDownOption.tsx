import type React from "react";
import { cn } from "src/utils/cn";

export type DropDownOptionProps = React.ButtonHTMLAttributes<HTMLButtonElement>;

function DropDownOption({ className, ...props }: DropDownOptionProps) {
  return (
    <button
      className={cn(
        `flex justify-between w-full text-right px-4 py-2 hover:bg-gray-100 disabled:bg-[#888] disabled:text-white disabled:opacity-60`,
        className
      )}
      type="button"
      {...props}
    />
  );
}

export default DropDownOption;
