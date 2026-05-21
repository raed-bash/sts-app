export const reverseTranslatedObj = (obj: object) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      typeof value === "string" ? value : value["__name__"],
      key,
    ]),
  ) as Record<string, string>;
