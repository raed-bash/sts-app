export const wrapInArrayIf = <Y extends boolean, T extends Record<any, any>>(
  condition: Y,
  obj: T
): Y extends true ? T[] : [] =>
  (condition ? [obj] : []) as Y extends true ? T[] : [];
