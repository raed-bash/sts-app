import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableCsvButton from "./TableCsvButton";

describe("TableCsvButton", () => {
  it("renders an export trigger labelled for CSV", () => {
    render(<TableCsvButton onCopy={vi.fn()} onDownload={vi.fn()} />);

    expect(
      screen.getByRole("button", { name: "Export table as CSV" }),
    ).toBeInTheDocument();
  });

  it("respects the disabled state", () => {
    render(<TableCsvButton onCopy={vi.fn()} onDownload={vi.fn()} disabled />);

    expect(
      screen.getByRole("button", { name: "Export table as CSV" }),
    ).toBeDisabled();
  });

  it("opens the export menu from the trigger", async () => {
    const user = userEvent.setup();

    render(<TableCsvButton onCopy={vi.fn()} onDownload={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Export table as CSV" }),
    );

    expect(
      await screen.findByRole("menuitem", { name: "Copy as CSV" }),
    ).toBeInTheDocument();
    await user.click(screen.getByRole("menuitem", { name: "Download CSV" }));

    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("copies the CSV from the menu", async () => {
    const user = userEvent.setup();
    const onCopy = vi.fn();

    render(<TableCsvButton onCopy={onCopy} onDownload={vi.fn()} />);

    await user.click(
      screen.getByRole("button", { name: "Export table as CSV" }),
    );
    await user.click(
      await screen.findByRole("menuitem", { name: "Copy as CSV" }),
    );

    expect(onCopy).toHaveBeenCalledTimes(1);
  });

  it("downloads the CSV from the menu", async () => {
    const user = userEvent.setup();
    const onDownload = vi.fn();

    render(<TableCsvButton onCopy={vi.fn()} onDownload={onDownload} />);

    await user.click(
      screen.getByRole("button", { name: "Export table as CSV" }),
    );
    await user.click(
      await screen.findByRole("menuitem", { name: "Download CSV" }),
    );

    expect(onDownload).toHaveBeenCalledTimes(1);
  });
});
