import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { testsPaths } from "../tests.paths";
import { questionsPaths } from "@/features/questions/questions.paths";
import {
  ArrowLeft,
  Edit,
  ListChecks,
  Plus,
  RotateCcw,
  Trash,
} from "lucide-react";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import EditTestFormModal from "../components/EditTestFormModal";
import CreateQuestionFormModal from "@/features/questions/components/CreateQuestionFormModal";
import EditQuestionFormModal from "@/features/questions/components/EditQuestionFormModal";
import QuestionsTable from "@/features/questions/components/QuestionsTable";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useTest } from "../api/get-test.api";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/shared/components/ui/select";
import { useQuestionsTable } from "@/features/questions/hooks/useQuestionsTable";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useQueryClient } from "@tanstack/react-query";
import InputPlus from "@/shared/components/custom/inputs/InputPlus";
import { useTestSubjects } from "../hooks/useTestSubjects";
import { useDeleteQuestion } from "@/features/questions/api/delete-question.api";
import { useRestoreQuestion } from "@/features/questions/api/restore-question.api";
import { useDeleteTest } from "../api/delete-test.api";
import { questionsQueryKeys } from "@/features/questions/questions.api-keys";
import { testsQueryKeys } from "../tests.api-keys";
import toast from "react-hot-toast";
import Loading from "@/shared/components/custom/loading/Loading";
import { Button } from "@/shared/components/ui/button";
import type { QuestionDto } from "@/features/questions/dtos/question.dto";
import type { TestDto } from "../dtos/test.dto";
import { dateFormater } from "@/shared/utils";

export default function TestDetail() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const testId = Number(id);

  const queryClient = useQueryClient();

  const { data: test, isLoading } = useTest({
    id: testId,
    queryConfig: { enabled: Number.isFinite(testId) },
  });

  const { subjects, loadSubjects, subjectsQueryKey } = useTestSubjects(testId);

  const { tableProps } = useQuestionsTable({ testIds: [testId] });

  const [editingTest, setEditingTest] = useState<TestDto | null>(null);
  const [confirmTest, setConfirmTest] = useState<TestDto | null>(null);

  const [createQuestionOpen, setCreateQuestionOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState<QuestionDto | null>(
    null,
  );
  const [confirmQuestion, setConfirmQuestion] = useState<QuestionDto | null>(
    null,
  );

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: questionsQueryKeys.all });
  };

  const deleteTestMutation = useDeleteTest({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Test deleted");
        navigate(`/${testsPaths.list}`);
      },
    },
  });

  const deleteQuestionMutation = useDeleteQuestion({
    mutationConfig: {
      onSuccess: () => {
        setConfirmQuestion(null);
        refresh();
        toast.success("Question deleted");
      },
    },
  });

  const restoreQuestionMutation = useRestoreQuestion({
    mutationConfig: {
      onSuccess: () => {
        refresh();
        toast.success("Question restored");
      },
    },
  });

  if (!allowed) return null;

  if (isLoading || !test) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  const questionActions: TableAction<QuestionDto>[] = [
    {
      name: "answers",
      label: "Answers",
      icon: <ListChecks size={16} />,
      onClick: (question) =>
        navigate(questionsPaths.questionDetailLink(question.id)),
    },
    {
      name: "edit",
      label: "Edit",
      icon: <Edit size={16} />,
      onClick: (question) => setEditingQuestion(question),
    },
    {
      name: "restore",
      label: "Restore",
      icon: <RotateCcw size={16} />,
      hidden: (question) => !question.deletedAt,
      onClick: (question) => {
        restoreQuestionMutation.mutate(question.id);
      },
    },
    {
      name: "delete",
      label: "Remove",
      icon: <Trash size={16} />,
      variant: "destructive",
      hidden: (question) => Boolean(question.deletedAt),
      onClick: (question) => setConfirmQuestion(question),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="w-fit gap-2"
          onClick={() => navigate(`/${testsPaths.list}`)}
        >
          <ArrowLeft size={16} />
          Back to tests
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="w-fit gap-2"
            onClick={() => setEditingTest(test)}
          >
            <Edit size={16} />
            Edit test
          </Button>
          <Button
            variant="destructive"
            className="w-fit gap-2"
            onClick={() => setConfirmTest(test)}
          >
            <Trash size={16} />
            Delete
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold">{test.name}</h1>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-(--secondary)/10">
              <div className="text-xs text-(--text-muted) uppercase">
                Duration
              </div>
              <div className="text-lg font-semibold">{test.period} min</div>
            </div>
            <div className="p-4 rounded-lg bg-(--secondary)/10">
              <div className="text-xs text-(--text-muted) uppercase">
                Created
              </div>
              <div className="text-lg font-semibold">
                {dateFormater(test.createdAt)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-(--secondary)/10">
              <div className="text-xs text-(--text-muted) uppercase">
                Subjects
              </div>
              <div className="mt-1">
                <InputPlus
                  type="selectApi"
                  getInputLabel={() =>
                    subjects.length
                      ? `${subjects.length} assigned`
                      : "Not assigned"
                  }
                  queryProps={{
                    queryFn: loadSubjects,
                    queryKey: subjectsQueryKey,
                  }}
                >
                  {(data) => (
                    <SelectGroup>
                      <SelectLabel>Subjects</SelectLabel>
                      {data?.pages.map((page) =>
                        page.data.map((subject) => (
                          <SelectItem key={subject.id} value={subject}>
                            {subject.name}
                          </SelectItem>
                        )),
                      )}
                    </SelectGroup>
                  )}
                </InputPlus>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Questions</h2>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateQuestionOpen(true)}
        >
          <Plus size={16} />
          Add Question
        </Button>
      </div>
      <Card className="pb-52">
        <CardContent>
          <QuestionsTable {...tableProps} actions={questionActions} />
        </CardContent>
      </Card>

      {editingTest && (
        <EditTestFormModal
          isOpen
          test={editingTest}
          onClose={() => setEditingTest(null)}
        />
      )}

      <CreateQuestionFormModal
        isOpen={createQuestionOpen}
        initialSelectedTests={[test]}
        onClose={() => setCreateQuestionOpen(false)}
        onSuccess={(data) =>
          navigate(questionsPaths.questionDetailLink(data.id))
        }
      />

      {editingQuestion && (
        <EditQuestionFormModal
          isOpen
          question={editingQuestion}
          onClose={() => setEditingQuestion(null)}
        />
      )}

      <ConfirmPopup
        isOpen={Boolean(confirmQuestion)}
        title={`Delete question #${confirmQuestion?.id ?? ""}?`}
        message="The question will be soft-deleted. Its answers stay in the database."
        confirmLabel="Delete"
        destructive
        loading={deleteQuestionMutation.isPending}
        onCancel={() => setConfirmQuestion(null)}
        onConfirm={() =>
          confirmQuestion && deleteQuestionMutation.mutate(confirmQuestion.id)
        }
      />

      <ConfirmPopup
        isOpen={Boolean(confirmTest)}
        title={`Delete ${confirmTest?.name ?? ""}?`}
        message="The test will be soft-deleted. Its questions stay in the database."
        confirmLabel="Delete"
        destructive
        loading={deleteTestMutation.isPending}
        onCancel={() => setConfirmTest(null)}
        onConfirm={() =>
          confirmTest && deleteTestMutation.mutate(confirmTest.id)
        }
      />
    </div>
  );
}
