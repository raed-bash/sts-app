export const convertSortsObjectToSortParams = (sorts) =>
  Object.entries(sorts)
    .filter(([_, value]) => ["DESC", "ASC"].includes(value))
    .map(([key, value]) => `${value === "DESC" ? "-" : ""}${key}`)
    .toString();
