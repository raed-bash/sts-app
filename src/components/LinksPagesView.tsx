import { memo } from "react";
import { Link, useLocation } from "react-router";
/**
 * @typedef utils
 * @property {(import("react-router").LinkProps & React.RefAttributes<HTMLAnchorElement> & {disabled:boolean, label:any})[]} links
 */

/**
 * @typedef linksPageViewProps
 * @type {React.HTMLAttributes<HTMLDivElement> & utils}
 */

/**
 * @param {linksPageViewProps} props
 */
function LinksPageView({ links, className = "", ...props }) {
  const length = links.length;
  const { pathname } = useLocation();

  return (
    <div
      className={`h-28 max-lg:h-24 max-md:h-20 flex overflow-auto bg-secondary-main ${className}`}
      {...props}
    >
      {links.map(({ label, className = "", style, disabled, ...link }, i) => {
        const activeTab = pathname.split("/")[2] === link.to?.split("/")[2];

        return (
          <Link
            key={label}
            className={`h-full flex justify-end rtl:pr-20 ltr:pl-20 rtl:max-sm:pr-14 ltr:max-sm:pl-14 rtl:-mr-[50px] ltr:-ml-[50px] rtl:pl-12 ltr:pr-12 max-sm:pl-7 ltr:max-sm:pr-12 items-center duration-150 
                ${disabled ? "pointer-events-none" : ""} 
                ${activeTab ? "text-white" : "text-black "} ${
              activeTab
                ? "bg-primary-main hover:bg-primary-dark"
                : "bg-secondary-main hover:bg-primary-light"
            } rtl:rounded-l-full ltr:rounded-r-full text-2xl max-sm:text-xl ${className} rtl:shadow-navbarlink-rtl ltr:shadow-navbarlink-ltr`}
            style={{
              zIndex: (length - i) * 1,
              ...style,
            }}
            {...link}
          >
            {label}
          </Link>
        );
      })}
    </div>
  );
}

export default memo(LinksPageView);
