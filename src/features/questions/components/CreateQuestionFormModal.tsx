import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import { useCreateQuestion } from "../api/create-question.api";
import { questionsQueryKeys } from "../questions.api-keys";
import { CreateQuestionDto } from "../dtos/create-question.dto";
import type { QuestionDto } from "../dtos/question.dto";
import QuestionForm from "./form/QuestionForm";
import { emptyQuestionValues } from "./form/choices";

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

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("questions:modal.createTitle")}
      description={t("questions:form.createDescription")}
      className="max-h-[92svh] overflow-y-auto sm:max-w-5xl"
    >
      {/* remount on open so every new question starts empty */}
      {isOpen && (
        <QuestionForm
          initialValues={emptyQuestionValues(initialSelectedTests)}
          submitting={createMutation.isPending}
          submitLabel={t("common:actions.create")}
          onSubmit={(values) =>
            createMutation.mutate(new CreateQuestionDto(values))
          }
          onCancel={onClose}
        />
      )}
    </Popup>
  );
}
