/**
 *
 * @param {string} stringParams - Not sensitive to spaces
 *
 * @param {string} adopterKey - key for unadopted value
 *
 * @example
 *
 * ```ts
 * const obj = convertStringParamsToObject("key1::value1,, key2::  value2,, value3", "key3");
 * // {key1: "value1", key2: "value2", key3: "value3"}
 * ```
 */
export const convertStringParamsToObject = (
  stringParams: string,
  adopterKey: string,
): Record<string | number, string | number> => {
  return Object.fromEntries(
    stringParams
      .split(",,")
      .map((param) => {
        const splittedParam = param.split("::");

        const hasKey = splittedParam.length === 2;

        if (!hasKey) {
          const value = splittedParam[0];

          if (value) {
            return [adopterKey, value.trim()];
          }

          return;
        }

        const [key, value] = splittedParam;

        return [key.trim(), value.trim()];
      })
      .filter((param) => param !== undefined),
  );
};
