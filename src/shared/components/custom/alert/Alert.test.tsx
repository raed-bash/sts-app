import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Alert from "./Alert";
import { alertVariants } from "./alert-variants";

describe("Alert", () => {
  it("renders an alert with its children", () => {
    render(<Alert>Something happened</Alert>);

    expect(screen.getByRole("alert")).toHaveTextContent("Something happened");
  });

  it.each([
    ["danger", "lucide-info"],
    ["warning", "lucide-triangle-alert"],
    ["info", "lucide-info"],
    ["success", "lucide-circle-check"],
  ] as const)("renders the %s icon", (color, iconClass) => {
    const { container } = render(<Alert color={color}>Message</Alert>);

    expect(container.querySelector(`svg.${iconClass}`)).toBeInTheDocument();
  });

  it("defaults to the info variant", () => {
    const { container } = render(<Alert>Message</Alert>);

    expect(container.querySelector("svg.lucide-info")).toBeInTheDocument();
  });
});

describe("alertVariants", () => {
  it.each([
    ["danger", "border-destructive/40 bg-destructive/10 text-destructive"],
    ["warning", "border-warning/40 bg-warning/10 text-warning"],
    ["info", "border-info/40 bg-info/10 text-info"],
    ["success", "border-success/40 bg-success/10 text-success"],
  ] as const)("maps the %s color to its classes", (color, expected) => {
    expect(alertVariants({ color })).toContain(expected);
  });

  it("defaults to the info color", () => {
    expect(alertVariants()).toContain("bg-info/10");
  });
});
