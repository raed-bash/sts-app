import { describe, expect, it, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ConfirmPopup from "./ConfirmPopup";

function renderConfirm(
  props: Partial<React.ComponentProps<typeof ConfirmPopup>> = {},
) {
  const utils = render(
    <ConfirmPopup
      isOpen
      title="Delete user"
      message="This action cannot be undone."
      onConfirm={vi.fn()}
      onCancel={vi.fn()}
      {...props}
    />,
  );

  return utils;
}

describe("ConfirmPopup", () => {
  it("renders the title and message when open", () => {
    renderConfirm();

    const dialog = screen.getByRole("dialog");

    expect(within(dialog).getByText("Delete user")).toBeInTheDocument();
    expect(
      within(dialog).getByText("This action cannot be undone."),
    ).toBeInTheDocument();
  });

  it("hides the content when closed", () => {
    renderConfirm({ isOpen: false });

    expect(screen.queryByRole("dialog")).toBeNull();
  });

  it("confirms and cancels through the footer buttons", async () => {
    const user = userEvent.setup();
    const onConfirm = vi.fn();
    const onCancel = vi.fn();

    renderConfirm({ onConfirm, onCancel });

    await user.click(screen.getByRole("button", { name: "Confirm" }));
    await user.click(screen.getByRole("button", { name: "Cancel" }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(onCancel).toHaveBeenCalledTimes(1);
  });

  it("renders custom labels for the actions", () => {
    renderConfirm({
      confirmLabel: "Yes, delete",
      cancelLabel: "Keep it",
    });

    expect(
      screen.getByRole("button", { name: "Yes, delete" }),
    ).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Keep it" })).toBeInTheDocument();
  });

  it("uses the destructive style for the confirm button", () => {
    renderConfirm({ destructive: true });

    const confirm = screen.getByRole("button", { name: "Confirm" });

    expect(confirm.className).toContain("destructive");
  });

  it("disables the actions and shows a spinner while loading", () => {
    renderConfirm({ loading: true });

    expect(screen.getByRole("button", { name: /Confirm/ })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Cancel" })).toBeDisabled();
    expect(screen.getAllByRole("status")).toHaveLength(1);
  });

  it("cancels through the inline close button", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    renderConfirm({ onCancel });

    await user.click(screen.getByRole("button", { name: "Close" }));

    expect(onCancel).toHaveBeenCalled();
  });

  it("cancels when the dialog tries to dismiss", async () => {
    const user = userEvent.setup();
    const onCancel = vi.fn();

    renderConfirm({ onCancel });

    await user.keyboard("{Escape}");

    await user.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onCancel).toHaveBeenCalled();
  });
});
