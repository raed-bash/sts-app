import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { useDrag } from "./useDrag";

function Draggable({
  onMouseDown,
  onMouseMove,
  onMouseUp,
}: {
  onMouseDown?: (
    e: React.MouseEvent<HTMLDivElement>,
    el: HTMLDivElement,
  ) => void;
  onMouseMove?: (e: MouseEvent, el: HTMLDivElement) => void;
  onMouseUp?: (e: MouseEvent, el: HTMLDivElement) => void;
}) {
  const { onMouseDown: handleMouseDown, ref } = useDrag({
    onMouseDown,
    onMouseMove,
    onMouseUp,
  });

  return <div ref={ref} onMouseDown={handleMouseDown} data-testid="drag" />;
}

describe("useDrag", () => {
  it("moves the element to the mouse position on drag", () => {
    render(<Draggable />);

    const element = screen.getByTestId("drag");

    fireEvent.mouseDown(element, { clientX: 30, clientY: 20 });

    expect(element.style.position).toBe("fixed");
    expect(element.style.top).toBe("0px");

    fireEvent.mouseMove(document.body, { clientX: 60, clientY: 40 });

    expect(element.style.top).toBe("20px");
  });

  it("reports mouse events through the options", () => {
    const onMouseDown = vi.fn();
    const onMouseMove = vi.fn();
    const onMouseUp = vi.fn();

    render(
      <Draggable
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
      />,
    );

    const element = screen.getByTestId("drag");

    fireEvent.mouseDown(element);
    fireEvent.mouseMove(document.body);
    fireEvent.mouseUp(document.body);

    expect(onMouseDown).toHaveBeenCalledTimes(1);
    expect(onMouseMove).toHaveBeenCalledTimes(1);
    expect(onMouseUp).toHaveBeenCalledTimes(1);
  });
});
