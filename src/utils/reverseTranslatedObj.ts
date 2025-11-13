export const reverseTranslatedObj = (obj) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      typeof value === "string" ? value : value["his_name"],
      key,
    ])
  );
