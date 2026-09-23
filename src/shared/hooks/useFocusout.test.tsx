import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useRef } from "react";
import { useFocusout } from "./useFocusout";

function Menu({ onClose }: { onClose: () => void }) {
  const ref = useRef<HTMLDivElement | null>(null);

  useFocusout(ref, onClose);

  return (
    <div ref={ref} data-testid="menu">
      <button>item</button>
    </div>
  );
}

describe("useFocusout", () => {
  it("ignores clicks inside the element", () => {
    const onClose = vi.fn();

    render(<Menu onClose={onClose} />);

    fireEvent.mouseDown(screen.getByRole("button"));

    expect(onClose).not.toHaveBeenCalled();
  });

  it("fires when clicking outside the element", () => {
    const onClose = vi.fn();

    render(<Menu onClose={onClose} />);

    fireEvent.mouseDown(document.body);

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
