import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import InputPlus from "@/shared/components/custom/inputs/InputPlus";
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

  const createMutation = useCreateAnswer({
    mutationConfig: {
      onSuccess: (data) => {
        onClose();
        queryClient.invalidateQueries({ queryKey: answersQueryKeys.all });
        toast.success("Answer created");
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
    validationZodSchema: answerFormSchema,
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
    <Popup isOpen={isOpen} onClose={onClose} title="Create answer">
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
        <InputPlus<QuestionDto>
          type="selectApi"
          title="Question"
          name="question"
          value={formik.values.question}
          getInputLabel={(item) => item?.text || "Select question..."}
          isItemEqualToValue={(item, value) => item.id === value.id}
          onChange={formik.handleChange}
          queryProps={{
            queryFn: getQuestions,
            queryKey: questionsQueryKeys.infiniteList(),
          }}
        >
          {(data) => (
            <SelectGroup>
              <SelectLabel>Questions</SelectLabel>
              {data?.pages.map((page) =>
                page.data.map((question) => (
                  <SelectItem key={question.id} value={question}>
                    {question.text}
                  </SelectItem>
                )),
              )}
            </SelectGroup>
          )}
        </InputPlus>
        <div className="grid grid-cols-3 gap-3">
          <InputPlus
            type="number"
            name="order"
            title="Order"
            value={formik.values.order}
            helperText={formik.touchedErrors.order}
            onChange={formik.handleChange}
          />
          {requiresCorrectIndex ? (
            <InputPlus
              type="number"
              name="correctIndex"
              title="Correct index"
              value={formik.values.correctIndex}
              helperText={formik.touchedErrors.correctIndex}
              onChange={formik.handleChange}
            />
          ) : (
            <InputPlus
              type="checkbox"
              name="isCorrect"
              title="Is correct"
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
            Cancel
          </Button>
          <Button type="submit" className="w-fit" disabled={loading}>
            {loading ? "Saving..." : "Create"}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
