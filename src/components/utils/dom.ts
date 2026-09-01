export function clampToViewport(el: HTMLElement): {
  left: number;
  top: number;
} {
  const rect = el.getBoundingClientRect();
  const { innerWidth, innerHeight } = window;

  let left = el.offsetLeft;
  let top = el.offsetTop;

  if (rect.right > innerWidth) left = innerWidth - rect.width;
  if (rect.left < 0) left = 0;
  if (rect.bottom > innerHeight) top = innerHeight - rect.height;
  if (rect.top < 0) top = 0;

  return { left, top };
}

export const boundPosition = <T extends HTMLElement>(
  position: { x: number; y: number },
  element: T,
  windowSize: { width: number; height: number },
): { x: number; y: number } => {
  const boundedX = Math.max(
    0,
    Math.min(position.x, windowSize.width - element.clientWidth),
  );

  const boundedY = Math.max(
    0,
    Math.min(position.y, windowSize.height - element.clientHeight),
  );

  return { x: boundedX, y: boundedY };
};
