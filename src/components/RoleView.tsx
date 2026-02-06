import type { HTMLAttributes } from "react";
import { ROLE_TITLES, type UserRole } from "src/constants/user-role";
import { cn } from "src/utils/cn";

export type RoleViewProps = HTMLAttributes<HTMLDivElement> & {
  role?: UserRole;
};

const ROLE_STYLES: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-green-400",
  STUDENT: "bg-blue-400",
  TEACHER: "bg-yellow-400",
};

export default function RoleView({ role, ...props }: RoleViewProps) {
  return (
    <div
      {...props}
      className={cn(
        "px-2 py-1 inline-block rounded-lg text-white font-bold",
        role && ROLE_STYLES[role],
        props.className,
      )}
    >
      {role && ROLE_TITLES[role]}
    </div>
  );
}
