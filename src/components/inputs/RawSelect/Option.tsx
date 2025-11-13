import { memo } from "react";

/**
 * @typedef utils
 * @property {boolean} disabled
 * @property {any} value
 */

/**
 * @typedef optionProps
 * @type {React.HTMLAttributes<HTMLDivElement> & utils}
 */

/**
 * @param {optionProps}
 */
function Option({ ...props }) {
  return { ...props };
}

export default memo(Option);
