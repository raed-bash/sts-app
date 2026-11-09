import { useTranslation } from "react-i18next";
import { Lock } from "lucide-react";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { Button } from "@/shared/components/ui/button";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/shared/components/ui/select";
import { useAppFormik } from "@/shared/lib/formik";
import { getTests } from "@/features/tests/api/get-tests.api";
import { testsQueryKeys } from "@/features/tests/tests.api-keys";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import type { QuestionType } from "@/constants/question-type";
import {
  questionFormSchema,
  type QuestionFormValues,
} from "../../schemas/question-form.schema";
import { parseBlanks } from "../../utils/blanks";
import TypePicker from "./TypePicker";
import ChoiceEditor from "./ChoiceEditor";
import BlanksBuilder from "./BlanksBuilder";
import QuestionPreview from "./QuestionPreview";

/**
 * Create/edit form for every question type with a live student preview.
 * `lockContent`: students answered it already — only text, points, tests editable.
 */
export default function QuestionForm({
  initialValues,
  lockContent = false,
  submitting,
  submitLabel,
  onSubmit,
  onCancel,
}: {
  initialValues: QuestionFormValues;
  lockContent?: boolean;
  submitting?: boolean;
  submitLabel: string;
  onSubmit: (values: QuestionFormValues) => void;
  onCancel: () => void;
}) {
  const { t } = useTranslation(["common", "questions"]);

  const formik = useAppFormik<QuestionFormValues>({
    initialValues,
    validationZodSchema: () => questionFormSchema(t),
    onSubmit,
  });
  const { values } = formik;
  const isChoice = values.type === "CHOOSE";
  const parsed = parseBlanks(values.sentence);

  const changeType = (type: QuestionType) => {
    formik.setFieldValue("type", type);
    // keep what was typed: options <-> sentence are separate fields
    formik.setFieldTouched("choices", false);
    formik.setFieldTouched("sentence", false);
  };

  return (
    <form
      onSubmit={formik.handleSubmit}
      className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,22rem)]"
    >
      <div className="flex flex-col gap-4">
        {lockContent && (
          <div className="flex items-start gap-2 rounded-lg border border-warning/50 bg-warning/10 p-3 text-sm">
            <Lock size={16} className="mt-0.5 shrink-0" />
            {t("questions:form.locked")}
          </div>
        )}

        <TypePicker
          value={values.type}
          onChange={changeType}
          disabled={lockContent}
        />

        <LabeledField
          type="textarea"
          id="question-text"
          name="text"
          title={t("questions:modal.questionText")}
          placeholder={t("questions:form.textPlaceholder")}
          value={values.text}
          helperText={formik.touchedErrors.text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />

        {isChoice ? (
          <ChoiceEditor
            value={values.choices}
            disabled={lockContent}
            onChange={(choices) => {
              formik.setFieldValue("choices", choices);
              formik.setFieldTouched("choices", true, false);
            }}
            error={formik.touchedErrors.choices as string | undefined}
          />
        ) : (
          <BlanksBuilder
            type={values.type}
            value={values.sentence}
            disabled={lockContent}
            onChange={(sentence) => formik.setFieldValue("sentence", sentence)}
            onBlur={() => formik.setFieldTouched("sentence", true)}
            error={formik.touchedErrors.sentence}
          />
        )}

        <div className="grid gap-3 sm:grid-cols-[8rem_minmax(0,1fr)]">
          <LabeledField
            type="number"
            id="question-points"
            name="points"
            min={0.5}
            step={0.5}
            title={t("common:fields.points")}
            value={values.points}
            helperText={formik.touchedErrors.points}
            onChange={formik.handleChange}
          />
          <LabeledField<TestDto, true>
            type="selectApi"
            title={t("entities.tests")}
            name="tests"
            multiple
            value={values.tests}
            isItemEqualToValue={(item, value) => item.id === value.id}
            getInputLabel={(items) =>
              items?.length
                ? items.map((test) => test.name).join(", ")
                : t("questions:modal.selectTests")
            }
            onChange={formik.handleChange}
            queryProps={{
              queryFn: getTests,
              queryKey: testsQueryKeys.infiniteList(),
            }}
          >
            {(data) => (
              <SelectGroup>
                <SelectLabel>{t("entities.tests")}</SelectLabel>
                {data?.pages.map((page) =>
                  page.data.map((test) => (
                    <SelectItem key={test.id} value={test}>
                      {test.name}
                    </SelectItem>
                  )),
                )}
              </SelectGroup>
            )}
          </LabeledField>
        </div>
      </div>

      <aside className="flex flex-col gap-3 lg:sticky lg:top-0 lg:self-start">
        <div className="text-sm font-medium">
          {t("questions:form.previewTitle")}
        </div>
        <QuestionPreview
          type={values.type}
          text={values.text}
          points={values.points}
          choices={values.choices}
          segments={parsed.segments}
          blanks={parsed.error ? [] : parsed.blanks}
        />
        <div className="text-sm font-medium">
          {t("questions:form.answerKeyTitle")}
        </div>
        <QuestionPreview
          type={values.type}
          text={values.text}
          choices={values.choices}
          segments={parsed.segments}
          blanks={parsed.error ? [] : parsed.blanks}
          showAnswers
        />
      </aside>

      <div className="flex justify-end gap-3 lg:col-span-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={submitting}
        >
          {t("common:actions.cancel")}
        </Button>
        <Button type="submit" disabled={submitting}>
          {submitting ? t("common:actions.saving") : submitLabel}
        </Button>
      </div>
    </form>
  );
}
