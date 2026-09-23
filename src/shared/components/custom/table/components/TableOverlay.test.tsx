import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import TableOverlay from "./TableOverlay";

describe("TableOverlay", () => {
  it("renders the children inside a spanned cell", () => {
    const { container } = render(<TableOverlay>Loading...</TableOverlay>);

    const row = container.querySelector("tr");

    expect(row).toBeInTheDocument();
    expect(row!.querySelector("td")).toHaveAttribute("colspan", "1");
    expect(row!.textContent).toBe("Loading...");
  });

  it("applies the requested colSpan", () => {
    const { container } = render(
      <TableOverlay colSpan={4}>Loading...</TableOverlay>,
    );

    expect(container.querySelector("td")).toHaveAttribute("colspan", "4");
  });

  it("uses the default minimum height when none is given", () => {
    const { container } = render(<TableOverlay>Loading...</TableOverlay>);

    expect(container.querySelector("td")).toHaveClass("h-56");
  });

  it("sizes the cell from the minHeight instead", () => {
    const { container } = render(
      <TableOverlay minHeight={320}>Loading...</TableOverlay>,
    );

    const cell = container.querySelector("td") as HTMLTableCellElement;

    expect(cell.style.height).toBe("320px");
    expect(cell).not.toHaveClass("h-56");
  });

  it("forwards row and cell props", () => {
    const { container } = render(
      <TableOverlay
        elements={{
          rowProps: { title: "overlay-row" },
          cellProps: { className: "bg-muted" },
        }}
      >
        Loading...
      </TableOverlay>,
    );

    expect(container.querySelector("tr")).toHaveAttribute(
      "title",
      "overlay-row",
    );
    expect(container.querySelector("td")).toHaveClass("bg-muted");
  });
});
