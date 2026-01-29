import { cn } from "src/utils/cn";

export type PaperProps = React.HTMLAttributes<HTMLDivElement>;

function Paper({ className, ...props }: PaperProps) {
  return (
    <div
      className={cn("bg-white rounded-xl shadow-sm p-5", className)}
      {...props}
    />
  );
}

export default Paper;
