import { memo, useMemo } from "react";
import { twMerge } from "tailwind-merge";
/**
 * @typedef utils
 * @property
 */
/**
 * @typedef containerProps
 * @type {React.HTMLAttributes<HTMLDivElement> & utils}
 */

/**
 * @param {containerProps} props
 */
function Container({ className, children, ...props }) {
  const classNameMemo = useMemo(
    () =>
      twMerge("bg-secondary-main  flex flex-col justify-between", className),
    [className]
  );

  return (
    <div className={classNameMemo} {...props}>
      {children}
    </div>
  );
}

export default memo(Container);
