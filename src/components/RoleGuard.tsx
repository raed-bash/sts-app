import type { UserRole } from "@/constants/user-role";
import { useHasRole } from "@/hooks/useRole";
import type { ReactNode } from "react";

export type RoleGuardProps = {
  roles: UserRole[];
  fallback?: ReactNode;
  children: ReactNode;
};

export default function RoleGuard({
  roles,
  fallback = null,
  children,
}: RoleGuardProps) {
  const allowed = useHasRole(...roles);

  return <>{allowed ? children : fallback}</>;
}
