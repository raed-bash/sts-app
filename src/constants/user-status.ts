export type UserStatus = "PENDING" | "ACTIVE" | "BLOCKED";

export const STATUS_TITLES = {
  ACTIVE: "common:statuses.active",
  BLOCKED: "common:statuses.blocked",
  PENDING: "common:statuses.pending",
} as const satisfies Record<UserStatus, string>;
