import { describe, expect, it, vi } from "vitest";
import { useState } from "react";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterBoard, { type FilterBoardProps } from "./FilterBoard";
import type { FilterField } from "./types";
import type { FilterCondition, UseFilterUpdateHandler } from "./useFilter";

const fields: FilterField[] = [
  {
    name: "username",
    label: "common:table.username",
    filterProps: { type: "text" },
  },
  { name: "role", label: "common:table.role", filterProps: { type: "select" } },
  { name: "age", label: "Age", filterProps: { type: "number" } },
];

function renderBoard(
  overrides: {
    filtering?: Partial<FilterBoardProps["filtering"]>;
    popup?: Partial<NonNullable<FilterBoardProps["popup"]>>;
  } = {},
) {
  const filtering: FilterBoardProps["filtering"] = {
    filters: overrides.filtering?.filters ?? [],
    onAddFilter: overrides.filtering?.onAddFilter ?? vi.fn(),
    onUpdateFilter: overrides.filtering?.onUpdateFilter ?? vi.fn(),
    onDeleteFilter: overrides.filtering?.onDeleteFilter ?? vi.fn(),
    onClearFilters: overrides.filtering?.onClearFilters ?? vi.fn(),
    logicalOperator: overrides.filtering?.logicalOperator ?? "AND",
    onLogicalOperatorChange:
      overrides.filtering?.onLogicalOperatorChange ?? vi.fn(),
  };

  const popup: NonNullable<FilterBoardProps["popup"]> = {
    isOpen: overrides.popup?.isOpen ?? true,
    onOpen: overrides.popup?.onOpen ?? vi.fn(),
    onClose: overrides.popup?.onClose ?? vi.fn(),
  };

  const utils = render(
    <FilterBoard fields={fields} filtering={filtering} popup={popup} />,
  );

  return { filtering, popup, ...utils };
}

function ControlledBoard({
  initialFilters,
  onUpdateFilter = vi.fn(),
}: {
  initialFilters: FilterCondition[];
  onUpdateFilter: UseFilterUpdateHandler;
}) {
  const [filters, setFilters] = useState(initialFilters);

  return (
    <FilterBoard
      fields={fields}
      filtering={{
        filters,
        onUpdateFilter: (patch, index) => {
          onUpdateFilter(patch, index);
          setFilters((prev) =>
            prev.map((filter, i) =>
              i === index ? { ...filter, ...patch } : filter,
            ),
          );
        },
        onAddFilter: vi.fn(),
        onDeleteFilter: vi.fn(),
        onClearFilters: vi.fn(),
        logicalOperator: "AND",
        onLogicalOperatorChange: vi.fn(),
      }}
      popup={{ isOpen: true, onOpen: vi.fn(), onClose: vi.fn() }}
    />
  );
}

const textFilter = (value = ""): FilterCondition => ({
  name: "username",
  operation: "contains",
  value,
});

