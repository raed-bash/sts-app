import { CircleUserRound, LogOut, Settings, UserRound } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useLogout } from "@/hooks";
import { cn } from "cn";
import { ROLE_TITLES } from "@/constants/user-role";
import Animation from "@/shared/components/custom/Animation";
import Loading from "@/shared/components/custom/loading/Loading";
import { Button } from "@/shared/components/ui/button";
import AppLink from "@/shared/components/custom/AppLink";
import { useMe } from "@/features/users/api/get-me.api";
import { settingsPaths } from "@/features/settings/settings.paths";
import { translateDynamic } from "@/shared/lib/translate-dynamic";

export default function ProfileMenu({ isOpen }: { isOpen: boolean }) {
  const handleLogout = useLogout();

  const meQuery = useMe();

  const { t } = useTranslation(["common"]);

  const me = meQuery.data;

  return (
    <Animation isOpen={isOpen}>
      <div
        className="absolute flex gap-8 flex-col justify-center items-center top-[160%] end-0  min-w-[218px] min-h-32 bg-(--surface)  shadow-base rounded-lg"
        tabIndex={0}
      >
        {meQuery.isLoading ? (
          <Loading />
        ) : (
          <div className="w-full flex flex-col gap-5">
            <div className="flex items-center gap-2 px-4 py-3 border-b border-gray-300">
              <div className="w-[45px] h-[45px]">
                <UserRound className="stroke-(--text) w-full h-full" />
              </div>
              <div className="flex justify-center items-start flex-col">
                <p className="text-sm">{me?.username}</p>

                <p className="font-light text-xs capitalize text-(--text-muted)">
                  {me?.role && t(ROLE_TITLES[me.role])}
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
                    <opt.Icon className="stroke-white " />
                  </span>
                  <span className="block text-sm group-hover:text-(--primary-hover) capitalize text-(--text-muted) ">
                    {translateDynamic(t, opt.label)}
                  </span>
                </AppLink>
              ))}
            </div>
            <div className="px-4 py-3 border-t border-gray-300">
              <Button
                className="flex gap-2 items-center justify-center w-full h-10 text-sm"
                onClick={handleLogout}
              >
                <LogOut className="w-5 h-5" />
                {t("profile.logout")}
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
      <CircleUserRound {...props} />
    ),
    bgColorClassName: "bg-green-500",
    label: "profile.profile",
    to: "profile",
  },
  {
    Icon: (props: React.SVGProps<SVGSVGElement>) => <Settings {...props} />,
    bgColorClassName: "bg-yellow-500",
    label: "profile.settings",
    to: settingsPaths.settings,
  },
];
