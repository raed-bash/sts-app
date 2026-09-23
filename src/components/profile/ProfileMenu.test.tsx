import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { ReactNode } from "react";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import ProfileMenu from "./ProfileMenu";

const user = {
  id: 1,
  username: "first",
  status: "ACTIVE",
  role: "STUDENT",
  createdAt: new Date(),
  student: {
    id: 1,
    fullName: "First Student",
    user: {} as never,
    gender: "MALE",
    isNameViewed: false,
  },
} satisfies NonNullable<AuthContextType["user"]>;

vi.mock("@/features/users/api/get-me.api", () => ({
  useMe: () => ({ data: user, isLoading: false }),
}));

function renderMenu(isOpen = true) {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  const logout = vi.fn();

  const value: AuthContextType = {
    loggedIn: true,
    login: () => {},
    logout,
    user,
  };

  const wrapper = ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={value}>
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
    </AuthContext.Provider>
  );

  return {
    logout,
    queryClient,
    ...render(<ProfileMenu isOpen={isOpen} />, { wrapper }),
  };
}

describe("ProfileMenu", () => {
  it("shows the logged-in user details and navigation links", () => {
    renderMenu();

    expect(screen.getByText("first")).toBeInTheDocument();
    expect(screen.getByText("Student")).toBeInTheDocument();

    const profileLink = screen.getByRole("link", { name: /profile/i });

    expect(profileLink).toHaveAttribute("href", "/profile");

    const settingsLink = screen.getByRole("link", { name: /settings/i });

    expect(settingsLink).toHaveAttribute("href", "/settings");
  });

  it("renders nothing while closed", () => {
    renderMenu(false);

    expect(screen.queryByText("first")).not.toBeInTheDocument();
  });

  it("logs out and clears the query cache", async () => {
    const { logout, queryClient } = renderMenu();

    queryClient.setQueryData(["some", "key"], 1);

    fireEvent.click(screen.getByRole("button", { name: "Logout" }));

    await waitFor(() => {
      expect(logout).toHaveBeenCalledTimes(1);
    });

    expect(queryClient.getQueryData(["some", "key"])).toBeUndefined();
  });
});
