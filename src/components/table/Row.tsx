import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";

/**
 * @typedef utils
 * @property
 */

/**
 * @typedef rowProps
 * @type {React.HTMLAttributes<HTMLTableRowElement> & utils}
 */

/**
 * @param {rowProps} props
 */
function Row({ children, className = "", ...props }) {
  const classNameMemo = useMemo(
    (i) => twMerge(`py-2 hover:bg-gray-main`, className),
    [className]
  );

  return (
    <tr className={classNameMemo} {...props}>
      {children}
    </tr>
  );
}

export default memo(Row);
