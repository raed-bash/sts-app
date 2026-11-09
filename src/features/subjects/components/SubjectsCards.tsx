import { useState } from "react";
import { useTranslation } from "react-i18next";
import { BookOpen, CalendarCheck, FileText } from "lucide-react";
import { useDebouncedValue } from "@/shared/hooks";
import CardGrid from "@/shared/components/custom/views/CardGrid";
import ItemCard from "@/shared/components/custom/views/ItemCard";
import SearchBox from "@/shared/components/custom/views/SearchBox";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import { useSubjectsInfinite } from "../api/get-subjects.api";
import { QuerySubjectDto } from "../dtos/query-subject.dto";
import type { SubjectDto } from "../dtos/subject.dto";

export default function SubjectsCards({
  actions,
  isDeleted = false,
}: {
  actions: TableAction<SubjectDto>[];
  isDeleted?: boolean;
}) {
  const { t } = useTranslation(["subjects", "common"]);
  const [search, setSearch] = useState("");
  const term = useDebouncedValue(search);

  const query = useSubjectsInfinite({
    query: new QuerySubjectDto({
      perPage: 24,
      name: term || undefined,
      isDeleted,
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
        renderItem={(subject) => (
          <ItemCard
            row={subject}
            actions={actions}
            eyebrow={
              <>
                <BookOpen size={13} />#{subject.id}
              </>
            }
            title={subject.name}
            footer={
              <>
                <span className="flex items-center gap-1">
                  <FileText size={13} />
                  {t("common:views.testsCount", {
                    count: subject.testsCount ?? 0,
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <CalendarCheck size={13} />
                  {t("common:views.sessionsCount", {
                    count: subject.sessionsCount ?? 0,
                  })}
                </span>
              </>
            }
          />
        )}
      />
    </div>
  );
}
