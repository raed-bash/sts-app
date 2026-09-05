import { cn } from "cn";

export type PaperProps = React.HTMLAttributes<HTMLDivElement>;

function Paper({ className, ...props }: PaperProps) {
  return (
    <div
      className={cn(
        "bg-(--surface) rounded-lg shadow-base p-6 text-(--text)",
        className,
      )}
      {...props}
    />
  );
}

export default Paper;
