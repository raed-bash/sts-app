import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import type { UserRole } from "@/constants/user-role";
import { homePaths } from "@/features/home/home.paths";

export function useRequireRole(
  roles: UserRole[],
  redirectTo = `/${homePaths.home}`,
): boolean {
  const { user } = useAuthContext();
  const navigate = useNavigate();

  const allowed = Boolean(user?.role && roles.includes(user.role));

  useEffect(() => {
    if (!allowed) navigate(redirectTo, { replace: true });
  }, [allowed, navigate, redirectTo]);

  return allowed;
}