import { useTranslation } from "react-i18next";

/** Primary text of a row, cut to one line, tagged when the row is soft-deleted. */
export function NameCell({
  text,
  deletedAt,
  sub,
}: {
  text: string;
  deletedAt?: Date | string | null;
  /** optional secondary line (e.g. the subject of a test) */
  sub?: string | null;
}) {
  const { t } = useTranslation();

  return (
    <div className="flex max-w-[28rem] flex-col">
      <div className="flex items-center gap-2">
        <span className="truncate font-medium" title={text}>
          {text}
        </span>
        {deletedAt && (
          <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
            {t("table.deleted")}
          </span>
        )}
      </div>
      {sub && (
        <span className="truncate text-xs text-muted-foreground" title={sub}>
          {sub}
        </span>
      )}
    </div>
  );
}
