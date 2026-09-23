import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import { Search, X } from "lucide-react";
import InputIcon from "./InputIcon";

describe("InputIcon", () => {
  it("renders a text input", () => {
    const { container } = render(<InputIcon aria-label="query" />);

    expect(container.querySelector("input")).toHaveAttribute(
      "aria-label",
      "query",
    );
  });

  it("renders the start and end icons", () => {
    const { container } = render(
      <InputIcon StartIcon={<Search />} EndIcon={<X />} />,
    );

    expect(container.querySelector("svg")).toBeInTheDocument();
    expect(container.querySelectorAll("svg")).toHaveLength(2);
  });

  it("marks the input as invalid from the error flag", () => {
    const { container } = render(<InputIcon error aria-label="query" />);

    expect(container.querySelector("input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("marks the input as invalid from the aria-invalid attribute", () => {
    const { container } = render(
      <InputIcon aria-invalid="true" aria-label="query" />,
    );

    expect(container.querySelector("input")).toHaveAttribute(
      "aria-invalid",
      "true",
    );
  });

  it("leaves the input valid when neither flag is set", () => {
    const { container } = render(<InputIcon aria-label="query" />);

    expect(container.querySelector("input")).not.toHaveAttribute(
      "aria-invalid",
    );
  });

  it("forwards the disabled state", () => {
    const { container } = render(<InputIcon disabled aria-label="query" />);

    expect(container.querySelector("input")).toBeDisabled();
  });

  it("applies the iconClassName to the icon wrappers", () => {
    const { container } = render(
      <InputIcon StartIcon={<Search />} iconClassName="text-muted" />,
    );

    expect(container.querySelector("span")).toHaveClass("text-muted");
  });
});
