import { cn } from "src/utils/cn";

export type PaperProps = React.HTMLAttributes<HTMLDivElement>;

function Paper({ className, ...props }: PaperProps) {
  return <div className={cn("bg-white rounded-xl ", className)} {...props} />;
}

export default Paper;
