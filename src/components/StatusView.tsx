import { STATUS_TITLES, type UserStatus } from "src/constants/user-status";
import { cn } from "src/utils/cn";

export type StatusViewProps = React.HTMLAttributes<HTMLDivElement> & {
  status?: UserStatus;
};

const STATUS_STYLES: Record<UserStatus, string> = {
  ACTIVE: "bg-(--success)",
  BLOCKED: "bg-(--danger)",
  PENDING: "bg-(--warning)",
};

export default function StatusView({ status, ...props }: StatusViewProps) {
  return (
    <div
      {...props}
      className={cn(
        "px-2 py-1 inline-block rounded-lg text-white font-bold text-xs",
        status && STATUS_STYLES[status],
        props.className
      )}
    >
      {status && STATUS_TITLES[status]}
    </div>
  );
}
