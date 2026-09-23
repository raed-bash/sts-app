import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LabeledField from "./LabeledField";

describe("LabeledField", () => {
  it("renders a text input with an associated label", () => {
    render(
      <LabeledField
        type="text"
        id="email"
        name="email"
        title="Email"
        value="a@b.c"
        onChange={vi.fn()}
      />,
    );

    const input = screen.getByRole("textbox") as HTMLInputElement;

    expect(input).toHaveAttribute("id", "email");
    expect(input).toHaveAttribute("name", "email");
    expect(input.value).toBe("a@b.c");

    const label = screen.getByText("Email");

    expect(label).toHaveAttribute("for", "email");
  });

  it("marks the field as invalid when a helperText is provided", () => {
    const { container } = render(
      <LabeledField
        type="text"
        name="email"
        helperText="Wrong format"
        onChange={vi.fn()}
      />,
    );

    expect(container.querySelector("[data-invalid]")).toBeInTheDocument();
    expect(screen.getByText("Wrong format")).toBeInTheDocument();
  });

  it("treats the helperText as a description when errors are disabled", () => {
    const { container } = render(
      <LabeledField
        type="text"
        name="email"
        helperText="Helper for you"
        error={false}
        onChange={vi.fn()}
      />,
    );

    expect(container.querySelector("[data-invalid]")).toBeNull();
    expect(screen.getByText("Helper for you")).toBeInTheDocument();
  });

  it("shows a skeleton instead of the control while loading", () => {
    const { container } = render(
      <LabeledField loading type="text" name="email" onChange={vi.fn()} />,
    );

    expect(container.querySelector("input")).toBeNull();
    expect(
      container.querySelector('[data-slot="skeleton"]'),
    ).toBeInTheDocument();
  });

  it("forwards changes from the underlying input", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    render(<LabeledField type="text" name="email" onChange={onChange} />);

    await user.type(screen.getByRole("textbox"), "x");

    expect(onChange).toHaveBeenLastCalledWith(
      expect.objectContaining({
        target: expect.objectContaining({ value: "x" }),
      }),
    );
  });

  it("renders a checkbox control for the checkbox type", () => {
    const { container } = render(
      <LabeledField type="checkbox" name="active" onChange={vi.fn()} />,
    );

    expect(
      container.querySelector('input[type="checkbox"]'),
    ).toBeInTheDocument();
  });

  it("renders a password control with the show toggle", () => {
    const { container } = render(
      <LabeledField type="password" name="password" onChange={vi.fn()} />,
    );

    expect(
      container.querySelector('input[type="password"]'),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Show password" }),
    ).toBeInTheDocument();
  });

  it("renders a textarea control for the textarea type", () => {
    const { container } = render(
      <LabeledField
        type="textarea"
        name="bio"
        title="Bio"
        onChange={vi.fn()}
      />,
    );

    expect(container.querySelector("textarea")).toBeInTheDocument();
    expect(screen.getByText("Bio")).toBeInTheDocument();
  });

  it("renders a native select with its options", () => {
    const { container } = render(
      <LabeledField type="nativeSelect" name="role" onChange={vi.fn()}>
        <option value="teacher">Teacher</option>
        <option value="admin">Admin</option>
      </LabeledField>,
    );

    const select = container.querySelector("select") as HTMLSelectElement;

    expect(select).toHaveAttribute("name", "role");
    expect(select.options).toHaveLength(2);
    expect(select.options[0].textContent).toBe("Teacher");
  });
});
