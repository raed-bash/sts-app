import { useRef, useState } from "react";
import ProfileIcon from "@/assets/icons/profile.svg?react";
import { useFocusout } from "@/shared/hooks";
import ProfileMenu from "./ProfileMenu";
import IconButton from "@/shared/components/custom/buttons/IconButton";

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
      <ProfileMenu isOpen={openProfile} />
    </div>
  );
}
