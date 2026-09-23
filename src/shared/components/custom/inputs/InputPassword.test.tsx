import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import InputPassword from "./InputPassword";

describe("InputPassword", () => {
  it("renders a masked password input with a show toggle", () => {
    render(<InputPassword name="password" placeholder="Password" />);

    const input = screen.getByPlaceholderText("Password");

    expect(input).toHaveAttribute("type", "password");
    expect(
      screen.getByRole("button", { name: "Show password" }),
    ).toBeInTheDocument();
  });

  it("reveals the value when the toggle is pressed", async () => {
    const user = userEvent.setup();

    const { container } = render(
      <InputPassword name="password" value="secret" onChange={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Show password" }));

    const input = container.querySelector("input") as HTMLInputElement;

    expect(input).toHaveAttribute("type", "text");
    expect(input.value).toBe("secret");
    expect(
      screen.getByRole("button", { name: "Hide password" }),
    ).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Hide password" }));

    expect(container.querySelector("input")).toHaveAttribute(
      "type",
      "password",
    );
  });

  it("disables the toggle together with the input", () => {
    render(<InputPassword disabled name="password" />);

    expect(
      screen.getByRole("button", { name: "Show password" }),
    ).toBeDisabled();
  });

  it("forwards change events from the underlying input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    const { container } = render(
      <InputPassword name="password" onChange={onChange} />,
    );

    await user.type(container.querySelector("input")!, "hunter2");

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "hunter2" }),
      }),
    );
  });

  it("marks the input and icon as invalid", () => {
    const { container } = render(
      <InputPassword name="password" aria-invalid="true" />,
    );

    expect(container.querySelector("input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );

    const icon = container.querySelector("svg.lucide-eye")!;

    expect(icon).toHaveClass("stroke-destructive");
  });
});
