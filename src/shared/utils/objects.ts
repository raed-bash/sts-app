export const reverseObject = (obj: object) =>
  Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      typeof value === "string" ? value : value["__name__"],
      key,
    ]),
  ) as Record<string, string>;

export const switchObjectKeys = <
  T extends Record<string | number, string | number>,
>(
  fromObj: T,
  toKeysObj: T,
) =>
  Object.fromEntries(
    Object.entries(fromObj).map(([key, value]) => [toKeysObj[key], value]),
  );

export const getChangedFields = <T extends Record<string, number>>(
  original: T,
  updated: T,
) => {
  const changed = {} as T;

  for (const key in updated) {
    if (updated[key] !== original[key]) {
      changed[key] = updated[key];
    }
  }
  return changed;
};

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

export function removeEmptyNull(data: any, isArray: boolean = false): any {
  if (Array.isArray(data?.[0]))
    return Object.fromEntries(
      data.map(([key, value]: [string, any]) => [key, removeEmptyNull(value)]),
    );
  else if (Object.prototype.toString.call(data) === "[object Object]")
    return removeEmptyNull(Object.entries(data));
  else if (Array.isArray(data)) {
    const newData: any[] = [];

    if (data.length > 0) {
      data.forEach((val) => {
        const value = removeEmptyNull(val, true);
        if (value === "delete") {
          return;
        }

        newData.push(value);
      });
      if (newData.length === 0) return;

      return newData;
    }
    return;
  } else if (!(data === null || data === "")) return data;
  else if (isArray) return "delete";
}
