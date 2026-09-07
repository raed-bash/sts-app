import { ROLE_TITLES, type UserRole } from "@/constants/user-role";
import { cn } from "cn";

export type RoleBadgeProps = React.ComponentProps<"div"> & {
  role?: UserRole;
};

const ROLE_STYLES: Record<UserRole, string> = {
  SUPER_ADMIN: "bg-green-400",
  STUDENT: "bg-blue-400",
  TEACHER: "bg-yellow-400",
};

export default function RoleBadge({ role, ...props }: RoleBadgeProps) {
  return (
    <div
      {...props}
      className={cn(
        "px-2 py-1 inline-block rounded-lg text-white font-bold text-xs",
        role && ROLE_STYLES[role],
        props.className,
      )}
    >
      {role && ROLE_TITLES[role]}
    </div>
  );
}
