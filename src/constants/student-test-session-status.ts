export type StudentTestSessionStatus =
  "PENDING" | "STARTED" | "FINISHED" | "CANCELED";

export const STUDENT_TEST_SESSION_STATUS_TITLES = {
  PENDING: "common:statuses.pending",
  STARTED: "common:statuses.started",
  FINISHED: "common:statuses.finished",
  CANCELED: "common:statuses.canceled",
} as const satisfies Record<StudentTestSessionStatus, string>;
