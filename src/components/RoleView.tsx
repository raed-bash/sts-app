import type { HTMLAttributes } from "react";
import type { UserRole } from "src/pages/users/dtos/user.dto";
import { cn } from "src/utils/cn";

export type RoleViewProps = HTMLAttributes<HTMLDivElement> & {
  role?: UserRole;
};

// const ROLE_STYLES: Record<UserRole, string> = {
//   SUPER_ADMIN: "bg-green-400",
//   STUDENT: "bg-blue-400",
//   TEACHER: "bg-yellow-400",
// };

const ROLE_TITLES: Record<UserRole, string> = {
  SUPER_ADMIN: "Super Admin",
  STUDENT: "Student",
  TEACHER: "Teacher",
};

export default function RoleView({ role, ...props }: RoleViewProps) {
  return (
    <div
      {...props}
      className={cn(
        // "px-2 py-1 rounded-lg text-white font-bold",
        // role && ROLE_STYLES[role],
        "block font-light text-xs   capitalize text-gray-700",
        props.className,
      )}
    >
      {role && ROLE_TITLES[role]}
    </div>
  );
}
