import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import Loading from "./Loading";
import LinearLoading from "./LinearLoading";

describe("Loading", () => {
  it("renders a status region with an accessible label", () => {
    render(<Loading />);

    const status = screen.getByRole("status");

    expect(status).toHaveTextContent("Loading...");
    expect(status.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("applies the default size and merges the className", () => {
    const { container } = render(<Loading className="text-red-500" />);

    expect(container.firstChild).toHaveClass("w-8", "h-8", "text-red-500");
  });
});

describe("LinearLoading", () => {
  it("renders the loader line with the primary accent", () => {
    const { container } = render(<LinearLoading />);

    expect(container.querySelector(".loader-line")).toBeInTheDocument();
    expect(container.querySelector(".loader-line")).toHaveClass(
      "before:bg-primary",
    );
  });
});
