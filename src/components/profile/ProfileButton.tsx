import { useRef, useState } from "react";
import { UserRound } from "lucide-react";
import { useFocusout } from "@/shared/hooks";
import ProfileMenu from "./ProfileMenu";
import { Button } from "@/shared/components/ui/button";
import { useTranslation } from "react-i18next";

export default function ProfileButton() {
  const { t } = useTranslation();
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
        aria-haspopup="menu"
        aria-label={t("profile.profile")}
      >
        <UserRound className="stroke-foreground" />
      </Button>
      <ProfileMenu isOpen={openProfile} />
    </div>
  );
}
