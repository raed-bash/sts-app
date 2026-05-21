export type UserStatus = "PENDING" | "ACTIVE" | "BLOCKED";

export const STATUS_TITLES: Record<UserStatus, string> = {
  ACTIVE: "Active",
  BLOCKED: "Blocked",
  PENDING: "Pending",
};
