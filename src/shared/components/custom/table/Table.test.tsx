import { afterEach, describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Table, { type TableProps, type TableColumn } from "./Table";

type Row = {
  id: number;
  username: string;
};

const rows: Row[] = [
  { id: 1, username: "alice" },
  { id: 2, username: "bob" },
];

const columns: TableColumn<Row>[] = [
  { name: "id", headerName: "common:table.id" },
  {
    name: "username",
    headerName: "common:table.username",
    filterable: true,
    filterProps: { type: "text" },
    sort: true,
  },
];

function renderTable(overrides: Partial<TableProps<Row>> = {}) {
  const props: TableProps<Row> = {
    data: { rows, columns },
    ordering: {
      orderedColumns: [],
      onOrderedColumnsChange: vi.fn(),
    },
    filtering: {
      filters: [],
      onFiltersChange: vi.fn(),
      logicalOperator: "AND",
      onLogicalOperatorChange: vi.fn(),
    },
    pagination: {
      currentPage: 1,
      count: rows.length,
      perPage: 10,
      onPageChange: vi.fn(),
    },
    ...overrides,
  };

  render(<Table {...props} />);

  return props;
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe("Table", () => {
  it("renders translated headers and raw row values", () => {
    renderTable();

    expect(screen.getByRole("columnheader", { name: "#" })).toBeInTheDocument();
    expect(
      screen.getByRole("columnheader", { name: "Username" }),
    ).toBeInTheDocument();

    expect(screen.getByRole("cell", { name: "alice" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "bob" })).toBeInTheDocument();
  });

  it("renders custom cell content through getCell", () => {
    const overrides = renderTable({
      data: {
        rows,
        columns: [
          {
            name: "username",
            headerName: "common:table.username",
            getCell: (value: string) => <strong>{value.toUpperCase()}</strong>,
          },
        ],
      },
    });

    void overrides;

    expect(screen.getByRole("cell", { name: "ALICE" })).toBeInTheDocument();
  });

  it("shows the empty state when there are no rows", () => {
    renderTable({ data: { rows: [], columns } });

    expect(screen.getByText("No data")).toBeInTheDocument();
  });

  it("shows the loading overlay while the initial data is pending", () => {
    renderTable({
      data: { rows: [], columns },
      loading: { loading: true },
    });

    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  describe("selection", () => {
    it("selects a row from its checkbox", async () => {
      const user = userEvent.setup();
      const onSelectRows = vi.fn();

      renderTable({
        selection: {
          selectable: true,
          selectedRows: new Map(),
          onSelectRows,
        },
      });

      const rowCell = screen.getByRole("cell", { name: "bob" });

      const checkbox = within(rowCell.closest("tr")!).getByRole("checkbox");

      await user.click(checkbox);

      const next = onSelectRows.mock.calls[0][0] as Map<number, Row>;

      expect([...next.keys()]).toEqual([2]);
    });

    it("deselects a row from its checkbox", async () => {
      const user = userEvent.setup();
      const onSelectRows = vi.fn();

      renderTable({
        selection: {
          selectable: true,
          selectedRows: new Map([[1, rows[0]]]),
          onSelectRows,
        },
      });

      const rowCell = screen.getByRole("cell", { name: "alice" });

      const checkbox = within(rowCell.closest("tr")!).getByRole("checkbox");

      await user.click(checkbox);

      const next = onSelectRows.mock.calls[0][0] as Map<number, Row>;

      expect(next.size).toBe(0);
    });

    it("selects every page row from the select-all checkbox", async () => {
      const user = userEvent.setup();
      const onSelectRows = vi.fn();

      renderTable({
        selection: {
          selectable: true,
          selectedRows: new Map(),
          onSelectRows,
        },
      });

      const selectAll = screen
        .getAllByRole("columnheader")[0]
        .querySelector("input[type=checkbox]")!;

      await user.click(selectAll);

      const next = onSelectRows.mock.calls[0][0] as Map<number, Row>;

      expect([...next.keys()].sort()).toEqual([1, 2]);
    });
  });

  it("forwards sort clicks with the next status", async () => {
    const user = userEvent.setup();
    const onSortChange = vi.fn();

    renderTable({
      sorting: { sortStatuses: { username: "asc" }, onSortChange },
    });

    await user.click(screen.getByRole("button", { name: "Username" }));

    expect(onSortChange).toHaveBeenCalledWith("username", "desc");
  });

  it("adds a filter row from a filterable column header", async () => {
    const user = userEvent.setup();
    const onFiltersChange = vi.fn();

    renderTable({
      filtering: {
        filters: [],
        onFiltersChange,
        logicalOperator: "AND",
        onLogicalOperatorChange: vi.fn(),
      },
    });

    const columnHeader = screen.getByRole("columnheader", { name: "Username" });

    const menuButton = within(columnHeader).getAllByRole("button").at(-1)!;

    await user.click(menuButton);

    await user.click(await screen.findByRole("button", { name: "Filter" }));

    expect(onFiltersChange).toHaveBeenCalledWith([
      { name: "username", operation: "contains", value: undefined },
    ]);
  });

  describe("csv export", () => {
    it("copies the rows as tab-separated values", async () => {
      const user = userEvent.setup();
      const writeText = vi.fn();

      Object.defineProperty(navigator, "clipboard", {
        configurable: true,
        value: { writeText },
      });

      renderTable({ csv: { fileName: "users" } });

      await user.click(
        screen.getByRole("button", { name: "Export table as CSV" }),
      );

      await user.click(await screen.findByText("Copy as CSV"));

      expect(writeText).toHaveBeenCalledWith(
        expect.stringContaining("#\tUsername"),
      );

      expect(writeText).toHaveBeenCalledWith(
        expect.stringContaining("1\talice"),
      );
    });

    it("downloads a csv file with the configured file name", async () => {
      const user = userEvent.setup();
      const createObjectURL = vi.fn(() => "blob:table");

      vi.stubGlobal("URL", { createObjectURL, revokeObjectURL: vi.fn() });

      let downloaded = "";
      const clickSpy = vi
        .spyOn(HTMLAnchorElement.prototype, "click")
        .mockImplementation(function (this: HTMLAnchorElement) {
          downloaded = this.download;
        });

      renderTable({ csv: { fileName: "users" } });

      await user.click(
        screen.getByRole("button", { name: "Export table as CSV" }),
      );

      await user.click(await screen.findByText("Download CSV"));

      expect(createObjectURL).toHaveBeenCalled();
      expect(clickSpy).toHaveBeenCalled();
      expect(downloaded).toBe("users.csv");
    });

    it("disables the export button when there are no rows", () => {
      renderTable({ data: { rows: [], columns }, csv: {} });

      expect(
        screen.getByRole("button", { name: "Export table as CSV" }),
      ).toBeDisabled();
    });
  });

  describe("pagination footer", () => {
    it("requests the next page from the pagination controls", async () => {
      const user = userEvent.setup();
      const onPageChange = vi.fn();

      renderTable({
        pagination: {
          currentPage: 1,
          count: 20,
          perPage: 10,
          onPageChange,
        },
      });

      await user.click(screen.getByRole("button", { name: "Page 2" }));

      expect(onPageChange).toHaveBeenCalledWith(2);
    });

    it("loads more rows when the load-more button is pressed", async () => {
      const user = userEvent.setup();
      const onLoadMore = vi.fn();

      renderTable({
        pagination: {
          currentPage: 1,
          count: rows.length,
          onPageChange: vi.fn(),
          loadMore: {
            enabled: false,
            onLoadMore,
            hasMore: true,
            isFetching: false,
            loadedCount: rows.length,
          },
        },
      });

      await user.click(screen.getByRole("button", { name: "Load more" }));

      expect(onLoadMore).toHaveBeenCalled();
    });

    it("shows the loaded count inside the load-more button", () => {
      renderTable({
        pagination: {
          currentPage: 1,
          count: rows.length,
          onPageChange: vi.fn(),
          loadMore: {
            enabled: true,
            onLoadMore: vi.fn(),
            hasMore: true,
            isFetching: false,
            loadedCount: rows.length,
          },
        },
      });

      expect(
        screen.getByRole("button", { name: "Load more (2)" }),
      ).toBeInTheDocument();
    });
  });
});
