export type UserRole = "SUPER_ADMIN" | "TEACHER" | "STUDENT";

export const ROLE_TITLES = {
  SUPER_ADMIN: "common:roles.superAdmin",
  STUDENT: "common:roles.student",
  TEACHER: "common:roles.teacher",
} as const satisfies Record<UserRole, string>;
