import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { renderHook } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableHeader from "./TableHeader";
import type { TableColumn } from "../Table";
import type { UseTableCreateToggleColumnsClickHandler } from "../hooks/useTable";
import { useFilter } from "@/shared/components/custom/filter/useFilter";
import type { TableDensity } from "../constants/table-density";

type Row = { id: number; username: string };

const columns: TableColumn<Row>[] = [
  { name: "id", headerName: "common:table.id" },
  {
    name: "username",
    headerName: "common:table.username",
    filterable: true,
    filterProps: { type: "text" },
  },
];

function renderHeader(
  overrides: {
    density?: {
      density: TableDensity;
      onDensityChange: (d: TableDensity) => void;
    };
    onReset?: () => void;
    toggleColumns?: UseTableCreateToggleColumnsClickHandler<Row>;
    onCopy?: () => void;
    onDownload?: () => void;
  } = {},
) {
  const { result } = renderHook(() =>
    useFilter({
      filters: [],
      onFiltersChange: vi.fn(),
      logicalOperator: "AND",
      onLogicalOperatorChange: vi.fn(),
    }),
  );

  const props = {
    data: { columns, setColumns: vi.fn() },
    selection: {
      selectedRows: new Map(),
      onSelectRows: vi.fn(),
      getSelectionLabel: undefined,
    },
    filtering: { filterUtils: result.current },
    density: overrides.density ?? {
      density: "compact" as TableDensity,
      onDensityChange: vi.fn(),
    },
    csv: {
      onCopy: overrides.onCopy ?? vi.fn(),
      onDownload: overrides.onDownload ?? vi.fn(),
      disabled: false,
    },
    hideableColumns: true as const,
    hiddenColumns: new Set<string>(),
    onReset: overrides.onReset ?? vi.fn(),
    createToggleColumnsClickHandler:
      overrides.toggleColumns ?? vi.fn(() => vi.fn()),
  };

  render(<TableHeader<Row> {...props} />);

  return props;
}

describe("TableHeader", () => {
  it("renders the filter, density, columns and csv controls", () => {
    renderHeader();

    expect(screen.getByRole("button", { name: "Filters" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Table density" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Export table as CSV" }),
    ).toBeInTheDocument();
  });

  it("changes the density from the density menu", async () => {
    const user = userEvent.setup();
    const onDensityChange = vi.fn();

    renderHeader({
      density: { density: "compact", onDensityChange },
    });

    await user.click(screen.getByRole("button", { name: "Table density" }));

    await user.click(await screen.findByText("Comfortable"));

    expect(onDensityChange).toHaveBeenCalledWith("comfortable");
  });

  it("toggles a column's visibility from the columns menu", async () => {
    const user = userEvent.setup();
    const toggleColumns = vi.fn(() => vi.fn());

    renderHeader({
      toggleColumns:
        toggleColumns as UseTableCreateToggleColumnsClickHandler<Row>,
    });

    await user.click(screen.getByRole("button", { name: "" }));

    const usernameItem = await screen.findByRole("button", {
      name: /Username$/,
    });

    await user.click(usernameItem);

    expect(toggleColumns).toHaveBeenCalledWith(
      expect.objectContaining({ name: "username" }),
    );
  });

  it("resets hidden columns from the columns menu", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    renderHeader({ onReset });

    await user.click(screen.getByRole("button", { name: "" }));

    await user.click(await screen.findByRole("button", { name: "Reset" }));

    expect(onReset).toHaveBeenCalled();
  });

  it("runs the csv copy and download handlers from the export menu", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();
    const onDownload = vi.fn();

    renderHeader({ onCopy, onDownload });

    await user.click(
      screen.getByRole("button", { name: "Export table as CSV" }),
    );

    await user.click(await screen.findByText("Copy as CSV"));

    expect(onCopy).toHaveBeenCalled();

    await user.click(
      screen.getByRole("button", { name: "Export table as CSV" }),
    );

    await user.click(await screen.findByText("Download CSV"));

    expect(onDownload).toHaveBeenCalled();
  });
});
