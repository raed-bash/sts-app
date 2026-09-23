import { describe, expect, it } from "vitest";
import { render } from "@testing-library/react";
import TableHeadCell from "./TableHeadCell";

describe("TableHeadCell", () => {
  it("renders a header cell with the base classes", () => {
    const { container } = render(<TableHeadCell>Name</TableHeadCell>);

    const cell = container.querySelector("th") as HTMLTableHeaderCellElement;

    expect(cell.textContent).toBe("Name");
    expect(cell.className).toContain("text-xs");
    expect(cell.className).toContain("font-semibold");
    expect(cell.className).toContain("uppercase");
  });

  it("uses the cell text as the title for string children", () => {
    render(<TableHeadCell>Role</TableHeadCell>);

    expect(document.querySelector("th")).toHaveAttribute("title", "Role");
  });

  it("leaves the title empty for non-string children", () => {
    render(
      <TableHeadCell>
        <span>Complex</span>
      </TableHeadCell>,
    );

    expect(document.querySelector("th")).toHaveAttribute("title", "");
  });

  it("merges an extra className", () => {
    const { container } = render(
      <TableHeadCell className="text-blue-500">Name</TableHeadCell>,
    );

    expect(container.querySelector("th")).toHaveClass("text-blue-500");
  });
});
