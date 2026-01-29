import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useAuthContext } from "src/contexts/AuthContext";

export default function useLogout() {
  const queryClient = useQueryClient();
  const authContext = useAuthContext();

  const handleLogout = useCallback(() => {
    authContext.logout();

    queryClient.clear();
  }, [queryClient, authContext]);

  return handleLogout;
}
