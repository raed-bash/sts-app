import {
  TEST_SESSION_STATUS_TITLES,
  type TestSessionStatus,
} from "@/constants/test-session-status";
import { cn } from "cn";
import { useTranslation } from "react-i18next";

export type TestSessionStatusBadgeProps = React.ComponentProps<"div"> & {
  status?: TestSessionStatus;
};

const STATUS_STYLES: Record<TestSessionStatus, string> = {
  PENDING: "bg-warning text-black",
  STARTED: "bg-info text-black",
  FINISHED: "bg-success text-white",
  CANCELED: "bg-destructive text-white",
};

export default function TestSessionStatusBadge({
  status,
  ...props
}: TestSessionStatusBadgeProps) {
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
      {status && t(TEST_SESSION_STATUS_TITLES[status])}
    </div>
  );
}
