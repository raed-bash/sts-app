import ProfileFilledIcon from "src/assets/icons/profile-filled.svg?react";
import ProfileIcon from "src/assets/icons/profile.svg?react";
import SettingsIcon from "src/assets/icons/settings.svg?react";
import LogoutIcon from "src/assets/icons/logout.svg?react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "src/pages/users/users.api";
import Loading from "../skeleton/Loading";
import RoleView from "../RoleView";
import Button from "../buttons/Button";
import useLogout from "src/hooks/useLogout";
import Animation from "../Animation";
import { cn } from "src/utils/cn";
import AppLink from "../AppLink";

export default function ProfileMenu({ open }: { open: boolean }) {
  const handleLogout = useLogout();

  const meQuery = useQuery({ queryKey: ["me"], queryFn: () => usersApi.me() });

  const me = meQuery.data;

  return (
    <Animation
      isOpen={open}
      className="absolute flex gap-8 flex-col justify-center items-center top-[160%] right-0  min-w-[218px] min-h-32 bg-(--surface)  shadow-base rounded-lg"
      tabIndex={0}
    >
      {meQuery.isLoading ? (
        <Loading />
      ) : (
        <div className="w-full flex flex-col gap-5">
          <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-300">
            <div className="w-[45px] h-[45px]">
              <ProfileIcon className="fill-(--text) w-full h-full" />
            </div>
            <div className="flex justify-center items-start flex-col">
              <p className="text-sm">{me?.username}</p>
              <RoleView role={me?.role} className="text-xs " />
            </div>
          </div>
          <div className="px-4 flex flex-col gap-5">
            {profileOptions.map((opt) => (
              <AppLink
                to={opt.to}
                className="flex items-center gap-3 group duration-75 cursor-pointer  no-underline"
              >
                <span
                  className={cn(
                    "h-9 w-9 inline-flex items-center justify-center group-hover:scale-110 transition-all duration-200  rounded-full text-2xl  text-white  ",
                    opt.bgColorClassName,
                  )}
                >
                  <opt.Icon className="fill-white " />
                </span>
                <span className="block text-sm group-hover:text-(--primary-hover) capitalize text-(--text-muted) ">
                  {opt.label}
                </span>
              </AppLink>
            ))}
          </div>
          <div className="px-4 py-3 border-t border-gray-300">
            <Button
              variant="contained"
              color="primary"
              className="flex gap-2 items-center justify-center w-full h-10 text-sm"
              onClick={handleLogout}
            >
              <LogoutIcon className="fill-white  w-5 h-5" />
              Logout
            </Button>
          </div>
        </div>
      )}
    </Animation>
  );
}

type ProfileOption = {
  Icon: (props: React.SVGProps<SVGSVGElement>) => React.ReactNode;
  bgColorClassName: string;
  label: string;
  to: string;
};

const profileOptions: ProfileOption[] = [
  {
    Icon: (props: React.SVGProps<SVGSVGElement>) => (
      <ProfileFilledIcon {...props} />
    ),
    bgColorClassName: "bg-green-500",
    label: "Profile",
    to: "profile",
  },
  {
    Icon: (props: React.SVGProps<SVGSVGElement>) => <SettingsIcon {...props} />,
    bgColorClassName: "bg-yellow-500",
    label: "Settings",
    to: "settings",
  },
];
