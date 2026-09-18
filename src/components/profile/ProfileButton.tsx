import { useRef, useState } from "react";
import { UserRound } from "lucide-react";
import { useFocusout } from "@/shared/hooks";
import ProfileMenu from "./ProfileMenu";
import { Button } from "@/shared/components/ui/button";

export default function ProfileButton() {
  const [openProfile, setOpenProfile] = useState(false);

  const handleToggleProfile = () => {
    setOpenProfile((openProfile) => !openProfile);
  };

  const profileMenuRef = useRef(null);

  useFocusout(profileMenuRef, () => setOpenProfile(false));

  return (
    <div className="relative" ref={profileMenuRef}>
      <Button
        onClick={handleToggleProfile}
        variant="ghost"
        size="icon"
        className="aria-expanded:bg-[#DFDFDF]/40"
        aria-expanded={openProfile}
      >
        <UserRound className="stroke-(--text)" />
      </Button>
      <ProfileMenu isOpen={openProfile} />
    </div>
  );
}
