import {
  STUDENT_TEST_SESSION_STATUS_TITLES,
  type StudentTestSessionStatus,
} from "@/constants/student-test-session-status";
import { cn } from "cn";
import { useTranslation } from "react-i18next";

export type StudentTestSessionStatusBadgeProps = React.ComponentProps<"div"> & {
  status?: StudentTestSessionStatus;
};

const STATUS_STYLES: Record<StudentTestSessionStatus, string> = {
  PENDING: "bg-warning text-black",
  STARTED: "bg-info text-black",
  FINISHED: "bg-success text-white",
  CANCELED: "bg-destructive text-white",
};

export default function StudentTestSessionStatusBadge({
  status,
  ...props
}: StudentTestSessionStatusBadgeProps) {
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
      {status && t(STUDENT_TEST_SESSION_STATUS_TITLES[status])}
    </div>
  );
}
