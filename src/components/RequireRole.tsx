import type { ReactNode } from "react";
import RoleGuard from "@/components/RoleGuard";
import type { UserRole } from "@/constants/user-role";

export type RequireRoleProps = {
  roles: UserRole[];
  children: ReactNode;
};

export default function RequireRole({ roles, children }: RequireRoleProps) {
  return <RoleGuard roles={roles}>{children}</RoleGuard>;
}