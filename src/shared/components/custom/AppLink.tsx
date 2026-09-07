import { Link, type LinkProps } from "react-router";
import { cn } from "cn";

export type AppLinkProps = LinkProps & { disabled?: boolean };

function AppLink({ disabled, className, ...props }: AppLinkProps) {
  return (
    <Link
      className={cn(
        `underline aria-disabled:cursor-default aria-disabled:no-underline aria-disabled:pointer-events-none`,
        className,
      )}
      aria-disabled={disabled}
      {...props}
    />
  );
}

export default AppLink;
