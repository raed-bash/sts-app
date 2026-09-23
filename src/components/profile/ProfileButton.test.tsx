import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import ProfileButton from "./ProfileButton";

vi.mock("./ProfileMenu", () => ({
  default: ({ isOpen }: { isOpen: boolean }) => (
    <div data-testid="menu">{String(isOpen)}</div>
  ),
}));

describe("ProfileButton", () => {
  it("opens and closes the profile menu", () => {
    render(<ProfileButton />);

    const button = screen.getByRole("button", { expanded: false });

    fireEvent.click(button);

    expect(screen.getByTestId("menu")).toHaveTextContent("true");
    expect(screen.getByRole("button", { expanded: true })).toBeInTheDocument();

    fireEvent.click(button);

    expect(screen.getByTestId("menu")).toHaveTextContent("false");
  });

  it("closes the menu when clicking outside", () => {
    render(<ProfileButton />);

    fireEvent.click(screen.getByRole("button", { expanded: false }));

    expect(screen.getByTestId("menu")).toHaveTextContent("true");

    fireEvent.mouseDown(document.body);

    expect(screen.getByTestId("menu")).toHaveTextContent("false");
  });
});
