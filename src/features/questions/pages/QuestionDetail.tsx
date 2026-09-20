import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { questionsPaths } from "../questions.paths";
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import CreateAnswerFormModal from "@/features/answers/components/CreateAnswerFormModal";
import EditAnswerFormModal from "@/features/answers/components/EditAnswerFormModal";
import AnswersTable from "@/features/answers/components/AnswersTable";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useQuestion } from "../api/get-question.api";
import { useAnswersTable } from "@/features/answers/hooks/useAnswersTable";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteAnswer } from "@/features/answers/api/delete-answer.api";
import { questionsQueryKeys } from "../questions.api-keys";
import { answersQueryKeys } from "@/features/answers/answers.api-keys";
import toast from "@/shared/lib/toast";
import Loading from "@/shared/components/custom/loading/Loading";
import { Button } from "@/shared/components/ui/button";
import QuestionTypeBadge from "@/components/QuestionTypeBadge";
import { dateFormatter } from "@/shared/utils";
import type { AnswerDto } from "@/features/answers/dtos/answer.dto";

export default function QuestionDetail() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = Number(id);

  const queryClient = useQueryClient();

  const { data: question, isLoading } = useQuestion({
    id: questionId,
    queryConfig: { enabled: Number.isFinite(questionId) },
  });

  const { tableProps } = useAnswersTable({ questionId });

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AnswerDto | null>(null);
  const [confirm, setConfirm] = useState<AnswerDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: questionsQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: answersQueryKeys.all });
  };

  const deleteMutation = useDeleteAnswer({
    mutationConfig: {
      onSuccess: () => {
        setConfirm(null);
        refresh();
        toast.success("Answer deleted");
      },
    },
  });

  if (!allowed) return null;

  if (isLoading || !question) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  const actions: TableAction<AnswerDto>[] = [
    {
      name: "edit",
      label: "Edit",
      icon: <Edit size={16} />,
      onClick: (answer) => setEditing(answer),
    },
    {
      name: "delete",
      label: "Remove",
      icon: <Trash size={16} />,
      variant: "destructive",
      onClick: (answer) => {
        setConfirm(answer);
        setDeletingId(answer.id);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="w-fit gap-2"
          onClick={() => navigate(`/${questionsPaths.list}`)}
        >
          <ArrowLeft size={16} />
          Back to questions
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">{question.text}</h1>
            <QuestionTypeBadge type={question.type} />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-(--secondary)/10">
              <div className="text-xs text-(--text-muted) uppercase">Type</div>
              <div className="text-lg font-semibold">{question.type}</div>
            </div>
            <div className="p-4 rounded-lg bg-(--secondary)/10">
              <div className="text-xs text-(--text-muted) uppercase">
                Points
              </div>
              <div className="text-lg font-semibold">{question.points}</div>
            </div>
            <div className="p-4 rounded-lg bg-(--secondary)/10">
              <div className="text-xs text-(--text-muted) uppercase">
                Created
              </div>
              <div className="text-lg font-semibold">
                {dateFormatter(question.createdAt)}
              </div>
            </div>
          </div>
          {question.completeQuestion && (
            <div className="mt-4 p-4 rounded-lg bg-(--info)/10">
              <div className="text-xs text-(--text-muted) uppercase">
                Complete answer
              </div>
              <div className="text-lg font-semibold">
                {question.completeQuestion.text}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Answers</h2>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          Add Answer
        </Button>
      </div>
      <Card className="pb-52">
        <CardContent>
          <AnswersTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>

      <CreateAnswerFormModal
        isOpen={createOpen}
        initialQuestion={question}
        onClose={() => setCreateOpen(false)}
      />

      {editing && (
        <EditAnswerFormModal
          isOpen
          answer={editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmPopup
        isOpen={Boolean(confirm)}
        title={`Delete answer #${confirm?.id ?? ""}?`}
        message="This answer will be removed from its question."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => deleteMutation.mutate(deletingId ?? 0)}
      />
    </div>
  );
}
