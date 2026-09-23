import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import TableDensityButton from "./TableDensityButton";

describe("TableDensityButton", () => {
  it("opens the density menu from the trigger", async () => {
    const user = userEvent.setup();

    render(
      <TableDensityButton density="comfortable" onDensityChange={vi.fn()} />,
    );

    await user.click(screen.getByRole("button", { name: "Table density" }));

    expect(
      await screen.findByRole("menuitemradio", { name: "Compact" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "Comfortable" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("menuitemradio", { name: "Roomy" }),
    ).toBeInTheDocument();
  });

  it("reports a density change", async () => {
    const user = userEvent.setup();
    const onDensityChange = vi.fn();

    render(
      <TableDensityButton
        density="compact"
        onDensityChange={onDensityChange}
      />,
    );

    const trigger = screen.getByRole("button", { name: "Table density" });

    await user.click(trigger);
    await user.click(
      await screen.findByRole("menuitemradio", { name: "Roomy" }),
    );

    expect(onDensityChange).toHaveBeenCalledWith("roomy");
  });

  it("marks the current density as checked", async () => {
    const user = userEvent.setup();

    render(<TableDensityButton density="roomy" onDensityChange={vi.fn()} />);

    await user.click(screen.getByRole("button", { name: "Table density" }));

    expect(
      await screen.findByRole("menuitemradio", { name: "Roomy" }),
    ).toHaveAttribute("data-checked");
  });
});
