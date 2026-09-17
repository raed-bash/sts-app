import { useAuthContext } from "@/contexts/AuthContext";
import type { UserRole } from "@/constants/user-role";

export function useRole(): UserRole | null {
  const { user } = useAuthContext();

  return user?.role ?? null;
}

export function useHasRole(...roles: UserRole[]): boolean {
  const role = useRole();

  return Boolean(role && roles.includes(role));
}