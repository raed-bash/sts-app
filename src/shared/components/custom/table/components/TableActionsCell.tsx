import type { ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { MoreHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "../../../ui/button";
import { buttonVariants } from "../../../ui/button-variants";
import { Tooltip, TooltipContent, TooltipTrigger } from "../../../ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../../../ui/dropdown-menu";
import type { TableRowRecord } from "../Table";

export type TableAction<Row extends TableRowRecord> = {
  name: string;
  label: string;
  icon: ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  hidden?: (row: Row) => boolean;
  onClick: (row: Row) => void;
};

export type TableActionsCellProps<Row extends TableRowRecord> = {
  row: Row;
  actions: TableAction<Row>[];
};

/** How many non-destructive actions stay visible as quick buttons. */
const INLINE_ACTIONS = 2;

function TableActionsCell<Row extends TableRowRecord>({
  row,
  actions,
}: TableActionsCellProps<Row>) {
  const { t } = useTranslation();
  const visible = actions.filter((action) => !action.hidden?.(row));

  const safe = visible.filter((a) => a.variant !== "destructive");
  const destructive = visible.filter((a) => a.variant === "destructive");

  // Few actions: show them all. Otherwise the first quick ones + a labelled menu.
  const fitsInline = visible.length <= INLINE_ACTIONS + 1;
  const inline = fitsInline ? visible : safe.slice(0, INLINE_ACTIONS);
  const menuSafe = fitsInline ? [] : safe.slice(INLINE_ACTIONS);
  const menuDestructive = fitsInline ? [] : destructive;

  if (visible.length === 0)
    return <span className="text-muted-foreground">—</span>;

  return (
    <div className="flex items-center gap-1">
      {inline.map(({ name, label, icon, variant, onClick }) => (
        <Tooltip key={name}>
          <TooltipTrigger
            render={
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={label}
                className={
                  variant === "destructive"
                    ? "text-destructive hover:bg-destructive/10 hover:text-destructive"
                    : undefined
                }
                onClick={() => onClick(row)}
              >
                {icon}
              </Button>
            }
          />
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}

      {(menuSafe.length > 0 || menuDestructive.length > 0) && (
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                size="icon-sm"
                variant="ghost"
                aria-label={t("table.moreActions")}
              >
                <MoreHorizontal />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-auto min-w-44">
            {menuSafe.map(({ name, label, icon, onClick }) => (
              <DropdownMenuItem key={name} onClick={() => onClick(row)}>
                {icon}
                {label}
              </DropdownMenuItem>
            ))}
            {menuSafe.length > 0 && menuDestructive.length > 0 && (
              <DropdownMenuSeparator />
            )}
            {menuDestructive.map(({ name, label, icon, onClick }) => (
              <DropdownMenuItem
                key={name}
                variant="destructive"
                onClick={() => onClick(row)}
              >
                {icon}
                {label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
}

export default TableActionsCell;
