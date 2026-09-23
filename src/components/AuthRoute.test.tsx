import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes, useLocation } from "react-router";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import AuthRoute from "./AuthRoute";
import PrivateRoute from "./PrivateRoute";

const LocationProbe = () => {
  const location = useLocation();

  return <div data-testid="path">{location.pathname}</div>;
};

function authContext(loggedIn: boolean): AuthContextType {
  return {
    loggedIn,
    login: () => {},
    logout: () => {},
    user: null,
  };
}

describe("AuthRoute", () => {
  it("renders children for anonymous visitors", () => {
    render(
      <AuthContext.Provider value={authContext(false)}>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <div data-testid="content">login</div>
                </AuthRoute>
              }
            />
            <Route path="/home" element={<LocationProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByTestId("content")).toHaveTextContent("login");
  });

  it("redirects logged-in users to home", () => {
    render(
      <AuthContext.Provider value={authContext(true)}>
        <MemoryRouter initialEntries={["/login"]}>
          <Routes>
            <Route
              path="/login"
              element={
                <AuthRoute>
                  <div data-testid="content">login</div>
                </AuthRoute>
              }
            />
            <Route path="/home" element={<LocationProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    expect(screen.getByTestId("path")).toHaveTextContent("/home");
  });
});

describe("PrivateRoute", () => {
  it("renders children for logged-in users", () => {
    render(
      <AuthContext.Provider value={authContext(true)}>
        <MemoryRouter initialEntries={["/admins"]}>
          <Routes>
            <Route
              path="/admins"
              element={
                <PrivateRoute>
                  <div data-testid="content">dashboard</div>
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LocationProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.getByTestId("content")).toHaveTextContent("dashboard");
  });

  it("redirects anonymous users to login", () => {
    render(
      <AuthContext.Provider value={authContext(false)}>
        <MemoryRouter initialEntries={["/admins"]}>
          <Routes>
            <Route
              path="/admins"
              element={
                <PrivateRoute>
                  <div data-testid="content">dashboard</div>
                </PrivateRoute>
              }
            />
            <Route path="/login" element={<LocationProbe />} />
          </Routes>
        </MemoryRouter>
      </AuthContext.Provider>,
    );

    expect(screen.queryByTestId("content")).not.toBeInTheDocument();
    expect(screen.getByTestId("path")).toHaveTextContent("/login");
  });
});
