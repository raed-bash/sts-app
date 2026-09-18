import { useState } from "react";
import { Edit, Plus, Trash } from "lucide-react";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import AnswersTable from "../components/AnswersTable";
import CreateAnswerFormModal from "../components/CreateAnswerFormModal";
import EditAnswerFormModal from "../components/EditAnswerFormModal";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { QueryAnswerDto } from "../dtos/query-answer.dto";
import type { AnswerDto } from "../dtos/answer.dto";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getAnswersQueryOptions } from "../api/get-answers.api";
import type { QueryClient } from "@tanstack/react-query";
import { useAnswersTable } from "../hooks/useAnswersTable";
import { useRequireRole } from "@/hooks/useRequireRole";
import { Button } from "@/shared/components/ui/button";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { answersQueryKeys } from "../answers.api-keys";
import { useDeleteAnswer } from "../api/delete-answer.api";

// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getAnswersQueryOptions(new QueryAnswerDto({}));

  return (
    queryClient.getQueryData(query.queryKey) ?? (await queryClient.query(query))
  );
};

export default function AnswersList() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const queryClient = useQueryClient();
  const { tableProps } = useAnswersTable();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<AnswerDto | null>(null);
  const [confirm, setConfirm] = useState<AnswerDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: answersQueryKeys.all });

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

  const actions: TableAction<AnswerDto>[] = [
    {
      name: "edit",
      label: "Edit",
      icon: <Edit />,
      onClick: (answer) => setEditing(answer),
    },
    {
      name: "delete",
      label: "Remove",
      icon: <Trash />,
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
        <h1 className="text-3xl font-bold">Answers</h1>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          Add Answer
        </Button>
      </div>
      <Card className="pb-0">
        <CardContent>
          <AnswersTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>

      <CreateAnswerFormModal
        isOpen={createOpen}
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