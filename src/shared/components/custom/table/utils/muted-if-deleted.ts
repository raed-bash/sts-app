/** Row class for soft-deleted rows. */
export const mutedIfDeleted = (row: { deletedAt?: Date | string | null }) =>
  row.deletedAt ? "opacity-60" : undefined;
