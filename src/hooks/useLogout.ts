import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

export default function useLogout() {
  const queryClient = useQueryClient();

  const handleLogout = useCallback(() => {
    queryClient.clear();
  }, [queryClient]);

  return handleLogout;
}
