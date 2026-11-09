import { useId } from "react";
import { useTranslation } from "react-i18next";
import { cn } from "cn";
import { Input } from "@/shared/components/ui/input";

const PRESETS = [15, 30, 45, 60, 90];

/** Test duration in minutes, with one-click common values. */
export default function DurationField({
  value,
  onChange,
  error,
}: {
  value: number;
  onChange: (minutes: number) => void;
  error?: string;
}) {
  const { t } = useTranslation(["common", "tests"]);
  const id = useId();

  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className="text-base font-medium">
        {t("common:fields.duration")}
      </label>
      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-28">
          <Input
            id={id}
            type="number"
            min={1}
            value={Number.isFinite(value) ? value : ""}
            aria-invalid={error ? true : undefined}
            aria-describedby={error ? `${id}-error` : undefined}
            onChange={(event) => onChange(event.target.valueAsNumber)}
            className="pe-10"
          />
          <span className="pointer-events-none absolute end-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
            {t("tests:modal.min")}
          </span>
        </div>
        {PRESETS.map((minutes) => (
          <button
            key={minutes}
            type="button"
            aria-pressed={value === minutes}
            onClick={() => onChange(minutes)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
              value === minutes
                ? "border-primary bg-primary text-primary-foreground"
                : "hover:bg-secondary",
            )}
          >
            {minutes}
          </button>
        ))}
      </div>
      {error && (
        <p id={`${id}-error`} className="text-sm text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
