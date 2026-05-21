import { useRef, useState } from "react";
import IconButton from "../buttons/IconButton";
import ProfileIcon from "src/assets/icons/profile.svg?react";
import useFocusout from "src/hooks/useFocusout";
import ProfileMenu from "./ProfileMenu";

export default function ProfileButton() {
  const [openProfile, setOpenProfile] = useState(false);

  const handleToggleProfile = () => {
    setOpenProfile((openProfile) => !openProfile);
  };

  const profileMenuRef = useRef(null);

  useFocusout(profileMenuRef, () => setOpenProfile(false));

  return (
    <div className="relative" ref={profileMenuRef}>
      <IconButton
        onClick={handleToggleProfile}
        className="aria-expanded:bg-[#DFDFDF]/40"
        aria-expanded={openProfile}
      >
        <ProfileIcon className="fill-(--text)" />
      </IconButton>
      <ProfileMenu open={openProfile} />
    </div>
  );
}
