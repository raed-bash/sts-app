import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ArrowDown, ArrowUp, GripVertical, X } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/shared/components/ui/button";
import type {
  ExamAnswerDto,
  ExamQuestionDto,
} from "../../dtos/exam-test-session.dto";
import { usePointerDrag } from "./usePointerDrag";
import {
  moveItem,
  placeInBlank,
  removeFromBlanks,
  type Blanks,
} from "./placement";

/**
 * Fill-in / drag-into-blank question.
 * Drag: chip -> blank, blank -> blank (swap), blank -> bank (remove).
 * Tap: select a chip then a blank (or a blank then a chip); tap a filled blank to clear it.
 */
export function BlanksAnswers({
  question,
  value,
  onChange,
  dragMode = false,
}: {
  question: ExamQuestionDto;
  value: Blanks;
  onChange: (value: Blanks) => void;
  dragMode?: boolean;
}) {
  const { t } = useTranslation(["testSessions"]);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [selectedBlank, setSelectedBlank] = useState<number | null>(null);

  const segments = (question.completeQuestion?.text ?? "").split(";;;;");
  const textOf = (id: number | null) =>
    question.answers.find((a) => a.id === id)?.text ?? "";
  const bank = question.answers.filter((a) => !value.includes(a.id));

  const reset = () => {
    setSelectedAnswer(null);
    setSelectedBlank(null);
  };

  const { drag, draggable, ghost } = usePointerDrag<number>(
    (answerId, target) => {
      reset();
      const blankPrefix = `blank:${question.id}:`;
      if (target?.startsWith(blankPrefix))
        onChange(
          placeInBlank(
            value,
            answerId,
            Number(target.slice(blankPrefix.length)),
          ),
        );
      else if (target === `bank:${question.id}`)
        onChange(removeFromBlanks(value, answerId));
    },
  );

  const tapBlank = (blank: number) => {
    if (selectedAnswer !== null) {
      onChange(placeInBlank(value, selectedAnswer, blank));
      reset();
    } else if (value[blank] !== null) {
      onChange(removeFromBlanks(value, value[blank]!));
    } else {
      setSelectedBlank(selectedBlank === blank ? null : blank);
    }
  };

  const tapAnswer = (answerId: number) => {
    if (selectedBlank !== null) {
      onChange(placeInBlank(value, answerId, selectedBlank));
      reset();
    } else {
      setSelectedAnswer(selectedAnswer === answerId ? null : answerId);
    }
  };

  const picking = selectedAnswer !== null || drag !== null;

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-muted-foreground" aria-live="polite">
        {selectedAnswer !== null
          ? t("testSessions:exam.tapBlankNow", {
              answer: textOf(selectedAnswer),
            })
          : selectedBlank !== null
            ? t("testSessions:exam.tapAnswerNow", { n: selectedBlank + 1 })
            : dragMode
              ? t("testSessions:exam.dragHint")
              : t("testSessions:exam.fillHint")}
      </div>

      <div className="rounded-lg border border-border p-3 text-sm leading-[2.75rem]">
        {segments.map((segment, blank) => {
          const answerId = value[blank] ?? null;
          const over = drag?.over === `blank:${question.id}:${blank}`;
          return (
            <span key={blank}>
              {segment}
              {blank < segments.length - 1 && (
                <button
                  type="button"
                  data-drop={`blank:${question.id}:${blank}`}
                  aria-label={
                    answerId !== null
                      ? t("testSessions:exam.blankFilled", {
                          n: blank + 1,
                          answer: textOf(answerId),
                        })
                      : t("testSessions:exam.blank", { n: blank + 1 })
                  }
                  onClick={() => tapBlank(blank)}
                  {...(answerId !== null
                    ? draggable(answerId, textOf(answerId))
                    : {})}
                  className={cn(
                    "mx-1 inline-flex h-9 min-w-24 select-none items-center justify-center gap-1.5 rounded-md border-2 px-2 align-middle text-sm transition-colors",
                    answerId !== null
                      ? "cursor-grab border-primary/50 bg-primary/10 font-medium text-foreground active:cursor-grabbing"
                      : "border-dashed border-muted-foreground/40 text-muted-foreground",
                    answerId !== null &&
                      drag?.item === answerId &&
                      "opacity-40",
                    (picking || selectedBlank === blank) &&
                      answerId === null &&
                      "border-primary/70 bg-primary/5",
                    selectedBlank === blank && "ring-2 ring-primary",
                    over &&
                      "border-solid border-primary bg-primary/20 ring-2 ring-primary",
                  )}
                >
                  {answerId !== null ? (
                    <>
                      {textOf(answerId)}
                      <X size={14} className="text-muted-foreground" />
                    </>
                  ) : (
                    <span className="text-xs">{blank + 1}</span>
                  )}
                </button>
              )}
            </span>
          );
        })}
      </div>

      <div
        data-drop={`bank:${question.id}`}
        className={cn(
          "flex min-h-12 flex-wrap items-center gap-2 rounded-lg border border-dashed p-2 transition-colors",
          drag && value.includes(drag.item)
            ? drag.over === `bank:${question.id}`
              ? "border-primary bg-primary/10"
              : "border-primary/50"
            : "border-transparent",
        )}
      >
        {bank.length === 0 ? (
          <span className="px-1 text-xs text-muted-foreground">
            {t("testSessions:exam.allPlaced")}
          </span>
        ) : (
          bank.map((answer) => (
            <button
              key={answer.id}
              type="button"
              aria-pressed={selectedAnswer === answer.id}
              onClick={() => tapAnswer(answer.id)}
              {...draggable(answer.id, answer.text)}
              className={cn(
                "flex select-none items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium shadow-sm transition-all cursor-grab active:cursor-grabbing",
                selectedAnswer === answer.id
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card hover:border-primary/50 hover:bg-secondary",
                drag?.item === answer.id && "opacity-40",
              )}
            >
              <GripVertical size={14} className="opacity-50" />
              {answer.text}
            </button>
          ))
        )}
      </div>
      {ghost}
    </div>
  );
}

