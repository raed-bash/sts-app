import { describe, expect, it, vi } from "vitest";
import { renderHook, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { useLogout } from "./useLogout";

describe("useLogout", () => {
  it("logs the user out and clears the query cache", async () => {
    const queryClient = new QueryClient({
      defaultOptions: { queries: { retry: false } },
    });
    const logout = vi.fn();

    queryClient.setQueryData(["users"], ["a"]);

    const value: AuthContextType = {
      loggedIn: true,
      login: () => {},
      logout,
      user: null,
    };

    const wrapper = ({ children }: { children: ReactNode }) => (
      <AuthContext.Provider value={value}>
        <QueryClientProvider client={queryClient}>
          {children}
        </QueryClientProvider>
      </AuthContext.Provider>
    );

    const { result } = renderHook(() => useLogout(), { wrapper });

    result.current();

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
    });

    expect(queryClient.getQueryData(["users"])).toBeUndefined();
  });
});
