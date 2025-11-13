export function switchObjectKeys(fromObj, toKeysObj) {
  return Object.fromEntries(
    Object.entries(fromObj).map(([key, value]) => [toKeysObj[key], value])
  );
}
