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
import { getQuestions } from "@/features/questions/api/get-questions.api";
import { questionsQueryKeys } from "@/features/questions/questions.api-keys";
import { useCreateAnswer } from "../api/create-answer.api";
import { answersQueryKeys } from "../answers.api-keys";
import { CreateAnswerDto } from "../dtos/create-answer.dto";
import type { QuestionDto } from "@/features/questions/dtos/question.dto";
import type { AnswerDto } from "../dtos/answer.dto";
import {
  answerFormSchema,
  type AnswerFormValues,
} from "../schemas/answer-form.schema";
import { useTranslation } from "react-i18next";

export type CreateAnswerFormModalProps = {
  isOpen: boolean;
  initialQuestion?: QuestionDto | null;
  onClose: () => void;
  onSuccess?: (data: AnswerDto) => void;
};

export default function CreateAnswerFormModal({
  isOpen,
  initialQuestion,
  onClose,
  onSuccess,
}: CreateAnswerFormModalProps) {
  const queryClient = useQueryClient();

  const { t } = useTranslation(["common", "answers"]);

  const createMutation = useCreateAnswer({
    mutationConfig: {
      onSuccess: (data) => {
        onClose();
        queryClient.invalidateQueries({ queryKey: answersQueryKeys.all });
        toast.success(t("answers:toasts.created"));
        onSuccess?.(data);
      },
    },
  });

  const loading = createMutation.isPending;

  const formik = useAppFormik<AnswerFormValues>({
    initialValues: {
      text: "",
      isCorrect: false,
      order: 1,
      correctIndex: 0,
      question: initialQuestion ?? null,
    },
    validationZodSchema: () => answerFormSchema(t),
    onSubmit: (values) =>
      createMutation.mutate(
        new CreateAnswerDto(
          values,
          initialQuestion?.id ?? values.question?.id ?? 0,
        ),
      ),
  });

  const requiresCorrectIndex = Boolean(
    formik.values.question && formik.values.question.type !== "CHOOSE",
  );

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("answers:modal.createTitle")}
    >
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField
          type="textarea"
          name="text"
          title={t("answers:modal.answerText")}
          value={formik.values.text}
          helperText={formik.touchedErrors.text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <LabeledField<QuestionDto>
          type="selectApi"
          title={t("answers:modal.question")}
          name="question"
          value={formik.values.question}
          getInputLabel={(item) =>
            item?.text || t("answers:modal.selectQuestion")
          }
          isItemEqualToValue={(item, value) => item.id === value.id}
          onChange={formik.handleChange}
          queryProps={{
            queryFn: getQuestions,
            queryKey: questionsQueryKeys.infiniteList(),
          }}
        >
          {(data) => (
            <SelectGroup>
              <SelectLabel>{t("entities.questions")}</SelectLabel>
              {data?.pages.map((page) =>
                page.data.map((question) => (
                  <SelectItem key={question.id} value={question}>
                    {question.text}
                  </SelectItem>
                )),
              )}
            </SelectGroup>
          )}
        </LabeledField>
        <div className="grid grid-cols-3 gap-3">
          <LabeledField
            type="number"
            name="order"
            title={t("common:fields.order")}
            value={formik.values.order}
            helperText={formik.touchedErrors.order}
            onChange={formik.handleChange}
          />
          {requiresCorrectIndex ? (
            <LabeledField
              type="number"
              name="correctIndex"
              title={t("answers:modal.correctIndex")}
              value={formik.values.correctIndex}
              helperText={formik.touchedErrors.correctIndex}
              onChange={formik.handleChange}
            />
          ) : (
            <LabeledField
              type="checkbox"
              name="isCorrect"
              title={t("answers:modal.isCorrect")}
              checked={formik.values.isCorrect}
              onChange={formik.handleChange}
            />
          )}
        </div>

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
