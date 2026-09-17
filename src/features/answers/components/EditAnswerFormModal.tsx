import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import InputPlus from "@/shared/components/custom/inputs/InputPlus";
import { useAppFormik } from "@/shared/lib/formik";
import { useUpdateAnswer } from "../api/update-answer.api";
import { answersQueryKeys } from "../answers.api-keys";
import { UpdateAnswerDto } from "../dtos/update-answer.dto";
import type { AnswerDto } from "../dtos/answer.dto";
import { answerFormSchema, type AnswerFormValues } from "../schemas/answer-form.schema";

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

  const updateMutation = useUpdateAnswer({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: answersQueryKeys.all });
        toast.success("Answer updated");
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
    validationZodSchema: answerFormSchema,
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
      title={`Edit answer #${answer?.id ?? ""}`}
    >
      <form
        className="flex flex-col gap-3 w-full sm:w-[440px]"
        onSubmit={formik.handleSubmit}
      >
        <InputPlus
          type="textarea"
          name="text"
          title="Answer text"
          value={formik.values.text}
          helperText={formik.touchedErrors.text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className="grid grid-cols-3 gap-3">
          <InputPlus
            type="number"
            name="order"
            title="Order"
            value={formik.values.order}
            helperText={formik.touchedErrors.order}
            onChange={formik.handleChange}
          />
          <InputPlus
            type="checkbox"
            name="isCorrect"
            title="Is correct"
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
            Cancel
          </Button>
          <Button type="submit" className="w-fit" disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </div>
      </form>
    </Popup>
  );
}