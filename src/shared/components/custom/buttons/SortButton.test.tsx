import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import SortButton, { type SortButtonStatus } from "./SortButton";

function renderSortButton(status: SortButtonStatus, onClick = vi.fn()) {
  const utils = render(
    <SortButton sortStatus={status} onClick={onClick}>
      Username
    </SortButton>,
  );

  return { onClick, ...utils };
}

describe("SortButton", () => {
  it("renders its label content", () => {
    renderSortButton(null);

    expect(
      screen.getByRole("button", { name: "Username" }),
    ).toBeInTheDocument();
  });

  it.each([
    ["asc", "desc"],
    ["desc", null],
    [null, "asc"],
  ] as const)("advances from %s to %s on click", async (from, to) => {
    const user = userEvent.setup();
    const { onClick } = renderSortButton(from);

    await user.click(screen.getByRole("button", { name: "Username" }));

    expect(onClick).toHaveBeenCalledWith(to, expect.any(Object));
  });

  it("flips the indicator to the ascending rotation", () => {
    const { container } = renderSortButton("asc");

    expect(container.querySelector("svg")).toHaveClass("rotate-180");
  });

  it("points the indicator down for descending order", () => {
    const { container } = renderSortButton("desc");

    expect(container.querySelector("svg")).toHaveClass("rotate-0");
  });

  it("keeps the indicator neutral without a sort status", () => {
    const { container } = renderSortButton(null);

    expect(container.querySelector("svg")).toHaveClass("rotate-90");
  });
});
