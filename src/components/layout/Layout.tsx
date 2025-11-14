import { useMemo } from "react";
import { Outlet, useLocation } from "react-router";
import Navbar from "../navbar/Navbar";
import LinksPagesView from "../LinksPagesView";
import SectionsInfo from "src/constants/SectionsInfo";
import useCheckPrivileges from "src/hooks/useCheckPrivileges";

function Layout() {
  const { pathname } = useLocation();

  const currentSection = pathname.split("/")[1];

  const { handleCheckPrivileges } = useCheckPrivileges();

  const links = useMemo(() => {
    const section = SectionsInfo[currentSection];
    const SectionIcon = section?.icon;
    const pages = section?.pages || {};

    return [
      {
        label: SectionIcon && <SectionIcon className="fill-primary-main" />,
        disabled: true,
      },
      ...Object.values(pages)
        .filter((page) =>
          handleCheckPrivileges(page.sectionPrivileges, page.privileges)
        )
        .map(({ label, to }) => ({ label, to })),
    ];
  }, [currentSection, handleCheckPrivileges]);

  return (
    <div>
      <Navbar />
      <LinksPagesView links={links} />
      <div>
        <Outlet />
      </div>
    </div>
  );
}

export default Layout;
