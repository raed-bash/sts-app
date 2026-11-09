import type { ReactNode } from "react";

/** Small labelled value tile for detail-page headers. */
export default function Fact({
  icon,
  label,
  value,
}: {
  icon?: ReactNode;
  label: string;
  value: ReactNode;
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg bg-secondary/60 p-3">
      {icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-md bg-card text-primary">
          {icon}
        </div>
      )}
      <div className="min-w-0">
        <div className="truncate text-xs text-muted-foreground">{label}</div>
        <div className="truncate font-semibold tabular-nums">{value}</div>
      </div>
    </div>
  );
}
