import TableRow, { type TableRowProps } from "./TableRow";
import TableCell, { type TableCellProps } from "./TableCell";
import { cn } from "cn";

export type TableOverlayProps = React.ComponentProps<"div"> & {
  /**
   * Number of table columns the overlay should span.
   * Pass the body column count (include the selection column when selectable).
   */
  colSpan?: number;

  /**
   * Height (px) the overlay should fill. When provided, it sizes the overlay
   * to the full body area so the table doesn't jump when data loads.
   */
  minHeight?: number;

  elements?: {
    /** Overlay row; <tr> element */
    rowProps?: TableRowProps;

    /** Overlay cell; <td> element */
    cellProps?: TableCellProps;
  };
};

function TableOverlay({
  colSpan = 1,
  minHeight,
  elements = {},
  children,
  ...props
}: TableOverlayProps) {
  const { rowProps = {}, cellProps = {} } = elements;

  return (
    <TableRow
      {...rowProps}
      className={cn("hover:bg-none", rowProps.className)}
    >
      <TableCell
        {...cellProps}
        colSpan={colSpan}
        style={
          minHeight
            ? { height: minHeight, ...cellProps.style }
            : cellProps.style
        }
        className={cn(!minHeight && "h-56", cellProps.className)}
      >
        <div
          {...props}
          className={cn(
            "absolute inset-0 flex items-center justify-center",
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
