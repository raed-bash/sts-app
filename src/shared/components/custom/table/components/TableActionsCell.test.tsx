import { describe, expect, it, vi } from "vitest";
import { render } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Pencil, Trash2 } from "lucide-react";
import TableActionsCell from "./TableActionsCell";

type Row = { id: number; name: string };

describe("TableActionsCell", () => {
  it("renders one button per visible action and calls it with the row", async () => {
    const user = userEvent.setup();
    const row: Row = { id: 1, name: "Alice" };
    const onEdit = vi.fn();
    const onDelete = vi.fn();

    const { container } = render(
      <TableActionsCell
        row={row}
        actions={[
          {
            name: "edit",
            label: "Edit",
            icon: <Pencil />,
            onClick: onEdit,
          },
          {
            name: "delete",
            label: "Delete",
            icon: <Trash2 />,
            variant: "destructive",
            onClick: onDelete,
          },
        ]}
      />,
    );

    const buttons = container.querySelectorAll("button");

    expect(buttons).toHaveLength(2);

    await user.click(buttons[1]);

    expect(onEdit).not.toHaveBeenCalled();
    expect(onDelete).toHaveBeenCalledWith(row);
  });

  it("filters out actions hidden for the given row", () => {
    const { container } = render(
      <TableActionsCell
        row={{ id: 1 }}
        actions={[
          {
            name: "edit",
            label: "Edit",
            icon: <Pencil />,
            onClick: vi.fn(),
          },
          {
            name: "locked",
            label: "Locked",
            icon: <Trash2 />,
            hidden: (r) => r.id === 1,
            onClick: vi.fn(),
          },
        ]}
      />,
    );

    expect(container.querySelectorAll("button")).toHaveLength(1);
  });

  it("uses the outline variant by default", () => {
    const { container } = render(
      <TableActionsCell
        row={{ id: 1 }}
        actions={[
          { name: "edit", label: "Edit", icon: <Pencil />, onClick: vi.fn() },
        ]}
      />,
    );

    expect(container.querySelector("button")!.className).toContain("outline");
  });
});
