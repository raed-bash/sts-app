import TableRow, { type TableRowProps } from "./TableRow";
import TableCell, { type TableCellProps } from "./TableCell";
import { cn } from "cn";

export type TableOverlayProps = React.ComponentProps<"div"> & {
  TableRowProps?: TableRowProps;
  TableCellProps?: TableCellProps;
};

function TableOverlay({
  TableRowProps = {},
  TableCellProps = {},
  children,
  ...props
}: TableOverlayProps) {
  return (
    <TableRow
      {...TableRowProps}
      className={cn("hover:bg-none", TableRowProps.className)}
    >
      <TableCell
        {...TableCellProps}
        className={cn("h-14", TableCellProps.className)}
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
