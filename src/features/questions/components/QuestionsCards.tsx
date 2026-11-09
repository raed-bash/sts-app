import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Check, Star } from "lucide-react";
import { cn } from "cn";
import { useDebouncedValue } from "@/shared/hooks";
import CardGrid from "@/shared/components/custom/views/CardGrid";
import ItemCard from "@/shared/components/custom/views/ItemCard";
import SearchBox from "@/shared/components/custom/views/SearchBox";
import QuestionTypeBadge from "@/components/QuestionTypeBadge";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import type { QuestionType } from "@/constants/question-type";
import { QUESTION_TYPE_TITLES } from "@/constants/question-type";
import { useQuestionsInfinite } from "../api/get-questions.api";
import { QueryQuestionDto } from "../dtos/query-question.dto";
import type { QuestionDto } from "../dtos/question.dto";

const TYPES = Object.keys(QUESTION_TYPE_TITLES) as QuestionType[];

export default function QuestionsCards({
  actions,
  isDeleted = false,
}: {
  actions: TableAction<QuestionDto>[];
  isDeleted?: boolean;
}) {
  const { t } = useTranslation(["questions", "common"]);
  const [search, setSearch] = useState("");
  const [type, setType] = useState<QuestionType | undefined>();
  const term = useDebouncedValue(search);

  const query = useQuestionsInfinite({
    query: new QueryQuestionDto({
      perPage: 24,
      text: term || undefined,
      type,
      isDeleted,
    }),
  });
  const items = query.data?.pages.flatMap((page) => page.data) ?? [];

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-3">
        <SearchBox value={search} onChange={setSearch} />
        {/* quick type filter */}
        <div className="flex flex-wrap gap-1.5" role="group">
          {[undefined, ...TYPES].map((value) => (
            <button
              key={value ?? "all"}
              type="button"
              aria-pressed={type === value}
              onClick={() => setType(value)}
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                type === value
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-secondary",
              )}
            >
              {value ? t(QUESTION_TYPE_TITLES[value]) : t("common:views.all")}
            </button>
          ))}
        </div>
      </div>
      <CardGrid
        items={items}
        loading={query.isPending}
        total={query.data?.pages[0]?.meta.total}
        hasMore={query.hasNextPage}
        loadingMore={query.isFetchingNextPage}
        onLoadMore={() => query.fetchNextPage()}
        renderItem={(question) => (
          <ItemCard
            row={question}
            actions={actions}
            eyebrow={
              <>
                <QuestionTypeBadge type={question.type} />
                <span className="flex items-center gap-1">
                  <Star size={12} />
                  {t("common:views.points", { count: question.points })}
                </span>
              </>
            }
            title={question.text}
          >
            <AnswersPreview question={question} />
          </ItemCard>
        )}
      />
    </div>
  );
}

/** A quick look at the answers so you don't need to open the question. */
function AnswersPreview({ question }: { question: QuestionDto }) {
  const { t } = useTranslation(["common"]);
  const answers = question.answers ?? [];

  if (answers.length === 0)
    return (
      <span className="text-xs text-muted-foreground">
        {t("common:views.noAnswers")}
      </span>
    );

  if (question.type === "CHOOSE")
    return (
      <ul className="flex flex-col gap-1 text-sm">
        {[...answers]
          .sort((a, b) => a.order - b.order)
          .slice(0, 4)
          .map((answer) => (
            <li
              key={answer.id}
              className={cn(
                "flex items-center gap-2 truncate rounded-md px-2 py-1",
                answer.isCorrect
                  ? "bg-success/10 font-medium text-success"
                  : "text-muted-foreground",
              )}
            >
              {answer.isCorrect ? (
                <Check size={14} className="shrink-0" />
              ) : (
                <span className="size-3.5 shrink-0 rounded-full border" />
              )}
              <span className="truncate">{answer.text}</span>
            </li>
          ))}
      </ul>
    );

  // blanks / order: show the sentence with the correct answers filled in
  const byPosition = [...answers].sort(
    (a, b) => (a.correctIndex ?? 0) - (b.correctIndex ?? 0),
  );
  const segments = question.completeQuestion?.text.split(";;;;");

  return (
    <p className="line-clamp-3 rounded-md bg-muted/50 px-2 py-1.5 text-sm leading-7">
      {segments
        ? segments.map((segment, i) => (
            <span key={i}>
              {segment}
              {i < segments.length - 1 && (
                <span className="mx-0.5 rounded bg-primary/10 px-1.5 py-0.5 font-medium text-primary">
                  {byPosition[i]?.text ?? "…"}
                </span>
              )}
            </span>
          ))
        : byPosition.map((a) => a.text).join(" → ")}
    </p>
  );
}
