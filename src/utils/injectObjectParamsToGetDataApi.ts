import { convertStringParamsToObject } from "./convertStringParamsToObject";
import switchObjectKeys from "./switchObjectKeys";

type GetDataApiType<T extends Promise<any>> = (
  query: Record<string, any>,
  ...args: any[]
) => T;

/**
 *
 * @param {GetDataApiType} getDataApi - function to get data from API
 *
 * @param {string} adopterKey - key for unadopted value
 *
 * @param {Record<string, string>} [switchKeys] - object to switch keys
 *
 * @example
 *
 * ```ts
 * const newGetDataApi = injectObjectParamsToGetDataApi(getDataApi, "adopterKey", {oldKey1: "newKey1"});
 *
 * // when call newGetDataApi({search: "oldKey1::value1,, value2"})
 * // it will call getDataApi({newKey1: "value1", adopterKey: "value2"})
 * ```
 */
export function injectObjectParamsToGetDataApi<
  T extends GetDataApiType<Promise<any>>,
>(
  getDataApi: T,
  adopterKey: string,
  switchKeys?: Record<string, string>,
): GetDataApiType<Promise<ReturnType<T>>> {
  return async function ({ search, ...query }, ...args) {
    let params = convertStringParamsToObject(search, adopterKey);

    if (switchKeys) {
      params = switchObjectKeys(params, switchKeys);
    }

    return await getDataApi({ ...query, ...params }, ...args);
  };
}
