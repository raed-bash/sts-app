import { useState } from "react";
import { useNavigate } from "react-router";
import { subjectsPaths } from "../subjects.paths";
import { Edit, FolderOpen, Plus, RotateCcw, Trash } from "lucide-react";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import SubjectsTable from "../components/SubjectsTable";
import CreateSubjectFormModal from "../components/CreateSubjectFormModal";
import EditSubjectFormModal from "../components/EditSubjectFormModal";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { QuerySubjectDto } from "../dtos/query-subject.dto";
import type { SubjectDto } from "../dtos/subject.dto";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getSubjectsQueryOptions } from "../api/get-subjects.api";
import type { QueryClient } from "@tanstack/react-query";
import { useSubjectsTable } from "../hooks/useSubjectsTable";
import { useRequireRole } from "@/hooks/useRequireRole";
import { Button } from "@/shared/components/ui/button";
import toast from "@/shared/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { subjectsQueryKeys } from "../subjects.api-keys";
import { useDeleteSubject } from "../api/delete-subject.api";
import { useRestoreSubject } from "../api/restore-subject.api";

// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getSubjectsQueryOptions(new QuerySubjectDto({}));

  return (
    queryClient.getQueryData(query.queryKey) ?? (await queryClient.query(query))
  );
};

export default function SubjectsList() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { tableProps } = useSubjectsTable();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<SubjectDto | null>(null);
  const [confirm, setConfirm] = useState<SubjectDto | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: subjectsQueryKeys.all });

  const deleteMutation = useDeleteSubject();
  const restoreMutation = useRestoreSubject();

  if (!allowed) return null;

  const actions: TableAction<SubjectDto>[] = [
    {
      name: "view",
      label: "Open subject",
      icon: <FolderOpen />,
      onClick: (subject) => navigate(subjectsPaths.subjectDetailLink(subject.id)),
    },
    {
      name: "edit",
      label: "Edit",
      icon: <Edit />,
      onClick: (subject) => setEditing(subject),
    },
    {
      name: "restore",
      label: "Restore",
      icon: <RotateCcw />,
      hidden: (subject) => !subject.deletedAt,
      onClick: (subject) => {
        restoreMutation.mutate(subject.id, { onSuccess: refresh });
        toast.success("Subject restored");
      },
    },
    {
      name: "delete",
      label: "Remove",
      icon: <Trash />,
      variant: "destructive",
      hidden: (subject) => Boolean(subject.deletedAt),
      onClick: (subject) => setConfirm(subject),
    },
  ];

  const handleConfirmDelete = () => {
    if (!confirm) return;
    deleteMutation.mutate(confirm.id, {
      onSuccess: () => {
        setConfirm(null);
        refresh();
        toast.success("Subject deleted");
      },
    });
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Subjects</h1>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          Add Subject
        </Button>
      </div>
      <Card className="pb-0">
        <CardContent>
          <SubjectsTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>

      <CreateSubjectFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(data) => navigate(subjectsPaths.subjectDetailLink(data.id))}
      />

      {editing && (
        <EditSubjectFormModal
          isOpen
          subject={editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmPopup
        isOpen={Boolean(confirm)}
        title={`Delete ${confirm?.name ?? ""}?`}
        message="The subject will be soft-deleted. Content stays in the database."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}