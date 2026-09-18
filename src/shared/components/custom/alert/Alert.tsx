import { CircleCheck, Info, TriangleAlert } from "lucide-react";
import { cn } from "cn";
import {
  Alert as AlertRoot,
  AlertTitle as AlertTitlePrimitive,
} from "@/shared/components/ui/alert";
import type { VariantProps } from "class-variance-authority";
import { alertVariants } from "./alert-variants";

export type AlertColor = NonNullable<
  VariantProps<typeof alertVariants>["color"]
>;

export type AlertProps = React.ComponentProps<typeof AlertRoot> &
  VariantProps<typeof alertVariants>;

const alertIcons: Record<AlertColor, React.ReactNode> = {
  danger: <Info className="size-6" />,
  warning: <TriangleAlert className="size-6" />,
  info: <Info className="size-6" />,
  success: <CircleCheck className="size-6" />,
};

function Alert({ className, color, children, ...props }: AlertProps) {
  return (
    <AlertRoot
      role="alert"
      className={cn(alertVariants({ color }), className)}
      {...props}
    >
      <AlertTitlePrimitive className="flex items-center gap-3 text-[15px] font-medium">
        {alertIcons[color ?? "info"]}
        {children}
      </AlertTitlePrimitive>
    </AlertRoot>
  );
}

export default Alert;
