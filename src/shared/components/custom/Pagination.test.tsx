import { afterEach, describe, expect, it, vi } from "vitest";
import { act, fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Pagination from "./Pagination";

function renderPagination(
  props: Partial<React.ComponentProps<typeof Pagination>> = {},
) {
  const utils = render(
    <Pagination currentPage={1} count={30} onChange={vi.fn()} {...props} />,
  );

  return utils;
}

afterEach(() => {
  vi.useRealTimers();
});

describe("Pagination", () => {
  it("renders nothing when there is no data", () => {
    const { container } = renderPagination({ count: 0 });

    expect(screen.queryByRole("navigation")).toBeNull();
    expect(container).toBeEmptyDOMElement();
  });

  it("renders the available page buttons with the current one marked", () => {
    renderPagination();

    expect(screen.getByRole("button", { name: "Page 1" })).toHaveAttribute(
      "aria-selected",
      "true",
    );
    expect(screen.getByRole("button", { name: "Page 2" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 3" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Page 4" })).toBeNull();
  });

  it("collapses distant pages into ellipses", () => {
    renderPagination({
      currentPage: 10,
      count: 200,
      perPage: 10,
    });

    expect(screen.getByRole("button", { name: "Page 1" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 8" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 12" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Page 20" })).toBeInTheDocument();

    expect(screen.queryByRole("button", { name: "Page 7" })).toBeNull();
    expect(screen.queryByRole("button", { name: "Page 13" })).toBeNull();

    expect(screen.getAllByText("…")).toHaveLength(2);
  });

  it("disables the previous button on the first page", () => {
    renderPagination({ currentPage: 1 });

    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeEnabled();
  });

  it("disables the next button on the last page", () => {
    renderPagination({ currentPage: 3, count: 30 });

    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
  });

  it("requests the previous page from the arrow buttons", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderPagination({ currentPage: 2, onChange });

    await user.click(screen.getByRole("button", { name: "Previous page" }));
    await user.click(screen.getByRole("button", { name: "Next page" }));

    expect(onChange).toHaveBeenNthCalledWith(1, 1);
    expect(onChange).toHaveBeenNthCalledWith(2, 3);
  });

  it("requests a page from its button", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();

    renderPagination({ onChange });

    await user.click(screen.getByRole("button", { name: "Page 2" }));

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("jumps to a typed page after the debounce", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();

    renderPagination({ onChange });

    const jump = screen.getByRole("spinbutton");

    fireEvent.change(jump, { target: { value: "2" } });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onChange).toHaveBeenCalledWith(2);
  });

  it("ignores out-of-range jump values", () => {
    vi.useFakeTimers();
    const onChange = vi.fn();

    renderPagination({ onChange });

    const jump = screen.getByRole("spinbutton");

    fireEvent.change(jump, { target: { value: "99" } });

    act(() => {
      vi.advanceTimersByTime(500);
    });

    expect(onChange).not.toHaveBeenCalled();
  });

  it("keeps the jump input in sync with external page changes", () => {
    const onChange = vi.fn();

    const { rerender } = renderPagination({ onChange });

    rerender(<Pagination currentPage={2} count={30} onChange={onChange} />);

    const jump = screen.getByRole("spinbutton") as HTMLInputElement;

    expect(jump.value).toBe("2");
  });

  it("disables every control when disabled", () => {
    renderPagination({ currentPage: 2, disabled: true });

    expect(
      screen.getByRole("button", { name: "Previous page" }),
    ).toBeDisabled();
    expect(screen.getByRole("button", { name: "Page 2" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "Next page" })).toBeDisabled();
    expect(screen.getByRole("spinbutton")).toBeDisabled();
  });
});
