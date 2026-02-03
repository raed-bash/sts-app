import { useState } from "react";
import IconButton from "./buttons/IconButton";
import LabeledTextBox from "./LabeledTextBox";
import ProfileIcon from "src/assets/icons/profile.svg?react";
import LogoutIcon from "src/assets/icons/logout.svg?react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "src/pages/users/users.api";
import { dateFormater } from "src/utils/dateFormater";
import Loading from "./skeleton/Loading";
import RoleView from "./RoleView";
import StatusView from "./StatusView";
import Button from "./buttons/Button";
import useLogout from "src/hooks/useLogout";
import Animation from "./Animation";

export default function Profile() {
  const handleLogout = useLogout();
  const [openProfile, setOpenProfile] = useState(false);

  const handleToggleProfile = () => {
    setOpenProfile((openProfile) => !openProfile);
  };

  const meQuery = useQuery({ queryKey: ["me"], queryFn: () => usersApi.me() });

  const me = meQuery.data;
  return (
    <div className="relative">
      <IconButton
        onClick={handleToggleProfile}
        className="aria-expanded:bg-[#DFDFDF]/40"
        aria-expanded={openProfile}
      >
        <ProfileIcon className="fill-(--text)" />
      </IconButton>
      <Animation
        isOpen={openProfile}
        className="absolute flex gap-8 flex-col justify-center items-center top-full right-0 min-w-[470px] min-h-32 p-4 bg-(--background)  shadow-(--shadow) rounded-lg"
      >
        {meQuery.isLoading ? (
          <Loading />
        ) : (
          <>
            <div className="flex gap-8 flex-row">
              <div className="h-full w-48 gap-5">
                <ProfileIcon className="fill-(--text)" />
              </div>
              <div className="flex flex-col">
                <LabeledTextBox label="Username" className="border-none">
                  {me?.username}
                </LabeledTextBox>
                <LabeledTextBox
                  label="Role"
                  className="border-none items-center"
                >
                  <RoleView role={me?.role} />
                </LabeledTextBox>
                <LabeledTextBox
                  label="Status"
                  className="border-none items-center"
                >
                  <StatusView status={me?.status} />
                </LabeledTextBox>
                <LabeledTextBox
                  label="Created At"
                  className="border-none min-w-max"
                >
                  {dateFormater(me?.created_at)}
                </LabeledTextBox>
              </div>
            </div>
            <div className="w-full">
              <Button
                variant="contained"
                color="danger"
                className="flex gap-2 items-center ps-8"
                onClick={handleLogout}
              >
                <div className="w-7">
                  <LogoutIcon className="fill-white " />
                </div>{" "}
                Logout
              </Button>
            </div>
          </>
        )}
      </Animation>
    </div>
  );
}
