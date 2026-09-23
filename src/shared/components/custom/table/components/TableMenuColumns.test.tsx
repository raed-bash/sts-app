import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableMenuColumns from "./TableMenuColumns";

const baseColumns = [
  { name: "email", headerName: "email" },
  { name: "hireDate", headerName: "hireDate" },
];

describe("TableMenuColumns", () => {
  function renderMenu(
    overrides: Partial<React.ComponentProps<typeof TableMenuColumns>> = {},
  ) {
    const utils = render(
      <TableMenuColumns
        data={{
          columns: baseColumns,
          setColumns: vi.fn(),
        }}
        hiding={{
          hiddenColumns: new Set(["hireDate"]),
          createToggleColumnsClickHandler: () => vi.fn(),
          onReset: vi.fn(),
        }}
        {...overrides}
      />,
    );

    return utils;
  }

  it("lists the columns translated with their visibility", async () => {
    const user = userEvent.setup();

    renderMenu();

    await user.click(screen.getByRole("button", { name: "" }));

    const emailItem = await screen.findByRole("button", { name: "email" });
    const hireItem = screen.getByRole("button", { name: "hireDate" });

    expect(within(emailItem).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "true",
    );
    expect(within(hireItem).getByRole("checkbox")).toHaveAttribute(
      "aria-checked",
      "false",
    );
  });

  it("filters the column list by the search box", async () => {
    const user = userEvent.setup();

    renderMenu();

    await user.click(screen.getByRole("button", { name: "" }));

    await user.type(screen.getByPlaceholderText("Search..."), "mail");

    expect(screen.queryByRole("button", { name: "email" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "hireDate" })).toBeNull();
  });

  it("shows the empty state when nothing matches", async () => {
    const user = userEvent.setup();

    renderMenu();

    await user.click(screen.getByRole("button", { name: "" }));

    await user.type(screen.getByPlaceholderText("Search..."), "nope");

    expect(await screen.findByText("No columns")).toBeInTheDocument();
  });

  it("toggles a column through its click handler", async () => {
    const user = userEvent.setup();
    const onToggle = vi.fn();

    renderMenu({
      hiding: {
        hiddenColumns: new Set(),
        createToggleColumnsClickHandler: (column) => () => onToggle(column),
        onReset: vi.fn(),
      },
    });

    await user.click(screen.getByRole("button", { name: "" }));

    await user.click(await screen.findByRole("button", { name: "hireDate" }));

    expect(onToggle).toHaveBeenCalledWith(
      expect.objectContaining({ name: "hireDate" }),
    );
  });

  it("resets the hidden columns", async () => {
    const user = userEvent.setup();
    const onReset = vi.fn();

    renderMenu({
      hiding: {
        hiddenColumns: new Set(),
        createToggleColumnsClickHandler: () => vi.fn(),
        onReset,
      },
    });

    await user.click(screen.getByRole("button", { name: "" }));
    await user.click(await screen.findByRole("button", { name: "Reset" }));

    expect(onReset).toHaveBeenCalled();
  });
});
