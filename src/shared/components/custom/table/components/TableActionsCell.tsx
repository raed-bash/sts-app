import type { ReactNode } from "react";
import { type VariantProps } from "class-variance-authority";
import { Button } from "../../../ui/button";
import { buttonVariants } from "../../../ui/button-variants";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "../../../ui/tooltip";
import type { TableRowRecord } from "../Table";

export type TableAction<Row extends TableRowRecord> = {
  name: string;
  label: string;
  icon: ReactNode;
  variant?: VariantProps<typeof buttonVariants>["variant"];
  onClick: (row: Row) => void;
};

export type TableActionsCellProps<Row extends TableRowRecord> = {
  row: Row;
  actions: TableAction<Row>[];
};

function TableActionsCell<Row extends TableRowRecord>({
  row,
  actions,
}: TableActionsCellProps<Row>) {
  return (
    <div className="flex gap-3 justify-start">
      {actions.map(({ name, label, icon, variant = "outline", onClick }) => (
        <Tooltip key={name}>
          <TooltipTrigger
            render={
              <Button variant={variant} onClick={() => onClick(row)}>
                {icon}
              </Button>
            }
          />
          <TooltipContent>{label}</TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
}

export default TableActionsCell;
