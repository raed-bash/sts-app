import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Brackets } from "lucide-react";
import { Button } from "@/shared/components/ui/button";
import { Textarea } from "@/shared/components/ui/textarea";
import type { QuestionType } from "@/constants/question-type";
import { parseBlanks } from "../../utils/blanks";

/**
 * Write the sentence and put each answer in [brackets] — or select a word
 * and press "Make blank". The detected blanks are listed underneath.
 */
export default function BlanksBuilder({
  type,
  value,
  onChange,
  onBlur,
  error,
  disabled,
}: {
  type: QuestionType;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation(["questions"]);
  const ref = useRef<HTMLTextAreaElement>(null);
  const { blanks } = parseBlanks(value);

  const makeBlank = () => {
    const el = ref.current;
    if (!el) return;
    const { selectionStart: start, selectionEnd: end } = el;
    const selected = value.slice(start, end);
    // trailing spaces from double-click selection stay outside the blank
    const word = selected.trimEnd();
    const rest = selected.slice(word.length);
    const next = `${value.slice(0, start)}[${word}]${rest}${value.slice(end)}`;
    onChange(next);
    requestAnimationFrame(() => {
      el.focus();
      // no selection: put the caret inside the new empty blank
      const caret = word ? start + word.length + 2 + rest.length : start + 1;
      el.setSelectionRange(caret, caret);
    });
  };

  return (
    <div className="flex flex-col gap-2">
      <div className="flex flex-wrap items-end justify-between gap-2">
        <label htmlFor="question-sentence" className="text-sm font-medium">
          {t("questions:form.sentence")}
        </label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          className="gap-1.5"
          onMouseDown={(event) => event.preventDefault()} // keep the selection
          onClick={makeBlank}
          disabled={disabled}
        >
          <Brackets size={14} />
          {t("questions:form.makeBlank")}
        </Button>
      </div>
      <Textarea
        id="question-sentence"
        ref={ref}
        rows={3}
        value={value}
        disabled={disabled}
        aria-invalid={error ? true : undefined}
        placeholder={t(
          type === "DRAG_DROP"
            ? "questions:form.sentencePlaceholderOrder"
            : "questions:form.sentencePlaceholder",
        )}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        className="font-mono text-sm"
      />
      <p className="text-xs text-muted-foreground">
        {t(
          type === "DRAG_DROP"
            ? "questions:form.sentenceHintOrder"
            : "questions:form.sentenceHint",
        )}
      </p>
      {blanks.length > 0 && (
        <ol className="flex flex-wrap gap-1.5">
          {blanks.map((blank, i) => (
            <li
              key={i}
              className="flex items-center gap-1.5 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary"
            >
              <span className="flex size-4 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">
                {i + 1}
              </span>
              {blank}
            </li>
          ))}
        </ol>
      )}
      {error && <p className="text-sm text-destructive">{error}</p>}
    </div>
  );
}
