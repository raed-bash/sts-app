export type DragRowRect = {
  top: number;
  height: number;
};

export const SLOT_MARGIN = 4;

export const getRowPitch = (rows: DragRowRect[]): number =>
  rows.length > 1 ? rows[1].top - rows[0].top : (rows[0]?.height ?? 0);

export const getDropSlotFromY = (
  y: number,
  rows: DragRowRect[],
  currentSlot: number,
  margin: number = SLOT_MARGIN,
): number => {
  let slot = 0;

  for (const row of rows) {
    if (y < row.top + row.height / 2) break;

    slot++;
  }

  slot = Math.min(slot, rows.length);

  if (slot === currentSlot) return slot;

  const anchor = rows[slot > currentSlot ? currentSlot : currentSlot - 1];

  if (!anchor) return slot;

  const edge = anchor.top + anchor.height / 2;

  const cleared = slot > currentSlot ? y >= edge + margin : y <= edge - margin;

  return cleared ? slot : currentSlot;
};

export const getPreviewIndex = (
  fromFilteredIndex: number,
  toSlot: number,
): number => (toSlot > fromFilteredIndex ? toSlot - 1 : toSlot);

export const getPreviewShift = (
  index: number,
  fromFilteredIndex: number,
  previewIndex: number,
): number => {
  if (index === fromFilteredIndex) return previewIndex - index;
  if (index > fromFilteredIndex && index <= previewIndex) return -1;
  if (index < fromFilteredIndex && index >= previewIndex) return 1;

  return 0;
};

export const getPreviewShifts = (
  fromFilteredIndex: number,
  toSlot: number,
  length: number,
): number[] => {
  const previewIndex = getPreviewIndex(fromFilteredIndex, toSlot);

  return Array.from({ length }, (_, index) =>
    getPreviewShift(index, fromFilteredIndex, previewIndex),
  );
};

export const getDropIndex = (
  visibleOriginalIndexes: number[],
  fromOriginalIndex: number,
  toSlot: number,
): number => {
  const last = visibleOriginalIndexes[visibleOriginalIndexes.length - 1];

  if (last === undefined) return -1;

  const anchor = visibleOriginalIndexes[toSlot];

  const insertBefore = anchor === undefined ? last + 1 : anchor;

  return insertBefore > fromOriginalIndex ? insertBefore - 1 : insertBefore;
};

export const moveItem = <T>(items: T[], from: number, to: number): T[] => {
  const next = [...items];

  const [moved] = next.splice(from, 1);

  next.splice(to, 0, moved);

  return next;
};
