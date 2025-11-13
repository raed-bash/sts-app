import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";
import { allowedTitles } from "./BodyCell";

/**
 * @typedef utils
 * @property
 */

/**
 * @typedef headerCellProps
 * @type {React.ThHTMLAttributes<HTMLTableCellElement> & utils}
 */

/**
 * @param {headerCellProps} props
 */
function HeaderCell({ className = "", children, ...props }) {
  const classNameMemo = useMemo(
    () =>
      twMerge(
        "text-primary-main text-base max-lg:text-xs max-lg:py-2 py-5 px-2",
        className
      ),
    [className]
  );

  return (
    <th
      className={classNameMemo}
      align="center"
      title={allowedTitles.includes(typeof children) ? children : ""}
      {...props}
    >
      {children}
    </th>
  );
}

export default memo(HeaderCell);
