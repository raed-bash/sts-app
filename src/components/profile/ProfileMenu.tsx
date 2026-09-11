import ProfileFilledIcon from "@/assets/icons/profile-filled.svg?react";
import ProfileIcon from "@/assets/icons/profile.svg?react";
import SettingsIcon from "@/assets/icons/settings.svg?react";
import LogoutIcon from "@/assets/icons/logout.svg?react";
import { useLogout } from "@/hooks";
import { cn } from "cn";
import { ROLE_TITLES } from "@/constants/user-role";
import Animation from "@/shared/components/custom/Animation";
import Loading from "@/shared/components/custom/skeleton/Loading";
import Button from "@/shared/components/custom/buttons/Button";
import AppLink from "@/shared/components/custom/AppLink";
import { useMe } from "@/features/users/api/get-me.api";

export default function ProfileMenu({ isOpen }: { isOpen: boolean }) {
  const handleLogout = useLogout();

  const meQuery = useMe();

  const me = meQuery.data;

  return (
    <Animation isOpen={isOpen}>
      <div
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

                <p className="font-light text-xs capitalize text-(--text-muted)">
                  {me?.role && ROLE_TITLES[me.role]}
                </p>
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
      </div>
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
