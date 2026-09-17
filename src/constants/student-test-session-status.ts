export type StudentTestSessionStatus =
  | "PENDING"
  | "STARTED"
  | "FINISHED"
  | "CANCELED";

export const STUDENT_TEST_SESSION_STATUS_TITLES: Record<
  StudentTestSessionStatus,
  string
> = {
  PENDING: "Pending",
  STARTED: "Started",
  FINISHED: "Finished",
  CANCELED: "Canceled",
};
