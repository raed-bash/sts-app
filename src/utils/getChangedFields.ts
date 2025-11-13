export const getChangedFields = (original, updated) => {
  const changed = {};
  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changed[key] = updated[key];
    }
  }
  return changed;
};
