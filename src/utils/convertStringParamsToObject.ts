/**
 *
 * @param {string} stringParams - Example ('key1::value1,,key2::value2')
 * @returns {object} - Example {key1:value1,key2:value2}
 */
export const convertStringParamsToObject = (stringParams, notSpecifyKey) => {
  return Object.fromEntries(
    stringParams
      .split(",,")
      .map((param) => {
        param = param.split("::");

        if (param.length === 1) {
          if (param[0]) {
            return [notSpecifyKey, param[0]];
          }

          return undefined;
        }

        const [key, value] = param;

        return [key.trim(), value];
      })
      .filter((param) => param)
  );
};
