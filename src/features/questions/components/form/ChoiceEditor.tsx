import { useRef } from "react";
import { useTranslation } from "react-i18next";
import { Check, Plus, Trash2 } from "lucide-react";
import { cn } from "cn";
import { Button } from "@/shared/components/ui/button";
import { Input } from "@/shared/components/ui/input";
import { newChoice, type Choice } from "./choices";

/** Options of a multiple-choice question: type them, tick the right one. */
export default function ChoiceEditor({
  value,
  onChange,
  error,
  disabled,
}: {
  value: Choice[];
  onChange: (value: Choice[]) => void;
  error?: string;
  disabled?: boolean;
}) {
  const { t } = useTranslation(["questions"]);
  const inputs = useRef<Record<string, HTMLInputElement | null>>({});

  const update = (key: string, patch: Partial<Choice>) =>
    onChange(value.map((c) => (c.key === key ? { ...c, ...patch } : c)));

  const markCorrect = (key: string) =>
    onChange(value.map((c) => ({ ...c, isCorrect: c.key === key })));

  const add = () => {
    const choice = newChoice();
    onChange([...value, choice]);
    // focus the new option once it renders
    setTimeout(() => inputs.current[choice.key]?.focus(), 0);
  };

  return (
    <fieldset className="flex flex-col gap-2" disabled={disabled}>
      <legend className="mb-1 text-sm font-medium">
        {t("questions:form.options")}
      </legend>
      <p className="text-xs text-muted-foreground">
        {t("questions:form.optionsHint")}
      </p>
      {value.map((choice, index) => (
        <div key={choice.key} className="flex items-center gap-2">
          <button
            type="button"
            role="radio"
            aria-checked={choice.isCorrect}
            aria-label={t("questions:form.markCorrect", { n: index + 1 })}
            onClick={() => markCorrect(choice.key)}
            className={cn(
              "flex size-8 shrink-0 items-center justify-center rounded-full border-2 transition-colors",
              choice.isCorrect
                ? "border-success bg-success text-white"
                : "border-muted-foreground/30 text-transparent hover:border-success/60 hover:text-success/60",
            )}
          >
            <Check size={16} />
          </button>
          <Input
            ref={(node) => {
              inputs.current[choice.key] = node;
            }}
            value={choice.text}
            placeholder={t("questions:form.optionPlaceholder", {
              letter: String.fromCharCode(65 + index),
            })}
            aria-label={t("questions:form.optionLabel", { n: index + 1 })}
            onChange={(event) =>
              update(choice.key, { text: event.target.value })
            }
            onKeyDown={(event) => {
              // Enter on the last option adds the next one
              if (event.key === "Enter") {
                event.preventDefault();
                if (index === value.length - 1) add();
                else inputs.current[value[index + 1].key]?.focus();
              }
            }}
            className={cn(choice.isCorrect && "border-success/50")}
          />
          <Button
            type="button"
            size="icon-sm"
            variant="ghost"
            aria-label={t("questions:form.removeOption", { n: index + 1 })}
            disabled={value.length <= 2}
            onClick={() => onChange(value.filter((c) => c.key !== choice.key))}
          >
            <Trash2 />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-fit gap-1.5"
        onClick={add}
        disabled={value.length >= 8}
      >
        <Plus size={14} />
        {t("questions:form.addOption")}
      </Button>
      {error && <p className="text-sm text-destructive">{error}</p>}
    </fieldset>
  );
}
