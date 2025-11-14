import { useCallback, useMemo } from "react";
import Button from "../buttons/Button";
import ButtonGroup from "../buttons/ButtonGroup";
import { ReactComponent as LogoIcon } from "src/assets/icons/logo.svg";
import { ReactComponent as LogoutIcon } from "src/assets/icons/logout.svg";
import sectionsInfo from "src/constants/SectionsInfo";
import { useLocation, useNavigate } from "react-router";
import useLogout from "src/hooks/useLogout";
import useCheckPrivileges from "src/hooks/useCheckPrivileges";

const sectionsInfo_entries = Object.entries(sectionsInfo);

export default function Navbar() {
  const navigate = useNavigate();
  const { handleCheckPrivileges } = useCheckPrivileges();

  const handleSectionChange = useCallback(
    ({ target: { value } }) => {
      navigate(value);
    },
    [navigate]
  );

  const sectionsOptions = useMemo(
    /**
     *
     * @returns {import("../buttons/ButtonGroup").option[]}
     */
    () =>
      sectionsInfo_entries
        .filter(([, section]) =>
          handleCheckPrivileges(section.sectionPrivileges, section.privileges)
        )
        .map(([key, section]) => {
          return {
            Icon: section.icon,
            value: key,
            label: section.label,
          };
        }),
    [handleCheckPrivileges]
  );

  const handleLogout = useLogout();
  const { pathname } = useLocation();

  const currentSection = pathname.split("/")[1];

  return (
    <div className="bg-white">
      <div className="flex justify-between max-md:flex-col px-16 max-lg:p-3 items-center gap-2">
        <div>
          <LogoIcon className="w-72 max-lg:max-w-60 max-lg:max-h-14" />
        </div>
        <div className="flex gap-x-2 justify-between max-sm:flex-col max-sm:items-center w-min max-md:w-full max-sm:gap-2 ">
          <ButtonGroup
            options={sectionsOptions}
            activeValue={currentSection}
            onChange={handleSectionChange}
          />
          <Button
            color="danger"
            variant="contained"
            className="w-max max-sm:w-full flex gap-x-2 px-7 justify-center items-center"
            style={{ borderRadius: "2rem" }}
            onClick={handleLogout}
          >
            <LogoutIcon />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    </div>
  );
}
