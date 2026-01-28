export const getChangedFields = <T extends Record<string, number>>(
  original: T,
  updated: T,
) => {
  const changed = {} as T;

  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changed[key] = updated[key];
    }
  }
  return changed;
};
