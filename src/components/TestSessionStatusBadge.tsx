import {
  TEST_SESSION_STATUS_TITLES,
  type TestSessionStatus,
} from "@/constants/test-session-status";
import { cn } from "cn";

export type TestSessionStatusBadgeProps = React.ComponentProps<"div"> & {
  status?: TestSessionStatus;
};

const STATUS_STYLES: Record<TestSessionStatus, string> = {
  PENDING: "bg-(--warning)",
  STARTED: "bg-(--info)",
  FINISHED: "bg-(--success)",
  CANCELED: "bg-(--danger)",
};

export default function TestSessionStatusBadge({
  status,
  ...props
}: TestSessionStatusBadgeProps) {
  return (
    <div
      {...props}
      className={cn(
        "px-2 py-1 inline-block rounded-lg text-white font-bold text-xs",
        status && STATUS_STYLES[status],
        props.className,
      )}
    >
      {status && TEST_SESSION_STATUS_TITLES[status]}
    </div>
  );
}