export type TestSessionStatus =
  | "PENDING"
  | "STARTED"
  | "FINISHED"
  | "CANCELED";

export const TEST_SESSION_STATUS_TITLES: Record<TestSessionStatus, string> = {
  PENDING: "Pending",
  STARTED: "Started",
  FINISHED: "Finished",
  CANCELED: "Canceled",
};
