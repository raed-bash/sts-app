import TableRow, { type TableRowProps } from "./TableRow";
import TableCell, { type TableCellProps } from "./TableCell";
import { cn } from "cn";

export type TableOverlayProps = React.ComponentProps<"div"> & {
  tableRowProps?: TableRowProps;
  tableCellProps?: TableCellProps;
};

function TableOverlay({
  tableRowProps = {},
  tableCellProps = {},
  children,
  ...props
}: TableOverlayProps) {
  return (
    <TableRow
      {...tableRowProps}
      className={cn("hover:bg-none", tableRowProps.className)}
    >
      <TableCell
        {...tableCellProps}
        className={cn("h-14", tableCellProps.className)}
      >
        <div
          {...props}
          className={cn(
            "flex justify-center items-center absolute top-[80%] rtl:right-1/2 ltr:left-1/2 ltr:-translate-x-1/2 ltr:-translate-y-1/2 rtl:translate-x-1/2 rtl:translate-y-1/2 w-fit",
            props.className,
          )}
        >
          {children}
        </div>
      </TableCell>
    </TableRow>
  );
}

export default TableOverlay;
