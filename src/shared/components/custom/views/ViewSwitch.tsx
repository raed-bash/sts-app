import { LayoutGrid, Table2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "cn";
import type { ViewMode } from "./use-view-mode";

export default function ViewSwitch({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (value: ViewMode) => void;
}) {
  const { t } = useTranslation();
  const options = [
    { mode: "cards" as const, Icon: LayoutGrid, label: t("views.cards") },
    { mode: "table" as const, Icon: Table2, label: t("views.table") },
  ];

  return (
    <div
      role="group"
      aria-label={t("views.switch")}
      className="inline-flex rounded-lg border bg-card p-0.5"
    >
      {options.map(({ mode, Icon, label }) => (
        <button
          key={mode}
          type="button"
          aria-pressed={value === mode}
          onClick={() => onChange(mode)}
          className={cn(
            "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-sm transition-colors",
            value === mode
              ? "bg-secondary font-medium text-secondary-foreground"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          <Icon size={16} />
          <span className="hidden sm:inline">{label}</span>
        </button>
      ))}
    </div>
  );
}
