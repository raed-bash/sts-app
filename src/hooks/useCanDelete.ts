import { useRole } from "./useRole";

/** Only admins may delete; teachers manage tests/questions/answers without it. */
export function useCanDelete() {
  return useRole() === "SUPER_ADMIN";
}
