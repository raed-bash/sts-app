import { type ReactNode } from "react";
import { cn } from "src/utils/cn";

export type LabeledTextBoxProps = React.HTMLAttributes<HTMLDivElement> & {
  label: string;
  children: ReactNode;
  labelProps?: React.HTMLAttributes<HTMLDivElement>;

  valueProps?: React.HTMLAttributes<HTMLDivElement>;
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
