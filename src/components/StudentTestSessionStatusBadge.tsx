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
  PENDING: "bg-warning",
  STARTED: "bg-info",
  FINISHED: "bg-success",
  CANCELED: "bg-destructive",
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
        "px-2 py-1 inline-block rounded-lg text-white font-bold text-xs",
        status && STATUS_STYLES[status],
        props.className,
      )}
    >
      {status && t(STUDENT_TEST_SESSION_STATUS_TITLES[status])}
    </div>
  );
}
