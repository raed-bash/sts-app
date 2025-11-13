/**
 * @param {[any,any][]} labels
 * @returns {string}
 */
export default function writeLabelsText(labels) {
  return labels
    .filter(([, value]) => value)
    .map(([label, value]) => `${label ? `${label}: ` : ""}${value}`)
    .join(", ");
}
