import { cn } from "src/utils/cn";

export type SkeletonProps = React.HTMLAttributes<HTMLDivElement>;

function Skeleton({ className, ...props }: SkeletonProps) {
  return (
    <div
      className={cn("animate-pulse p-5 rounded-md bg-gray-400 ", className)}
      {...props}
    />
  );
}

export default Skeleton;
