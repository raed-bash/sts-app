import type { ReactNode } from "react";
import { Inbox } from "lucide-react";
import { useTranslation } from "react-i18next";
import { Button } from "@/shared/components/ui/button";
import { Skeleton } from "@/shared/components/ui/skeleton";

/** Responsive grid with loading skeletons, an empty state and "load more". */
export default function CardGrid<T extends { id: number }>({
  items,
  loading,
  renderItem,
  emptyText,
  hasMore,
  loadingMore,
  onLoadMore,
  total,
}: {
  items: T[];
  loading?: boolean;
  renderItem: (item: T) => ReactNode;
  emptyText?: string;
  hasMore?: boolean;
  loadingMore?: boolean;
  onLoadMore?: () => void;
  total?: number;
}) {
  const { t } = useTranslation();

  if (loading)
    return (
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} className="h-40 rounded-xl" />
        ))}
      </div>
    );

  if (items.length === 0)
    return (
      <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-16 text-center text-muted-foreground">
        <Inbox size={28} />
        {emptyText ?? t("table.noData")}
      </div>
    );

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        {items.map((item) => (
          <div key={item.id} className="contents">
            {renderItem(item)}
          </div>
        ))}
      </div>
      <div className="flex flex-col items-center gap-2 text-xs text-muted-foreground">
        {total !== undefined && (
          <span>{t("views.showing", { count: items.length, total })}</span>
        )}
        {hasMore && (
          <Button variant="outline" onClick={onLoadMore} disabled={loadingMore}>
            {loadingMore ? t("loading") : t("table.loadMore")}
          </Button>
        )}
      </div>
    </div>
  );
}
