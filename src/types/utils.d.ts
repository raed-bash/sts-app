export type OnlyStringLiterals<T> = T extends string
  ? string extends T
    ? never
    : T
  : never;
