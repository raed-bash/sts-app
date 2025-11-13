import { convertStringParamsToObject } from "./convertStringParamsToObject";
import { switchObjectKeys } from "./switchObjectKeys";

export function injectObjectParamsToGetDataApi(
  getDataApi,
  notSpecifyKey,
  switchKeys
) {
  return async function ({ search, ...query }, ...args) {
    let params = convertStringParamsToObject(search, notSpecifyKey);

    if (switchKeys) {
      params = switchObjectKeys(params, switchKeys);
    }

    return await getDataApi({ ...query, ...params }, ...args);
  };
}
