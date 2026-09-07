import { STATUS_TITLES, type UserStatus } from "@/constants/user-status";
import { cn } from "cn";
import type React from "react";

export type StatusBadgeProps = React.ComponentProps<"div"> & {
  status?: UserStatus;
};

const STATUS_STYLES: Record<UserStatus, string> = {
  ACTIVE: "bg-(--success)",
  BLOCKED: "bg-(--danger)",
  PENDING: "bg-(--warning)",
};

export default function StatusBadge({ status, ...props }: StatusBadgeProps) {
  return (
    <div
      {...props}
      className={cn(
        "px-2 py-1 inline-block rounded-lg text-white font-bold text-xs",
        status && STATUS_STYLES[status],
        props.className,
      )}
    >
      {status && STATUS_TITLES[status]}
    </div>
  );
}
