import { useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import Loading from "@/shared/components/custom/loading/Loading";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import { useUpdateQuestion } from "../api/update-question.api";
import { useQuestion } from "../api/get-question.api";
import { questionsQueryKeys } from "../questions.api-keys";
import { UpdateQuestionDto } from "../dtos/update-question.dto";
import type { QuestionDto } from "../dtos/question.dto";
import type { QuestionFormValues } from "../schemas/question-form.schema";
import { fromStored } from "../utils/blanks";
import QuestionForm from "./form/QuestionForm";
import { newChoice } from "./form/choices";

export type EditQuestionFormModalProps = {
  isOpen: boolean;
  question: QuestionDto;
  onClose: () => void;
};

function toFormValues(question: QuestionDto): QuestionFormValues {
  const answers = question.answers ?? [];
  const choices =
    question.type === "CHOOSE"
      ? [...answers]
          .sort((a, b) => a.order - b.order)
          .map((a) => newChoice(a.text, a.isCorrect))
      : [];

  return {
    text: question.text,
    type: question.type,
    points: question.points,
    tests: (question.tests ?? []) as TestDto[],
    sentence: question.completeQuestion
      ? fromStored(question.completeQuestion.text, answers)
      : "",
    // a type switch to CHOOSE starts with two empty options
    choices: choices.length >= 2 ? choices : [newChoice("", true), newChoice()],
  };
}

export default function EditQuestionFormModal({
  isOpen,
  question,
  onClose,
}: EditQuestionFormModalProps) {
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common", "questions"]);

  // the list row lacks tests/answeredCount: load the full question
  const detail = useQuestion({ id: question.id });
  const full = detail.data;
  const locked = (full?.answeredCount ?? 0) > 0;

  const updateMutation = useUpdateQuestion({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: questionsQueryKeys.all });
        toast.success(t("questions:toasts.updated"));
      },
    },
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("questions:modal.editTitle", { id: question.id })}
      className="max-h-[92svh] overflow-y-auto sm:max-w-5xl"
    >
      {!full ? (
        <div className="flex justify-center py-16">
          <Loading />
        </div>
      ) : (
        <QuestionForm
          initialValues={toFormValues(full)}
          lockContent={locked}
          submitting={updateMutation.isPending}
          submitLabel={t("common:actions.save")}
          onSubmit={(values) =>
            updateMutation.mutate({
              id: question.id,
              data: new UpdateQuestionDto(values, locked),
            })
          }
          onCancel={onClose}
        />
      )}
    </Popup>
  );
}
