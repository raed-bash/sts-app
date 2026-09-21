import { useQueryClient } from "@tanstack/react-query";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { useAppFormik } from "@/shared/lib/formik";
import { useUpdateAnswer } from "../api/update-answer.api";
import { answersQueryKeys } from "../answers.api-keys";
import { UpdateAnswerDto } from "../dtos/update-answer.dto";
import type { AnswerDto } from "../dtos/answer.dto";
import {
  answerFormSchema,
  type AnswerFormValues,
} from "../schemas/answer-form.schema";
import { useTranslation } from "react-i18next";

export type EditAnswerFormModalProps = {
  isOpen: boolean;
  answer: AnswerDto;
  onClose: () => void;
};

export default function EditAnswerFormModal({
  isOpen,
  answer,
  onClose,
}: EditAnswerFormModalProps) {
  const queryClient = useQueryClient();

  const { t } = useTranslation(["common", "answers"]);

  const updateMutation = useUpdateAnswer({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: answersQueryKeys.all });
        toast.success(t("answers:toasts.updated"));
      },
    },
  });

  const loading = updateMutation.isPending;

  const formik = useAppFormik<AnswerFormValues>({
    initialValues: {
      text: answer?.text ?? "",
      isCorrect: answer?.isCorrect ?? false,
      order: answer?.order ?? 1,
      correctIndex: answer?.correctIndex ?? 0,
      question: null,
    },
    enableReinitialize: true,
    validationZodSchema: () => answerFormSchema(t),
    onSubmit: (values) =>
      updateMutation.mutate({
        id: answer.id,
        data: new UpdateAnswerDto(values),
      }),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("answers:modal.editTitle", { id: answer?.id ?? "" })}
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
        <div className="grid grid-cols-3 gap-3">
          <LabeledField
            type="number"
            name="order"
            title={t("common:fields.order")}
            value={formik.values.order}
            helperText={formik.touchedErrors.order}
            onChange={formik.handleChange}
          />
          <LabeledField
            type="checkbox"
            name="isCorrect"
            title={t("answers:modal.isCorrect")}
            checked={formik.values.isCorrect}
            onChange={formik.handleChange}
          />
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
            {loading ? t("common:actions.saving") : t("common:actions.save")}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
