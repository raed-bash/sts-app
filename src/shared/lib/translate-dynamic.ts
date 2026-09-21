type DynamicTFunction = (
  key: string,
  options: { defaultValue: string },
) => string;

export const translateDynamic = (t: DynamicTFunction, key: string): string =>
  t(key, { defaultValue: key });
