import type { UserStatus } from "src/pages/users/dtos/user.dto";
import { cn } from "src/utils/cn";

export type StatusViewProps = React.HTMLAttributes<HTMLDivElement> & {
  status?: UserStatus;
};

const STATUS_STYLES: Record<UserStatus, string> = {
  ACTIVE: "bg-(--success-main)",
  BLOCKED: "bg-(--danger-main)",
  PENDING: "bg-(--warning-main)",
};

const STATUS_TITLES: Record<UserStatus, string> = {
  ACTIVE: "Active",
  BLOCKED: "Blocked",
  PENDING: "Pending",
};

export default function StatusView({ status, ...props }: StatusViewProps) {
  return (
    <div
      {...props}
      className={cn(
        "px-2 py-1 rounded-lg text-white font-bold",
        status && STATUS_STYLES[status],
        props.className,
      )}
    >
      {status && STATUS_TITLES[status]}
    </div>
  );
}
