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
import { useUpdateQuestion } from "../api/update-question.api";
import { questionsQueryKeys } from "../questions.api-keys";
import { UpdateQuestionDto } from "../dtos/update-question.dto";
import type { TestDto } from "@/features/tests/dtos/test.dto";
import type { QuestionDto, QuestionType } from "../dtos/question.dto";
import { QUESTION_TYPE_TITLES } from "@/constants/question-type";
import {
  questionFormSchema,
  type QuestionFormValues,
} from "../schemas/question-form.schema";

export type EditQuestionFormModalProps = {
  isOpen: boolean;
  question: QuestionDto;
  onClose: () => void;
};

export default function EditQuestionFormModal({
  isOpen,
  question,
  onClose,
}: EditQuestionFormModalProps) {
  const queryClient = useQueryClient();

  const updateMutation = useUpdateQuestion({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: questionsQueryKeys.all });
        toast.success("Question updated");
      },
    },
  });

  const loading = updateMutation.isPending;

  const formik = useAppFormik<QuestionFormValues>({
    initialValues: {
      text: question?.text ?? "",
      type: question?.type ?? "CHOOSE",
      points: question?.points ?? 1,
      tests: [],
      completeQuestion: question?.completeQuestion?.text ?? "",
    },
    enableReinitialize: true,
    validationZodSchema: questionFormSchema,
    onSubmit: (values) =>
      updateMutation.mutate({
        id: question.id,
        data: new UpdateQuestionDto(values),
      }),
  });

  const isComplete = formik.values.type === "COMPLETE";

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit question #${question?.id ?? ""}`}
    >
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField
          type="textarea"
          name="text"
          title="Question text"
          value={formik.values.text}
          helperText={formik.touchedErrors.text}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <div className="grid grid-cols-2 gap-3">
          <LabeledField
            type="select"
            name="type"
            title="Type"
            value={formik.values.type}
            onChange={formik.handleChange}
            getInputLabel={(value) =>
              value
                ? QUESTION_TYPE_TITLES[value as QuestionType]
                : "Select type"
            }
          >
            {(Object.keys(QUESTION_TYPE_TITLES) as QuestionType[]).map(
              (type) => (
                <SelectItem key={type} value={type}>
                  {QUESTION_TYPE_TITLES[type]}
                </SelectItem>
              ),
            )}
          </LabeledField>
          <LabeledField
            type="number"
            name="points"
            title="Points"
            value={formik.values.points}
            helperText={formik.touchedErrors.points}
            onChange={formik.handleChange}
          />
        </div>
        <LabeledField<TestDto, true>
          type="selectApi"
          title="Tests"
          name="tests"
          multiple
          value={formik.values.tests}
          isItemEqualToValue={(item, value) => item.id === value.id}
          getInputLabel={(items) =>
            items?.length
              ? items.map((test) => test.name).join(", ")
              : "Select tests..."
          }
          onChange={formik.handleChange}
          queryProps={{
            queryFn: getTests,
            queryKey: testsQueryKeys.infiniteList(),
          }}
        >
          {(data) => (
            <SelectGroup>
              <SelectLabel>Tests</SelectLabel>
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
            title="Complete answer text"
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
