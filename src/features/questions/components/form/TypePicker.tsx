import { useTranslation } from "react-i18next";
import { CircleDot, Move, PenLine } from "lucide-react";
import { cn } from "cn";
import type { QuestionType } from "@/constants/question-type";

const TYPES = [
  {
    type: "CHOOSE",
    Icon: CircleDot,
    title: "questions:form.types.choose.title",
    description: "questions:form.types.choose.description",
  },
  {
    type: "COMPLETE",
    Icon: PenLine,
    title: "questions:form.types.complete.title",
    description: "questions:form.types.complete.description",
  },
  {
    type: "DRAG_DROP",
    Icon: Move,
    title: "questions:form.types.dragDrop.title",
    description: "questions:form.types.dragDrop.description",
  },
] as const satisfies readonly {
  type: QuestionType;
  Icon: unknown;
  title: string;
  description: string;
}[];

export default function TypePicker({
  value,
  onChange,
  disabled,
}: {
  value: QuestionType;
  onChange: (type: QuestionType) => void;
  disabled?: boolean;
}) {
  const { t } = useTranslation(["questions"]);

  return (
    <div
      role="radiogroup"
      aria-label={t("questions:form.type")}
      className="grid grid-cols-1 gap-2 sm:grid-cols-3"
    >
      {TYPES.map(({ type, Icon, title, description }) => {
        const selected = value === type;
        return (
          <button
            key={type}
            type="button"
            role="radio"
            aria-checked={selected}
            disabled={disabled && !selected}
            onClick={() => onChange(type)}
            className={cn(
              "flex flex-col gap-1 rounded-lg border p-3 text-start transition-colors disabled:cursor-not-allowed disabled:opacity-40",
              selected
                ? "border-primary bg-primary/5 ring-1 ring-primary"
                : "hover:border-primary/40 hover:bg-secondary/50",
            )}
          >
            <span className="flex items-center gap-2 text-sm font-semibold">
              <Icon
                size={16}
                className={selected ? "text-primary" : "text-muted-foreground"}
              />
              {t(title)}
            </span>
            <span className="text-xs text-muted-foreground">
              {t(description)}
            </span>
          </button>
        );
      })}
    </div>
  );
}
