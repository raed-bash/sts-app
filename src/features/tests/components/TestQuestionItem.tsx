import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown } from "lucide-react";
import { cn } from "cn";
import QuestionTypeBadge from "@/components/QuestionTypeBadge";
import TableActionsCell, {
  type TableAction,
} from "@/shared/components/custom/table/components/TableActionsCell";
import QuestionPreview from "@/features/questions/components/form/QuestionPreview";
import { fromStored, parseBlanks } from "@/features/questions/utils/blanks";
import type { QuestionDto } from "@/features/questions/dtos/question.dto";

/** One numbered question of a test, expandable to its answer key. */
export default function TestQuestionItem({
  index,
  question,
  actions,
}: {
  index: number;
  question: QuestionDto;
  actions: TableAction<QuestionDto>[];
}) {
  const { t } = useTranslation(["tests", "testSessions", "common"]);
  const [open, setOpen] = useState(false);

  const answers = question.answers ?? [];
  const parsed = question.completeQuestion
    ? parseBlanks(fromStored(question.completeQuestion.text, answers))
    : null;

  return (
    <li
      className={cn(
        "rounded-xl border bg-card shadow-sm",
        question.deletedAt && "opacity-60",
      )}
    >
      <div className="flex items-start gap-3 p-4">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-bold text-secondary-foreground">
          {index + 1}
        </span>
        <button
          type="button"
          aria-expanded={open}
          onClick={() => setOpen(!open)}
          className="flex min-w-0 flex-1 flex-col gap-1 text-start"
        >
          <span className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
            <QuestionTypeBadge type={question.type} />
            {t("testSessions:results.pts", { count: question.points })}
            {question.deletedAt && (
              <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[11px] font-semibold text-destructive">
                {t("common:table.deleted")}
              </span>
            )}
          </span>
          <span className="font-medium">{question.text}</span>
          <span className="flex items-center gap-1 text-xs text-primary">
            <ChevronDown
              size={14}
              className={cn("transition-transform", open && "rotate-180")}
            />
            {open
              ? t("tests:detail.hideAnswers")
              : t("tests:detail.showAnswers")}
          </span>
        </button>
        <TableActionsCell row={question} actions={actions} />
      </div>
      {open && (
        <div className="border-t p-4">
          <QuestionPreview
            type={question.type}
            text={question.text}
            choices={[...answers]
              .sort((a, b) => a.order - b.order)
              .map(({ text, isCorrect }) => ({ text, isCorrect }))}
            segments={parsed?.segments}
            blanks={parsed?.blanks}
            showAnswers
          />
        </div>
      )}
    </li>
  );
}
