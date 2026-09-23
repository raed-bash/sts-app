import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Checkbox from "./Checkbox";

describe("Checkbox", () => {
  it("renders an unchecked checkbox by default", () => {
    render(<Checkbox onChange={vi.fn()} />);

    const input = screen.getByRole("checkbox");

    expect(input).not.toBeChecked();
    expect(input).not.toHaveAttribute("aria-checked", "true");
  });

  it("renders a checked state with the check icon", () => {
    const { container } = render(<Checkbox checked onChange={vi.fn()} />);

    const input = screen.getByRole("checkbox");

    expect(input).toHaveAttribute("aria-checked", "true");
    expect(container.querySelector("svg.lucide-check")).toBeInTheDocument();
  });

  it("reports the checked state through change events", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox onChange={onChange} />);

    await user.click(screen.getByRole("checkbox"));

    expect(onChange).toHaveBeenCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ checked: true }),
      }),
    );
  });

  it("ignores clicks while disabled", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<Checkbox disabled onChange={onChange} />);

    await user.click(screen.getByRole("checkbox"));

    expect(onChange).not.toHaveBeenCalled();
  });

  it("shows a dash for the indeterminate secondary status", () => {
    const { container } = render(<Checkbox checked secondaryStatus />);

    const input = screen.getByRole("checkbox");

    expect(input).toHaveAttribute("aria-checked", "false");
    expect(container.querySelector("svg.lucide-check")).toBeNull();
    expect(container.querySelector("svg line")).toBeInTheDocument();
  });

  it("applies the active styling when checked", () => {
    const { container } = render(<Checkbox checked onChange={vi.fn()} />);

    expect(container.querySelector("span")).toHaveClass("bg-primary");
  });
});
