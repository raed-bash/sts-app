import { cn } from "src/utils/cn";

export type TrProps = React.HTMLAttributes<HTMLTableRowElement>;

function Tr({ className, ...props }: TrProps) {
  return <tr className={cn(``, className)} {...props} />;
}

export default Tr;
