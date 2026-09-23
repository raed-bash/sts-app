import { useState } from "react";
import { describe, expect, it } from "vitest";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import FilterBoard, { type FilterBoardProps } from "./FilterBoard";
import type { FilterCondition } from "./useFilter";

const fields: FilterBoardProps["fields"] = [
  {
    name: "username",
    label: "common:fields.username",
    filterProps: { type: "text" },
  },
  {
    name: "role",
    label: "common:fields.role",
    filterProps: { type: "nativeSelect" },
  },
];

function Harness({
  initialFilters = [],
}: {
  initialFilters?: FilterCondition[];
}) {
  const [filters, setFilters] = useState(initialFilters);
  const [logicalOperator, setLogicalOperator] = useState<"AND" | "OR">("AND");

  return (
    <FilterBoard
      fields={fields}
      filtering={{
        filters,
        onAddFilter: (filter) => setFilters((prev) => [...prev, filter]),
        onUpdateFilter: (filter, index) =>
          setFilters((prev) =>
            prev.map((item, i) =>
              i === index ? { ...item, ...filter } : item,
            ),
          ),
        onDeleteFilter: (index) =>
          setFilters((prev) => prev.filter((_, i) => i !== index)),
        onClearFilters: () => setFilters([]),
        logicalOperator,
        onLogicalOperatorChange: setLogicalOperator,
      }}
    />
  );
}

describe("FilterBoard", () => {
  it("opens the panel and adds filter rows", async () => {
    const user = userEvent.setup();

    render(<Harness />);

    const trigger = screen.getByRole("button", { name: "Filters" });

    await user.click(trigger);

    await waitFor(() =>
      expect(
        document.querySelector("[data-slot=popover-content]"),
      ).toBeInTheDocument(),
    );

    expect(within(trigger).getByText("1")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Remove filter" }),
    ).toHaveLength(1);

    await user.click(screen.getByRole("button", { name: "Add Filter" }));

    expect(within(trigger).getByText("2")).toBeInTheDocument();
    expect(
      screen.getAllByRole("button", { name: "Remove filter" }),
    ).toHaveLength(2);
  });

  it("shows the number of active filters on the trigger", () => {
    render(
      <Harness
        initialFilters={[{ name: "role", operation: "in", value: "ADMIN" }]}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Filters" });

    expect(within(trigger).getByText("1")).toBeInTheDocument();
  });

  it("clears all filters from the panel header", async () => {
    const user = userEvent.setup();

    render(
      <Harness
        initialFilters={[{ name: "role", operation: "in", value: "ADMIN" }]}
      />,
    );

    await user.click(screen.getByRole("button", { name: "Filters" }));

    const clearButton = screen.getByRole("button", { name: /clear all/i });

    await user.click(clearButton);

    expect(screen.queryByText(/^1$/)).not.toBeInTheDocument();
  });
});

describe("FilterBoard with no fields", () => {
  it("disables the add-filter button", async () => {
    const user = userEvent.setup();

    const empty: FilterBoardProps["fields"] = [];

    function EmptyHarness() {
      const [filters, setFilters] = useState<FilterCondition[]>([]);

      return (
        <FilterBoard
          fields={empty}
          filtering={{
            filters,
            onAddFilter: (filter) => setFilters((prev) => [...prev, filter]),
            onUpdateFilter: () => {},
            onDeleteFilter: () => {},
            onClearFilters: () => setFilters([]),
            logicalOperator: "AND",
            onLogicalOperatorChange: () => {},
          }}
        />
      );
    }

    render(<EmptyHarness />);

    await user.click(screen.getByRole("button", { name: "Filters" }));

    const addButton = screen.getByRole("button", { name: "Add Filter" });

    expect(addButton).toBeDisabled();
  });
});
