import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useAuthContext } from "./AuthContext";
import AuthProvider from "./AuthProvider";
import type { LoginResponseDto } from "@/features/auth/dtos/login-response.dto";

const user = {
  id: 1,
  username: "first",
  status: "ACTIVE",
  role: "STUDENT",
  createdAt: new Date("2020-01-01"),
  student: {
    id: 1,
    fullName: "First Student",
    user: {} as never,
    gender: "MALE",
    isNameViewed: false,
  },
} satisfies LoginResponseDto["user"];

function Consumer() {
  const { loggedIn, user: currentUser, login, logout } = useAuthContext();

  return (
    <div>
      <div data-testid="logged">{String(loggedIn)}</div>
      <div data-testid="user">{currentUser?.username ?? "none"}</div>
      <button onClick={() => login({ token: "tok", user })}>login</button>
      <button onClick={logout}>logout</button>
    </div>
  );
}

function renderProvider() {
  return render(
    <AuthProvider>
      <Consumer />
    </AuthProvider>,
  );
}

describe("AuthProvider", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("starts logged out when nothing is stored", () => {
    renderProvider();

    expect(screen.getByTestId("logged")).toHaveTextContent("false");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });

  it("login stores the token and user", () => {
    renderProvider();

    fireEvent.click(screen.getByText("login"));

    expect(screen.getByTestId("logged")).toHaveTextContent("true");
    expect(screen.getByTestId("user")).toHaveTextContent("first");
    expect(localStorage.getItem("token")).toBe("tok");
    expect(localStorage.getItem("user")).toBe(JSON.stringify(user));
  });

  it("logout clears the stored session", () => {
    renderProvider();

    fireEvent.click(screen.getByText("login"));
    fireEvent.click(screen.getByText("logout"));

    expect(screen.getByTestId("logged")).toHaveTextContent("false");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
    expect(localStorage.getItem("token")).toBeNull();
    expect(localStorage.getItem("user")).toBeNull();
  });

  it("resumes an existing session from storage", () => {
    localStorage.setItem("token", "tok");
    localStorage.setItem("user", JSON.stringify(user));

    renderProvider();

    expect(screen.getByTestId("logged")).toHaveTextContent("true");
    expect(screen.getByTestId("user")).toHaveTextContent("first");
  });

  it("ignores a corrupt stored user", () => {
    localStorage.setItem("token", "tok");
    localStorage.setItem("user", "not-json");

    renderProvider();

    expect(screen.getByTestId("logged")).toHaveTextContent("true");
    expect(screen.getByTestId("user")).toHaveTextContent("none");
  });
});
