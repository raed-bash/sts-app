import { useCallback, useMemo } from "react";
import { useSelector } from "react-redux";
import { employeeInfoSelector, userInfoSelector } from "src/app/slice";

export default function useCheckPrivileges(sectionPrivileges, privileges) {
  const employeeInfo = useSelector(employeeInfoSelector);

  const { is_staff } = useSelector(userInfoSelector);

  const handleCheckPrivileges = useCallback(
    (sectionPrivileges, privileges) => {
      return true; // __test__
      if (is_staff) {
        return is_staff;
      }

      const allowedPrivilegesSection = (function () {
        if (!Array.isArray(sectionPrivileges)) {
          return employeeInfo[sectionPrivileges];
        }

        const allAllowedPrivilegeSections = [];

        for (const section of sectionPrivileges) {
          allAllowedPrivilegeSections.push(...employeeInfo[section]);
        }

        return allAllowedPrivilegeSections;
      })();

      if (!allowedPrivilegesSection || !allowedPrivilegesSection.length) {
        return false;
      }

      return allowedPrivilegesSection.some((allowedPrivilege) =>
        typeof privileges === "string"
          ? privileges === allowedPrivilege
          : privileges.includes(allowedPrivilege)
      );
    },
    [employeeInfo, is_staff]
  );

  const hasPrivileges = useMemo(() => {
    if (!sectionPrivileges || !privileges) {
      return null;
    }

    return handleCheckPrivileges(sectionPrivileges, privileges);
  }, [sectionPrivileges, privileges, handleCheckPrivileges]);

  return { handleCheckPrivileges, hasPrivileges };
}
