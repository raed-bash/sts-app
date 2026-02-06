export type UserRole = "SUPER_ADMIN" | "TEACHER" | "STUDENT";

export const ROLE_TITLES: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  STUDENT: "Student",
  TEACHER: "Teacher",
};
