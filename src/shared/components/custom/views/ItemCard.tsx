import type { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "cn";
import TableActionsCell, {
  type TableAction,
} from "../table/components/TableActionsCell";
import { getPrimaryAction } from "../table/utils/primary-action";

/**
 * Clickable card for one record. Clicking anywhere opens it (same rule as
 * table rows); the action buttons/menu in the corner keep their own clicks.
 */
export default function ItemCard<
  Row extends { id: number; deletedAt?: Date | string | null },
>({
  row,
  actions,
  title,
  eyebrow,
  children,
  footer,
  className,
}: {
  row: Row;
  actions: TableAction<Row>[];
  title: ReactNode;
  eyebrow?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
  className?: string;
}) {
  const { t } = useTranslation();
  const primary = getPrimaryAction(actions, row);
  const open = primary ? () => primary.onClick(row) : undefined;

  return (
    <div
      role={open ? "button" : undefined}
      tabIndex={open ? 0 : undefined}
      onClick={(event) => {
        if (
          (event.target as HTMLElement).closest(
            "button,a,input,[role='menuitem']",
          )
        )
          return;
        open?.();
      }}
      onKeyDown={(event) => {
        if (event.key === "Enter" && event.target === event.currentTarget)
          open?.();
      }}
      className={cn(
        "group flex flex-col gap-3 rounded-xl border bg-card p-4 text-start shadow-sm transition-all",
        open &&
          "cursor-pointer hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none",
        row.deletedAt && "opacity-60",
        className,
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          {eyebrow && (
            <div className="mb-1 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              {eyebrow}
            </div>
          )}
          <div className="flex items-center gap-2">
            <h3 className="line-clamp-2 font-semibold leading-snug">{title}</h3>
            {row.deletedAt && (
              <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                {t("table.deleted")}
              </span>
            )}
          </div>
        </div>
        <div className="-me-2 -mt-1 shrink-0 opacity-70 transition-opacity group-hover:opacity-100">
          <TableActionsCell row={row} actions={actions} />
        </div>
      </div>
      {children}
      {footer && (
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 border-t pt-3 text-xs text-muted-foreground">
          {footer}
        </div>
      )}
    </div>
  );
}
