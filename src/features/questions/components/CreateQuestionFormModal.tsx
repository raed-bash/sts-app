import { useQueryClient } from "@tanstack/react-query";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { useAppFormik } from "@/shared/lib/formik";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/shared/components/ui/select";
import { getTests } from "@/features/tests/api/get-tests.api";
import { testsQueryKeys } from "@/features/tests/tests.api-keys";
import { useCreateQuestion } from "../api/create-question.api";
import { questionsQueryKeys } from "../questions.api-keys";
import { CreateQuestionDto } from "../dtos/create-question.dto";
import type { QuestionDto, QuestionType } from "../dtos/question.dto";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import { QUESTION_TYPE_TITLES } from "@/constants/question-type";
import {
  questionFormSchema,
  type QuestionFormValues,
} from "../schemas/question-form.schema";
import { useTranslation } from "react-i18next";

export type CreateQuestionFormModalProps = {
  isOpen: boolean;
  initialSelectedTests?: TestDto[];
  onClose: () => void;
  onSuccess?: (data: QuestionDto) => void;
};

export default function CreateQuestionFormModal({
  isOpen,
  initialSelectedTests,
  onClose,
  onSuccess,
}: CreateQuestionFormModalProps) {
  const queryClient = useQueryClient();

  const { t } = useTranslation(["common", "questions"]);

  const createMutation = useCreateQuestion({
    mutationConfig: {
      onSuccess: (data) => {
        onClose();
        queryClient.invalidateQueries({ queryKey: questionsQueryKeys.all });
        toast.success(t("questions:toasts.created"));
        onSuccess?.(data);
      },
    },
  });

  const loading = createMutation.isPending;

  const formik = useAppFormik<QuestionFormValues>({
    initialValues: {
      text: "",
      type: "CHOOSE",
      points: 1,
      tests: initialSelectedTests ?? [],
      completeQuestion: "",
    },
    validationZodSchema: () => questionFormSchema(t),
    onSubmit: (values) => createMutation.mutate(new CreateQuestionDto(values)),
  });

  const isComplete = formik.values.type === "COMPLETE";

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("questions:modal.createTitle")}
    >
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField
          type="textarea"
          name="text"
          title={t("questions:modal.questionText")}
          value={formik.values.text}
          helperText={formik.touchedErrors.text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className="grid grid-cols-2 gap-3">
          <LabeledField
            type="select"
            name="type"
            title={t("common:fields.type")}
            value={formik.values.type}
            onChange={formik.handleChange}
            getInputLabel={(value) =>
              value
                ? t(QUESTION_TYPE_TITLES[value as QuestionType])
                : t("questions:modal.selectType")
            }
          >
            {(Object.keys(QUESTION_TYPE_TITLES) as QuestionType[]).map(
              (type) => (
                <SelectItem key={type} value={type}>
                  {t(QUESTION_TYPE_TITLES[type])}
                </SelectItem>
              ),
            )}
          </LabeledField>
          <LabeledField
            type="number"
            name="points"
            title={t("common:fields.points")}
            value={formik.values.points}
            helperText={formik.touchedErrors.points}
            onChange={formik.handleChange}
          />
        </div>
        <LabeledField<TestDto, true>
          type="selectApi"
          title={t("entities.tests")}
          name="tests"
          multiple
          value={formik.values.tests}
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
        {isComplete && (
          <LabeledField
            type="textarea"
            name="completeQuestion"
            title={t("questions:modal.completeAnswerText")}
            value={formik.values.completeQuestion}
            helperText={formik.touchedErrors.completeQuestion}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          />
        )}

        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={onClose}
            disabled={loading}
          >
            {t("common:actions.cancel")}
          </Button>
          <Button type="submit" className="w-fit" disabled={loading}>
            {loading ? t("common:actions.saving") : t("common:actions.create")}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
