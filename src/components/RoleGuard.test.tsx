import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import RoleGuard from "./RoleGuard";
import RequireRole from "./RequireRole";

const studentUser = {
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

function wrapper({ children }: { children: ReactNode }) {
  const value: AuthContextType = {
    loggedIn: true,
    login: () => {},
    logout: () => {},
    user: studentUser,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

describe("RoleGuard", () => {
  it("renders children when the role matches", () => {
    render(
      <RoleGuard roles={["STUDENT", "TEACHER"]}>
        <div data-testid="content">secret</div>
      </RoleGuard>,
      { wrapper },
    );

    expect(screen.getByTestId("content")).toHaveTextContent("secret");
  });

  it("renders the fallback when the role does not match", () => {
    render(
      <RoleGuard
        roles={["SUPER_ADMIN"]}
        fallback={<div data-testid="fallback">no</div>}
      >
        <div data-testid="content">secret</div>
      </RoleGuard>,
      { wrapper },
    );

    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    expect(screen.getByTestId("fallback")).toHaveTextContent("no");
  });

  it("falls back to nothing by default", () => {
    render(
      <RoleGuard roles={["SUPER_ADMIN"]}>
        <div data-testid="content">secret</div>
      </RoleGuard>,
      { wrapper },
    );

    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
  });
});

describe("RequireRole", () => {
  it("delegates to the role guard", () => {
    render(
      <RequireRole roles={["TEACHER", "STUDENT"]}>
        <div data-testid="content">secret</div>
      </RequireRole>,
      { wrapper },
    );

    expect(screen.getByTestId("content")).toHaveTextContent("secret");
  });
});
