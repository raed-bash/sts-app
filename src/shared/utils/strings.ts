export function ms(...strings: (string | number)[]) {
  return strings.reduce(
    (prev, curr) => prev + (curr || curr === 0 ? curr : "").toString(),
    "",
  );
}

/**
 * @example
 * ```ts
 * const capitalizedText = toCapitalize("raed");
 * // Raed
 * ```
 */
export const toCapitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export type LabelKeyType = string | number;

export type LabelValueType = LabelKeyType;

export type LabelType = [LabelKeyType, LabelValueType];

/**
 * @example
 * ```ts
 * const labels = formatLabelList([['key1','value1'],['key2','value2']]);
 * // 'key1: value1, key2: value2'
 * ```
 */
export const formatLabelList = (keyValueArray: LabelType[]): string =>
  keyValueArray
    .filter(([, value]) => value)
    .map(
      ([label, value]) => `${label !== undefined ? `${label}: ` : ""}${value}`,
    )
    .join(", ");
