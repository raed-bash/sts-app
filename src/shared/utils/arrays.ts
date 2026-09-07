export const isBeforeLastIndex = (i: number, arrayLength: number) =>
  arrayLength - 2 === i;

export const isLastIndex = (i: number, arrayLength: number) =>
  arrayLength - 1 === i;

export const wrapInArrayIf = <Y extends boolean, T extends Record<any, any>>(
  condition: Y,
  obj: T,
): Y extends true ? T[] : [] =>
  (condition ? [obj] : []) as Y extends true ? T[] : [];
