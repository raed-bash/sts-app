/**
 * @example
 * ```ts
 * const capitalizedText = toCapitalize("raed");
 * // Raed
 * ```
 */
const toCapitalize = (text: string): string =>
  text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();

export default toCapitalize;
