import { useTranslation } from "react-i18next";
import { Check } from "lucide-react";
import { cn } from "cn";
import type { QuestionType } from "@/constants/question-type";
import QuestionTypeBadge from "@/components/QuestionTypeBadge";

export type PreviewChoice = { text: string; isCorrect: boolean };

/**
 * The question as a student sees it during the exam. With `showAnswers`
 * the correct option / blank answers are filled in (author view).
 */
export default function QuestionPreview({
  type,
  text,
  points,
  choices = [],
  segments = [],
  blanks = [],
  showAnswers = false,
}: {
  type: QuestionType;
  text: string;
  points?: number;
  choices?: PreviewChoice[];
  /** blanks questions: text around the blanks */
  segments?: string[];
  /** blanks questions: correct answer per blank, in order */
  blanks?: string[];
  showAnswers?: boolean;
}) {
  const { t } = useTranslation(["questions", "testSessions"]);
  // the exam shuffles the answer bank; rotate so the preview isn't in answer order
  const bank = blanks.length > 1 ? [...blanks.slice(1), blanks[0]] : blanks;

  return (
    <div className="flex flex-col gap-3 rounded-xl border bg-card p-4">
      <div className="flex items-center gap-2">
        <QuestionTypeBadge type={type} />
        {points !== undefined && (
          <span className="text-xs text-muted-foreground">
            {t("testSessions:results.pts", { count: points })}
          </span>
        )}
      </div>
      <div className="font-medium">
        {text.trim() || (
          <span className="text-muted-foreground">
            {t("questions:form.previewTextPlaceholder")}
          </span>
        )}
      </div>

      {type === "CHOOSE" ? (
        choices.filter((c) => c.text.trim()).length === 0 ? (
          <p className="text-xs text-muted-foreground">
            {t("questions:form.previewNoOptions")}
          </p>
        ) : (
          <ul className="flex flex-col gap-2">
            {choices
              .filter((c) => c.text.trim())
              .map((choice, index) => {
                const correct = showAnswers && choice.isCorrect;
                return (
                  <li
                    key={index}
                    className={cn(
                      "flex items-center gap-2 rounded-lg border px-3 py-2 text-sm",
                      correct && "border-success/50 bg-success/10",
                    )}
                  >
                    <span
                      className={cn(
                        "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                        correct
                          ? "border-success bg-success text-white"
                          : "text-muted-foreground",
                      )}
                    >
                      {correct ? (
                        <Check size={13} />
                      ) : (
                        String.fromCharCode(65 + index)
                      )}
                    </span>
                    {choice.text}
                  </li>
                );
              })}
          </ul>
        )
      ) : blanks.length === 0 ? (
        <p className="text-xs text-muted-foreground">
          {t("questions:form.previewNoBlanks")}
        </p>
      ) : (
        <>
          <p className="rounded-lg border p-3 text-sm leading-10">
            {segments.map((segment, i) => (
              <span key={i}>
                {segment}
                {i < blanks.length && (
                  <span
                    className={cn(
                      "mx-1 inline-flex h-8 min-w-20 items-center justify-center rounded-md border-2 px-2 align-middle text-sm",
                      showAnswers
                        ? "border-primary/50 bg-primary/10 font-medium"
                        : "border-dashed border-muted-foreground/40 text-xs text-muted-foreground",
                    )}
                  >
                    {showAnswers ? blanks[i] : i + 1}
                  </span>
                )}
              </span>
            ))}
          </p>
          {!showAnswers && (
            <div className="flex flex-wrap gap-2">
              {bank.map((answer, i) => (
                <span
                  key={i}
                  className="rounded-lg border bg-card px-3 py-1.5 text-sm font-medium shadow-sm"
                >
                  {answer}
                </span>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
}
