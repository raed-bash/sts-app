import Tr, { type TrProps } from "./Tr";
import Td, { type TdProps } from "./Td";
import { cn } from "src/utils/cn";

export type TOverlayProps = React.HTMLAttributes<HTMLDivElement> & {
  TrProps?: TrProps;
  TdProps?: TdProps;
};

function TOverlay({
  TrProps = {},
  TdProps = {},
  children,
  ...props
}: TOverlayProps) {
  return (
    <Tr {...TrProps} className={cn("hover:bg-none", TrProps.className)}>
      <Td {...TdProps} className={cn("h-96", TdProps.className)}>
        <div
          {...props}
          className={cn(
            "flex justify-center items-center absolute top-1/2 rtl:right-1/2 ltr:left-1/2 ltr:-translate-x-1/2 ltr:-translate-y-1/2 rtl:translate-x-1/2 rtl:translate-y-1/2 w-fit",
            props.className
          )}
        >
          {children}
        </div>
      </Td>
    </Tr>
  );
}

export default TOverlay;
