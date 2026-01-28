const switchObjectKeys = <T extends Record<string | number, string | number>>(
  fromObj: T,
  toKeysObj: T,
) =>
  Object.fromEntries(
    Object.entries(fromObj).map(([key, value]) => [toKeysObj[key], value]),
  );

export default switchObjectKeys;
