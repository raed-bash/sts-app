import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { Rows3 } from "lucide-react";
import { cn } from "cn";
import { useTranslation } from "react-i18next";
import { translateDynamic } from "@/shared/lib/translate-dynamic";
import type { TableDensity } from "../constants/table-density";
import { TABLE_DENSITIES } from "../constants/table-density";

export type TableDensityProps = {
  density: TableDensity;
  onDensityChange: (density: TableDensity) => void;
};

export type TableDensityButtonProps = TableDensityProps;

function TableDensityButton({
  density,
  onDensityChange,
}: TableDensityButtonProps) {
  const { t } = useTranslation();

  return (
    <DropdownMenu>
      <Tooltip>
        <DropdownMenuTrigger
          render={
            <TooltipTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon-lg"
                  aria-label={t("table.tableDensity")}
                >
                  <Rows3 />
                </Button>
              }
            />
          }
        />
        <TooltipContent>{t("table.density")}</TooltipContent>
      </Tooltip>
      <DropdownMenuContent>
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1 text-[12px] font-semibold text-gray-400 uppercase">
            {t("table.density")}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={density}
            onValueChange={(value) => onDensityChange(value as TableDensity)}
          >
            {TABLE_DENSITIES.map((option) => (
              <DropdownMenuRadioItem
                key={option.value}
                value={option.value}
                className={cn(
                  "rounded-md px-2 py-1 text-[13px]",
                  "data-highlighted:bg-primary data-highlighted:text-primary-foreground",
                  "data-checked:bg-primary data-checked:text-primary-foreground",
                )}
              >
                {translateDynamic(t, option.label)}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TableDensityButton;
