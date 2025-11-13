import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";
import { useDispatch } from "react-redux";
import { logout } from "src/app/slice";

export default function useLogout() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const handleLogout = useCallback(() => {
    dispatch(logout());
    queryClient.clear();
  }, [dispatch, queryClient]);

  return handleLogout;
}
