import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableSelectedRows from "./TableSelectedRows";

type Row = { id: number; username: string };

const rows: Row[] = [
  { id: 1, username: "alice" },
  { id: 2, username: "bob" },
];

function renderSelectedRows({
  selectedRows = new Map<string | number, Row>([
    [1, rows[0]],
    [2, rows[1]],
  ]),
  onSelectRows = vi.fn(),
  getSelectionLabel,
}: {
  selectedRows?: Map<string | number, Row>;
  onSelectRows?: (selectedRows: Map<string | number, Row>) => void;
  getSelectionLabel?: (row: Row) => React.ReactNode;
} = {}) {
  render(
    <TableSelectedRows<Row>
      selection={{ selectedRows, onSelectRows, getSelectionLabel }}
    />,
  );

  return { onSelectRows };
}

describe("TableSelectedRows", () => {
  it("shows the selected count on the trigger button", () => {
    renderSelectedRows();

    expect(
      screen.getByRole("button", { name: "Selected (2)" }),
    ).toBeInTheDocument();
  });

  it("clears every selection from the popover", async () => {
    const user = userEvent.setup();
    const onSelectRows = vi.fn();

    renderSelectedRows({ onSelectRows });

    await user.click(screen.getByRole("button", { name: "Selected (2)" }));

    await user.click(await screen.findByRole("button", { name: "Clear all" }));

    expect(onSelectRows).toHaveBeenCalledWith(new Map());
  });

  it("drops a single row from the selection", async () => {
    const user = userEvent.setup();
    const onSelectRows = vi.fn();

    renderSelectedRows({ onSelectRows });

    await user.click(screen.getByRole("button", { name: "Selected (2)" }));

    const singleRemove = await screen.findAllByTitle("Remove from selection");

    await user.click(singleRemove[0]);

    const next = onSelectRows.mock.calls[0][0] as Map<number, Row>;

    expect([...next.keys()]).toEqual([2]);
  });

  it("renders a custom selection label for each row", async () => {
    const user = userEvent.setup();

    renderSelectedRows({
      getSelectionLabel: (row: Row) => `@${row.username}`,
    });

    await user.click(screen.getByRole("button", { name: "Selected (2)" }));

    expect(await screen.findByText("@alice")).toBeInTheDocument();
    expect(screen.getByText("@bob")).toBeInTheDocument();
  });

  it("falls back to the row id when no label function is provided", async () => {
    const user = userEvent.setup();

    renderSelectedRows();

    await user.click(screen.getByRole("button", { name: "Selected (2)" }));

    expect(await screen.findByText("#1")).toBeInTheDocument();
    expect(screen.getByText("#2")).toBeInTheDocument();
  });

  it("shows the empty hint when nothing is selected", async () => {
    const user = userEvent.setup();

    renderSelectedRows({ selectedRows: new Map() });

    await user.click(screen.getByRole("button", { name: "Selected (0)" }));

    expect(await screen.findByText("No rows selected.")).toBeInTheDocument();
  });
});
