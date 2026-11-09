import { Trash2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "cn";

/** Opt-in switch for soft-deleted rows (hidden by default). */
export default function ShowDeletedToggle({
  value,
  onChange,
}: {
  value: boolean;
  onChange: (value: boolean) => void;
}) {
  const { t } = useTranslation();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      onClick={() => onChange(!value)}
      className={cn(
        "flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-sm transition-colors",
        value
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      <Trash2 size={15} />
      <span className="hidden sm:inline">{t("views.showDeleted")}</span>
    </button>
  );
}
