import React from "react";
import { cn } from "cn";

export type LabeledTextBoxProps = React.ComponentProps<"div"> & {
  label: string;
  children: React.ReactNode;
  labelProps?: React.ComponentProps<"div">;

  valueProps?: React.ComponentProps<"div">;
};

function LabeledTextBox({
  label,
  children,
  labelProps = {},
  valueProps = {},
  ...props
}: LabeledTextBoxProps) {
  return (
    <div
      {...props}
      className={cn(
        "flex border-2 border-(--secondary) w-full p-2 rounded-lg text-md gap-2",
        props.className,
      )}
    >
      <p {...labelProps} className={cn(" min-w-max", labelProps.className)}>
        {label}:{" "}
      </p>
      <div {...valueProps} className={cn("", valueProps.className)}>
        {children}
      </div>
    </div>
  );
}

export default LabeledTextBox;
