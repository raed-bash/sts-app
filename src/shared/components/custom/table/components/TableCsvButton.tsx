import { Button } from "@/shared/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/shared/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/shared/components/ui/tooltip";
import { ClipboardCopy, Download, FileSpreadsheet } from "lucide-react";

export type TableCsvButtonProps = {
  onCopy: () => void;

  onDownload: () => void;

  disabled?: boolean;
};

function TableCsvButton({ onCopy, onDownload, disabled }: TableCsvButtonProps) {
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
                  aria-label="Export table as CSV"
                  disabled={disabled}
                >
                  <FileSpreadsheet />
                </Button>
              }
            />
          }
        />
        <TooltipContent>Export CSV</TooltipContent>
      </Tooltip>
      <DropdownMenuContent align="end">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1 text-[12px] font-semibold text-gray-400 uppercase">
            Export CSV
          </DropdownMenuLabel>
          <DropdownMenuItem
            onClick={onCopy}
            className="gap-2 rounded-md px-2 py-1 text-[13px]"
          >
            <ClipboardCopy size={16} />
            Copy table
          </DropdownMenuItem>
          <DropdownMenuItem
            onClick={onDownload}
            className="gap-2 rounded-md px-2 py-1 text-[13px]"
          >
            <Download size={16} />
            Download CSV
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default TableCsvButton;