/** Put a list of answers in order: drag a row onto another, or use the arrows. */
export function OrderAnswers({
  question,
  value,
  onChange,
}: {
  question: ExamQuestionDto;
  value: number[];
  onChange: (value: number[]) => void;
}) {
  const { t } = useTranslation(["testSessions"]);
  const answerOf = (id: number): ExamAnswerDto | undefined =>
    question.answers.find((a) => a.id === id);

  const { drag, draggable, ghost } = usePointerDrag<number>(
    (answerId, target) => {
      if (!target?.startsWith(`pos:${question.id}:`)) return;
      const to = Number(target.split(":")[2]);
      onChange(moveItem(value, value.indexOf(answerId), to));
    },
  );

  return (
    <div>
      <div className="mb-2 text-xs text-muted-foreground">
        {t("testSessions:exam.dragOrder")}
      </div>
      <ol className="flex flex-col gap-2">
        {value.map((answerId, position) => {
          const answer = answerOf(answerId);
          if (!answer) return null;
          const over = drag?.over === `pos:${question.id}:${position}`;
          const from = drag ? value.indexOf(drag.item) : -1;

          return (
            <li
              key={answerId}
              data-drop={`pos:${question.id}:${position}`}
              className={cn(
                "relative flex items-center gap-2 rounded-lg border bg-card px-2 py-2 text-sm transition-colors",
                drag?.item === answerId ? "opacity-40" : "border-border",
                over &&
                  drag?.item !== answerId &&
                  "border-primary bg-primary/10",
                // insertion line shows where the item will land
                over &&
                  from >= 0 &&
                  (from < position
                    ? "after:absolute after:inset-x-2 after:-bottom-1.5 after:h-0.5 after:rounded after:bg-primary"
                    : "before:absolute before:inset-x-2 before:-top-1.5 before:h-0.5 before:rounded before:bg-primary"),
              )}
            >
              <span
                {...draggable(answerId, answer.text)}
                aria-hidden
                className="flex cursor-grab touch-none items-center self-stretch px-1 text-muted-foreground active:cursor-grabbing"
              >
                <GripVertical size={16} />
              </span>
              <span className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                {position + 1}
              </span>
              <span className="min-w-0 flex-1 select-none">{answer.text}</span>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={t("testSessions:exam.moveUp")}
                disabled={position === 0}
                onClick={() =>
                  onChange(moveItem(value, position, position - 1))
                }
              >
                <ArrowUp />
              </Button>
              <Button
                type="button"
                size="icon-sm"
                variant="ghost"
                aria-label={t("testSessions:exam.moveDown")}
                disabled={position === value.length - 1}
                onClick={() =>
                  onChange(moveItem(value, position, position + 1))
                }
              >
                <ArrowDown />
              </Button>
            </li>
          );
        })}
      </ol>
      {ghost}
    </div>
  );
}
