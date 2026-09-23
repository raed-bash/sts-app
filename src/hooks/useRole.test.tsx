import { describe, expect, it } from "vitest";
import { renderHook } from "@testing-library/react";
import type { ReactNode } from "react";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import { useHasRole, useRole } from "./useRole";

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
} satisfies AuthContextType["user"];

function authWrapper(user: AuthContextType["user"]) {
  const value: AuthContextType = {
    loggedIn: Boolean(user),
    login: () => {},
    logout: () => {},
    user,
  };

  return ({ children }: { children: ReactNode }) => (
    <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
  );
}

describe("useRole", () => {
  it("returns the role for a logged-in user", () => {
    const { result } = renderHook(() => useRole(), {
      wrapper: authWrapper(studentUser),
    });

    expect(result.current).toBe("STUDENT");
  });

  it("returns null when there is no user", () => {
    const { result } = renderHook(() => useRole(), {
      wrapper: authWrapper(null),
    });

    expect(result.current).toBeNull();
  });
});

describe("useHasRole", () => {
  it("matches the user role", () => {
    const { result } = renderHook(() => useHasRole("TEACHER", "STUDENT"), {
      wrapper: authWrapper(studentUser),
    });

    expect(result.current).toBe(true);
  });

  it("rejects roles the user does not have", () => {
    const { result } = renderHook(() => useHasRole("SUPER_ADMIN"), {
      wrapper: authWrapper(studentUser),
    });

    expect(result.current).toBe(false);
  });

  it("is false for anonymous users", () => {
    const { result } = renderHook(() => useHasRole("STUDENT"), {
      wrapper: authWrapper(null),
    });

    expect(result.current).toBe(false);
  });
});
