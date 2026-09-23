import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import LabeledTextBox from "./LabeledTextBox";

describe("LabeledTextBox", () => {
  it("renders the label with a colon and the children", () => {
    render(<LabeledTextBox label="Name">Alice</LabeledTextBox>);

    expect(screen.getByText("Name:")).toBeInTheDocument();
    expect(screen.getByText("Alice")).toBeInTheDocument();
  });

  it("merges the label and value classNames", () => {
    render(
      <LabeledTextBox
        label="Name"
        labelProps={{ className: "text-lg" }}
        valueProps={{ className: "italic" }}
      >
        Alice
      </LabeledTextBox>,
    );

    expect(screen.getByText("Name:")).toHaveClass("min-w-max", "text-lg");
    expect(screen.getByText("Alice")).toHaveClass("italic");
  });
});
