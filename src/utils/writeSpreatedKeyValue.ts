export type LabelKeyType = string | number;

export type LabelValueType = LabelKeyType;

export type LabelType = [LabelKeyType, LabelValueType];

/**
 * @example
 * ```ts
 * const spreatedKeyValue = writeSpreatedKeyValue([['key1','value1'],['key2','value2']]);
 * // 'key1: value1, key2: value2'
 * ```
 */
const writeSpreatedKeyValue = (keyValueArray: LabelType[]): string =>
  keyValueArray
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `${label !== undefined ? `${label}: ` : ""}${value}`,
    )
    .join(", ");

export default writeSpreatedKeyValue;
