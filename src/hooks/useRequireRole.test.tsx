import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import type { UserRole } from "@/constants/user-role";
import { useRequireRole } from "./useRequireRole";

const teacherUser = {
  id: 1,
  username: "teacher",
  status: "ACTIVE",
  role: "TEACHER",
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

  return value;
}

const LocationProbe = () => {
  const location = useLocation();

  return <div data-testid="path">{location.pathname}</div>;
};

const Protected = ({ roles }: { roles: UserRole[] }) => {
  const allowed = useRequireRole(roles, "/denied");

  return <div data-testid="allowed">{String(allowed)}</div>;
};

function renderProtected(user: AuthContextType["user"], roles: UserRole[]) {
  return render(
    <AuthContext.Provider value={authWrapper(user)}>
      <MemoryRouter initialEntries={["/admin"]}>
        <Routes>
          <Route path="/admin" element={<Protected roles={roles} />} />
          <Route path="/denied" element={<LocationProbe />} />
        </Routes>
      </MemoryRouter>
    </AuthContext.Provider>,
  );
}

describe("useRequireRole", () => {
  it("allows a user with a permitted role", () => {
    renderProtected(teacherUser, ["TEACHER", "SUPER_ADMIN"]);

    expect(screen.getByTestId("allowed")).toHaveTextContent("true");
    expect(screen.queryByTestId("path")).not.toBeInTheDocument();
  });

  it("navigates away when the role is not permitted", () => {
    renderProtected(teacherUser, ["SUPER_ADMIN"]);

    expect(screen.queryByTestId("allowed")).not.toBeInTheDocument();
    expect(screen.getByTestId("path")).toHaveTextContent("/denied");
  });

  it("redirects anonymous users", () => {
    renderProtected(null, ["TEACHER"]);

    expect(screen.queryByTestId("allowed")).not.toBeInTheDocument();
    expect(screen.getByTestId("path")).toHaveTextContent("/denied");
  });
});
