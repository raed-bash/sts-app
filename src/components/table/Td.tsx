import { cn } from "src/utils/cn";

export type TdProps = React.TdHTMLAttributes<HTMLTableCellElement>;

function Td(props: TdProps) {
  return (
    <td
      align="center"
      title={typeof props.children === "string" ? props.children : ""}
      {...props}
      className={cn(
        `text-base max-lg:text-xs max-lg:py-2 py-5 px-2`,
        props.className
      )}
    />
  );
}

export default Td;