describe("FilterBoard", () => {
  it("renders a trigger that shows the active filter count as a badge", () => {
    renderBoard({
      filtering: { filters: [textFilter()] },
    });

    const trigger = screen.getByRole("button", { name: "Filters" });

    expect(within(trigger).getByText("1")).toBeInTheDocument();
  });

  it("shows an empty badge-less trigger when there are no filters", () => {
    renderBoard();

    const trigger = screen.getByRole("button", { name: "Filters" });

    expect(within(trigger).queryByText("1")).not.toBeInTheDocument();
  });

  it("adds the first field's default filter when opened empty", async () => {
    const user = userEvent.setup();
    const onAddFilter = vi.fn();
    const onOpen = vi.fn();

    renderBoard({
      filtering: { onAddFilter },
      popup: { isOpen: false, onOpen, onClose: vi.fn() },
    });

    await user.click(screen.getByRole("button", { name: "Filters" }));

    expect(onAddFilter).toHaveBeenCalledWith({
      name: "username",
      operation: "contains",
      value: "",
    });

    expect(onOpen).toHaveBeenCalled();
  });

  it("renders an existing filter row with field, operation and value", async () => {
    const filters = [{ name: "role", operation: "in", value: "TEACHER" }];

    renderBoard({ filtering: { filters } });

    expect(await screen.findByText("Role")).toBeInTheDocument();

    const operation = document.querySelector<HTMLSelectElement>(
      'select[name="operation"]',
    )!;

    expect(operation.value).toBe("in");

    const value = document.querySelector<HTMLInputElement>(
      'input[name="value"]',
    )!;

    expect(value.value).toBe("TEACHER");
  });

  it("appends another filter row from the Add Filter button", async () => {
    const user = userEvent.setup();
    const onAddFilter = vi.fn();

    renderBoard({
      filtering: { filters: [textFilter("al")], onAddFilter },
    });

    await user.click(screen.getByRole("button", { name: "Add Filter" }));

    expect(onAddFilter).toHaveBeenCalledTimes(1);
  });

  it("deletes a filter row through its remove button", async () => {
    const user = userEvent.setup();
    const onDeleteFilter = vi.fn();

    renderBoard({
      filtering: {
        filters: [textFilter(), textFilter("bob")],
        onDeleteFilter,
      },
    });

    const removeButtons = screen.getAllByRole("button", {
      name: "Remove filter",
    });

    await user.click(removeButtons[0]);

    expect(onDeleteFilter).toHaveBeenCalledWith(0);
  });

  it("closes the board when the last filter is deleted", async () => {
    const user = userEvent.setup();
    const onDeleteFilter = vi.fn();
    const onClose = vi.fn();

    renderBoard({
      filtering: { filters: [textFilter()], onDeleteFilter },
      popup: { isOpen: true, onOpen: vi.fn(), onClose },
    });

    await user.click(screen.getByRole("button", { name: "Remove filter" }));

    expect(onDeleteFilter).toHaveBeenCalledWith(0);
    expect(onClose).toHaveBeenCalled();
  });

  it("clears every filter and closes the board", async () => {
    const user = userEvent.setup();
    const onClearFilters = vi.fn();
    const onClose = vi.fn();

    renderBoard({
      filtering: { filters: [textFilter()], onClearFilters },
      popup: { isOpen: true, onOpen: vi.fn(), onClose },
    });

    await user.click(screen.getByRole("button", { name: "Clear all" }));

    expect(onClearFilters).toHaveBeenCalled();
    expect(onClose).toHaveBeenCalled();
  });

  it("updates the operation from the operation select", async () => {
    const user = userEvent.setup();
    const onUpdateFilter = vi.fn();

    renderBoard({
      filtering: { filters: [textFilter()], onUpdateFilter },
    });

    const operation = document.querySelector<HTMLSelectElement>(
      'select[name="operation"]',
    )!;

    await user.selectOptions(operation, "notContains");

    expect(onUpdateFilter).toHaveBeenCalledWith(
      { operation: "notContains" },
      0,
    );
  });

  it("updates the value from the value input", async () => {
    const user = userEvent.setup();
    const onUpdateFilter = vi.fn();

    render(
      <ControlledBoard
        initialFilters={[textFilter()]}
        onUpdateFilter={onUpdateFilter}
      />,
    );

    const value = document.querySelector<HTMLInputElement>(
      'input[name="value"]',
    )!;

    await user.type(value, "alice");

    expect(onUpdateFilter).toHaveBeenLastCalledWith({ value: "alice" }, 0);
  });

  it("hides the value editor for null operations", () => {
    renderBoard({
      filtering: {
        filters: [{ name: "role", operation: "isNull", value: "" }],
      },
    });

    expect(document.querySelector('input[name="value"]')).toBeNull();
    expect(screen.getByText("—")).toBeInTheDocument();
  });

  it("switching the filter field resets the operation to the type default", async () => {
    const user = userEvent.setup();
    const onUpdateFilter = vi.fn();

    renderBoard({
      filtering: { filters: [textFilter()], onUpdateFilter },
    });

    await user.click((await screen.findAllByRole("combobox"))[0]);

    await user.click(await screen.findByRole("option", { name: "Role" }));

    expect(onUpdateFilter).toHaveBeenCalledWith(
      { name: "role", operation: "in", value: "" },
      0,
    );
  });

  it("changes the logical operator between filter rows", async () => {
    const user = userEvent.setup();
    const onLogicalOperatorChange = vi.fn();
    const filters: FilterCondition[] = [textFilter("al"), textFilter("bo")];

    renderBoard({
      filtering: {
        filters,
        onLogicalOperatorChange,
      },
    });

    const logicalOperator = document.querySelector<HTMLSelectElement>(
      'select[aria-label="Logical operator"]',
    )!;

    expect(logicalOperator).not.toBeNull();

    await user.selectOptions(logicalOperator, "OR");

    expect(onLogicalOperatorChange).toHaveBeenCalledWith("OR");
  });

  it("hides the logical operator select for a single filter", () => {
    renderBoard({
      filtering: { filters: [textFilter()] },
    });

    expect(
      document.querySelector('select[aria-label="Logical operator"]'),
    ).toBeNull();
  });

  it("disables the Add Filter button when no fields are configured", () => {
    render(
      <FilterBoard
        fields={[]}
        filtering={{
          filters: [],
          onAddFilter: vi.fn(),
          onUpdateFilter: vi.fn(),
          onDeleteFilter: vi.fn(),
          onClearFilters: vi.fn(),
          logicalOperator: "AND",
          onLogicalOperatorChange: vi.fn(),
        }}
        popup={{ isOpen: true }}
      />,
    );

    expect(screen.getByRole("button", { name: "Add Filter" })).toBeDisabled();
  });
});
