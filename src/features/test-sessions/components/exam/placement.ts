/** A blanks answer: one answer id (or null) per blank, in blank order. */
export type Blanks = (number | null)[];

/**
 * Put `answerId` into `blank`. If the answer was already in another blank,
 * the two blanks swap; an answer pushed out of its blank goes back to the bank.
 */
export function placeInBlank(value: Blanks, answerId: number, blank: number) {
  const next = [...value];
  const from = next.indexOf(answerId);
  const occupant = next[blank] ?? null;

  next[blank] = answerId;
  if (from >= 0 && from !== blank) next[from] = occupant;

  return next;
}

/** Send an answer back to the bank. */
export function removeFromBlanks(value: Blanks, answerId: number) {
  return value.map((id) => (id === answerId ? null : id));
}

/** Move an item of an ordered list from one position to another. */
export function moveItem<T>(list: T[], from: number, to: number) {
  if (from === to || from < 0 || to < 0 || from >= list.length) return list;
  const next = [...list];
  const [moved] = next.splice(from, 1);
  next.splice(Math.min(to, next.length), 0, moved);
  return next;
}
