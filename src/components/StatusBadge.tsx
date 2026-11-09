import { STATUS_TITLES, type UserStatus } from "@/constants/user-status";
import { cn } from "cn";
import { useTranslation } from "react-i18next";
import type React from "react";

export type StatusBadgeProps = React.ComponentProps<"div"> & {
  status?: UserStatus;
};

const STATUS_STYLES: Record<UserStatus, string> = {
  ACTIVE: "bg-success text-white",
  BLOCKED: "bg-destructive text-white",
  PENDING: "bg-warning text-black",
};

export default function StatusBadge({ status, ...props }: StatusBadgeProps) {
  const { t } = useTranslation(["common"]);

  return (
    <div
      {...props}
      className={cn(
        "px-2 py-1 inline-block rounded-lg font-bold text-xs whitespace-nowrap",
        status && STATUS_STYLES[status],
        props.className,
      )}
    >
      {status && t(STATUS_TITLES[status])}
    </div>
  );
}
