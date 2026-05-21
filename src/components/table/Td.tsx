import { cn } from "src/utils/cn";

export type TdProps = React.TdHTMLAttributes<HTMLTableCellElement>;

function Td(props: TdProps) {
  return (
    <td
      title={typeof props.children === "string" ? props.children : ""}
      {...props}
      className={cn(`text-sm py-3 px-4 `, props.className)}
    />
  );
}

export default Td;
