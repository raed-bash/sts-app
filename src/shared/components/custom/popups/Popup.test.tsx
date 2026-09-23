import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Popup from "./Popup";

describe("Popup", () => {
  it("opens the dialog from the children render function", async () => {
    const user = userEvent.setup();

    render(
      <Popup title="Delete user" description="Confirm the action">
        {({ handleOpen }) => <button onClick={handleOpen}>Open popup</button>}
      </Popup>,
    );

    expect(screen.queryByRole("dialog")).toBeNull();

    await user.click(screen.getByRole("button", { name: "Open popup" }));

    const dialog = screen.getByRole("dialog");

    expect(
      within(dialog).getByText("Delete user", { selector: "h2" }),
    ).toBeInTheDocument();
    expect(within(dialog).getByText("Confirm the action")).toBeInTheDocument();
  });

  it("invokes onClose when the dialog is dismissed", async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();

    render(
      <Popup isOpen onClose={onClose}>
        <p>Body</p>
      </Popup>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onClose).toHaveBeenCalled();
  });

  it("renders plain children and the title inside the dialog", () => {
    render(
      <Popup isOpen title="Settings">
        <p>Body content</p>
      </Popup>,
    );

    const dialog = screen.getByRole("dialog");

    expect(within(dialog).getByText("Settings")).toBeInTheDocument();
    expect(within(dialog).getByText("Body content")).toBeInTheDocument();
  });

  it("marks the render function as inside the popup when open", async () => {
    const user = userEvent.setup();

    render(
      <Popup isOpen>
        {({ inPopup }) => <>{inPopup ? "inside" : "outside"}</>}
      </Popup>,
    );

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(screen.getByText("inside")).toBeInTheDocument();
  });
});
