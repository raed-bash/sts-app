import type React from "react";
import { cn } from "cn";
import { Check } from "lucide-react";

export type CheckboxProps = Omit<React.ComponentProps<"input">, "type"> & {
  secondaryStatus?: boolean;
};

function Checkbox({
  className,
  secondaryStatus = false,
  checked,
  ...props
}: CheckboxProps) {
  const isActive = Boolean(secondaryStatus) || Boolean(checked);

  const showCheck = Boolean(checked) && !secondaryStatus;

  const showDash = secondaryStatus;

  return (
    <span
      className={cn(
        "relative inline-flex size-4 shrink-0 items-center justify-center rounded border",
        "border-secondary/50 bg-secondary/10 text-white transition-colors duration-150",
        "hover:border-primary focus-within:ring-2 focus-within:ring-ring",
        isActive && "border-primary bg-primary",
        className,
      )}
    >
      <input
        type="checkbox"
        className="absolute inset-0 z-10 m-0 size-full cursor-pointer appearance-none opacity-0"
        aria-checked={!secondaryStatus && checked}
        {...props}
      />
      {showCheck && (
        <Check
          className="pointer-events-none size-3"
          strokeWidth={3}
          aria-hidden
        />
      )}
      {showDash && (
        <svg
          viewBox="0 0 16 16"
          className="pointer-events-none size-3 fill-none stroke-current"
          aria-hidden
        >
          <line
            x1="2"
            y1="8"
            x2="14"
            y2="8"
            strokeWidth="2.2"
            strokeLinecap="round"
          />
        </svg>
      )}
    </span>
  );
}

export default Checkbox;
