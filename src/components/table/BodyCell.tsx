import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";
export const allowedTitles = ["string", "boolean", "number"];
/**
 * @typedef utils
 * @property
 */

/**
 * @typedef bodyCellProps
 * @type {React.TdHTMLAttributes<HTMLTableCellElement> & utils}
 */

/**
 * @param {bodyCellProps} props
 */
function BodyCell({ className = "", children, ...props }) {
  const classNameMemo = useMemo(
    () => twMerge(`text-base max-lg:text-xs max-lg:py-2 py-5 px-2`, className),
    [className]
  );
  return (
    <td
      className={classNameMemo}
      align="center"
      title={allowedTitles.includes(typeof children) ? children : ""}
      {...props}
    >
      {children}
    </td>
  );
}

export default memo(BodyCell);
