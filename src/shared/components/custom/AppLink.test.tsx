import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import AppLink from "./AppLink";

function renderAppLink(
  props: Partial<React.ComponentProps<typeof AppLink>> = {},
) {
  return render(
    <MemoryRouter>
      <AppLink to="/users" {...props}>
        Users
      </AppLink>
    </MemoryRouter>,
  );
}

describe("AppLink", () => {
  it("renders a link to the destination", () => {
    renderAppLink();

    expect(screen.getByRole("link", { name: "Users" })).toHaveAttribute(
      "href",
      "/users",
    );
  });

  it("marks a disabled link as aria-disabled", () => {
    renderAppLink({ disabled: true });

    const link = screen.getByRole("link", { name: "Users" });

    expect(link).toHaveAttribute("aria-disabled", "true");
    expect(link).toHaveClass(
      "aria-disabled:pointer-events-none",
      "aria-disabled:no-underline",
      "aria-disabled:cursor-default",
    );
  });

  it("does not mark an enabled link as disabled", () => {
    renderAppLink();

    const link = screen.getByRole("link", { name: "Users" });

    expect(link).not.toHaveAttribute("aria-disabled");
  });
});
