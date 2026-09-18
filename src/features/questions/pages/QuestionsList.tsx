import { useState } from "react";
import { useNavigate } from "react-router";
import { questionsPaths } from "../questions.paths";
import { Edit, ListChecks, Plus, RotateCcw, Trash } from "lucide-react";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import QuestionsTable from "../components/QuestionsTable";
import CreateQuestionFormModal from "../components/CreateQuestionFormModal";
import EditQuestionFormModal from "../components/EditQuestionFormModal";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { QueryQuestionDto } from "../dtos/query-question.dto";
import type { QuestionDto } from "../dtos/question.dto";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getQuestionsQueryOptions } from "../api/get-questions.api";
import type { QueryClient } from "@tanstack/react-query";
import { useQuestionsTable } from "../hooks/useQuestionsTable";
import { useRequireRole } from "@/hooks/useRequireRole";
import { Button } from "@/shared/components/ui/button";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { questionsQueryKeys } from "../questions.api-keys";
import { useDeleteQuestion } from "../api/delete-question.api";
import { useRestoreQuestion } from "../api/restore-question.api";

// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getQuestionsQueryOptions(new QueryQuestionDto({}));

  return (
    queryClient.getQueryData(query.queryKey) ?? (await queryClient.query(query))
  );
};

export default function QuestionsList() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { tableProps } = useQuestionsTable();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<QuestionDto | null>(null);
  const [confirm, setConfirm] = useState<QuestionDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: questionsQueryKeys.all });

  const deleteMutation = useDeleteQuestion({
    mutationConfig: {
      onSuccess: () => {
        setConfirm(null);
        refresh();
        toast.success("Question deleted");
      },
    },
  });

  const restoreMutation = useRestoreQuestion({
    mutationConfig: {
      onSuccess: () => {
        refresh();
        toast.success("Question restored");
      },
    },
  });

  if (!allowed) return null;

  const actions: TableAction<QuestionDto>[] = [
    {
      name: "answers",
      label: "Manage answers",
      icon: <ListChecks />,
      onClick: (question) => navigate(questionsPaths.questionDetailLink(question.id)),
    },
    {
      name: "edit",
      label: "Edit",
      icon: <Edit />,
      onClick: (question) => setEditing(question),
    },
    {
      name: "restore",
      label: "Restore",
      icon: <RotateCcw />,
      hidden: (question) => !question.deletedAt,
      onClick: (question) => {
        restoreMutation.mutate(question.id);
      },
    },
    {
      name: "delete",
      label: "Remove",
      icon: <Trash />,
      variant: "destructive",
      hidden: (question) => Boolean(question.deletedAt),
      onClick: (question) => {
        setConfirm(question);
        setDeletingId(question.id);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Questions</h1>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          Add Question
        </Button>
      </div>
      <Card className="pb-0">
        <CardContent>
          <QuestionsTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>

      <CreateQuestionFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(data) => navigate(questionsPaths.questionDetailLink(data.id))}
      />

      {editing && (
        <EditQuestionFormModal
          isOpen
          question={editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmPopup
        isOpen={Boolean(confirm)}
        title={`Delete question #${confirm?.id ?? ""}?`}
        message="The question will be soft-deleted. Existing sessions keep their data."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => deleteMutation.mutate(deletingId ?? 0)}
      />
    </div>
  );
}