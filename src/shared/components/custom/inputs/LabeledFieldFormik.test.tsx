import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import LabeledFieldFormik from "./LabeledFieldFormik";

describe("LabeledFieldFormik", () => {
  it("binds a text control to the formik value", () => {
    render(
      <LabeledFieldFormik
        type="text"
        name="title"
        title="Title"
        values={{ title: "My title" }}
        errors={{}}
        onChange={vi.fn()}
      />,
    );

    expect((screen.getByRole("textbox") as HTMLInputElement).value).toBe(
      "My title",
    );
  });

  it("surfaces a formik error as the helper text", () => {
    render(
      <LabeledFieldFormik
        type="text"
        name="title"
        title="Title"
        values={{ title: "" }}
        errors={{ title: "Title is required" }}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByText("Title is required")).toBeInTheDocument();
    expect(
      screen.getByRole("textbox").closest("[data-invalid]"),
    ).toBeInTheDocument();
  });

  it("marks an empty checkbox as unchecked", () => {
    render(
      <LabeledFieldFormik
        type="checkbox"
        name="active"
        values={{}}
        errors={{}}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("checks the checkbox from the formik value", () => {
    render(
      <LabeledFieldFormik
        type="checkbox"
        name="active"
        values={{ active: true }}
        errors={{}}
        onChange={vi.fn()}
      />,
    );

    expect(screen.getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true",
    );
  });
});
