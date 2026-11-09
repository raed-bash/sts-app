import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Clock3, FileText, HelpCircle } from "lucide-react";
import { useDebouncedValue } from "@/shared/hooks";
import CardGrid from "@/shared/components/custom/views/CardGrid";
import ItemCard from "@/shared/components/custom/views/ItemCard";
import SearchBox from "@/shared/components/custom/views/SearchBox";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { useTestsInfinite } from "../api/get-tests.api";
import { QueryTestDto } from "../dtos/query-test.dto";
import type { TestDto } from "../dtos/test.dto";

export default function TestsCards({
  actions,
  subjectIds,
  isDeleted = false,
}: {
  actions: TableAction<TestDto>[];
  /** limit to these subjects (subject detail page) */
  subjectIds?: number[];
  isDeleted?: boolean;
}) {
  const { t } = useTranslation(["tests", "common"]);
  const [search, setSearch] = useState("");
  const term = useDebouncedValue(search);

  const query = useTestsInfinite({
    query: new QueryTestDto({
      perPage: 24,
      name: term || undefined,
      isDeleted,
      ...(subjectIds?.length ? { subjectIds } : {}),
    }),
  });
  const items = query.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <SearchBox value={search} onChange={setSearch} />
      <CardGrid
        items={items}
        loading={query.isPending}
        total={query.data?.pages[0]?.meta.total}
        hasMore={query.hasNextPage}
        loadingMore={query.isFetchingNextPage}
        onLoadMore={() => query.fetchNextPage()}
        renderItem={(test) => (
          <ItemCard
            row={test}
            actions={actions}
            eyebrow={
              <>
                <FileText size={13} />#{test.id}
              </>
            }
            title={test.name}
            footer={
              <>
                <span className="flex items-center gap-1">
                  <Clock3 size={13} />
                  {t("common:views.minutes", { count: test.period })}
                </span>
                <span className="flex items-center gap-1">
                  <HelpCircle size={13} />
                  {t("common:views.questionsCount", {
                    count: test.questionsCount ?? 0,
                  })}
                </span>
              </>
            }
          >
            {test.subjects && test.subjects.length > 0 ? (
              <div className="flex flex-wrap gap-1.5">
                {test.subjects.map((subject) => (
                  <span
                    key={subject.id}
                    className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground"
                  >
                    {subject.name}
                  </span>
                ))}
              </div>
            ) : (
              <span className="text-xs text-muted-foreground">
                {t("common:views.noSubject")}
              </span>
            )}
          </ItemCard>
        )}
      />
    </div>
  );
}
