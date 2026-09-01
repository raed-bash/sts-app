export function getObjectValue(
  value: any,
  map: string | string[],
): string | undefined {
  if (value === undefined) return;

  if (!map.length) return value;

  if (Array.isArray(map)) {
    const [str, ...otherStr] = map;

    return getObjectValue(value?.[str], otherStr);
  }

  return getObjectValue(value, map.split("."));
}
