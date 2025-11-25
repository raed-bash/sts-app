export const convertSortsObjectToSortParams = (sorts: object) =>
  Object.entries(sorts)
    .filter(([, value]) => ["DESC", "ASC"].includes(value))
    .map(([key, value]) => `${value === "DESC" ? "-" : ""}${key}`)
    .toString();
