import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { subjectsPaths } from "../subjects.paths";
import { testsPaths } from "@/features/tests/tests.paths";
import {
  ArrowLeft,
  Edit,
  ListChecks,
  Plus,
  RotateCcw,
  Trash,
} from "lucide-react";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import CreateTestFormModal from "@/features/tests/components/CreateTestFormModal";
import EditTestFormModal from "@/features/tests/components/EditTestFormModal";
import TestsTable from "@/features/tests/components/TestsTable";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useSubject } from "../api/get-subject.api";
import { useTestsTable } from "@/features/tests/hooks/useTestsTable";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteTest } from "@/features/tests/api/delete-test.api";
import { useRestoreTest } from "@/features/tests/api/restore-test.api";
import { subjectsQueryKeys } from "../subjects.api-keys";
import { testsQueryKeys } from "@/features/tests/tests.api-keys";
import toast from "react-hot-toast";
import Loading from "@/shared/components/custom/loading/Loading";
import { Button } from "@/shared/components/ui/button";
import { dateFormater } from "@/shared/utils";
import type { TestDto } from "@/features/tests/dtos/test.dto";

export default function SubjectDetail() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const subjectId = Number(id);

  const queryClient = useQueryClient();

  const { data: subject, isLoading } = useSubject({
    id: subjectId,
    queryConfig: { enabled: Number.isFinite(subjectId) },
  });

  const { tableProps } = useTestsTable({ subjectIds: [subjectId] });

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<TestDto | null>(null);
  const [confirm, setConfirm] = useState<TestDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: subjectsQueryKeys.all });
    queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });
  };

  const deleteMutation = useDeleteTest({
    mutationConfig: {
      onSuccess: () => {
        setConfirm(null);
        refresh();
        toast.success("Test deleted");
      },
    },
  });

  const restoreMutation = useRestoreTest({
    mutationConfig: {
      onSuccess: () => {
        refresh();
        toast.success("Test restored");
      },
    },
  });

  if (!allowed) return null;

  if (isLoading || !subject) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  const actions: TableAction<TestDto>[] = [
    {
      name: "view",
      label: "Open test",
      icon: <ListChecks size={16} />,
      onClick: (test) => navigate(testsPaths.testDetailLink(test.id)),
    },
    {
      name: "edit",
      label: "Edit",
      icon: <Edit size={16} />,
      onClick: (test) => setEditing(test),
    },
    {
      name: "restore",
      label: "Restore",
      icon: <RotateCcw size={16} />,
      hidden: (test) => !test.deletedAt,
      onClick: (test) => {
        restoreMutation.mutate(test.id);
      },
    },
    {
      name: "delete",
      label: "Remove",
      icon: <Trash size={16} />,
      variant: "destructive",
      hidden: (test) => Boolean(test.deletedAt),
      onClick: (test) => {
        setConfirm(test);
        setDeletingId(test.id);
      },
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="w-fit gap-2"
          onClick={() => navigate(`/${subjectsPaths.list}`)}
        >
          <ArrowLeft size={16} />
          Back to subjects
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <h1 className="text-3xl font-bold">{subject.name}</h1>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-(--secondary)/10">
              <div className="text-xs text-(--text-muted) uppercase">
                Created
              </div>
              <div className="text-lg font-semibold">
                {dateFormater(subject.createdAt)}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-(--secondary)/10">
              <div className="text-xs text-(--text-muted) uppercase">Tests</div>
              <div className="text-lg font-semibold">
                {tableProps.data?.rows?.length ?? 0} assigned
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tests</h2>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          Add Test
        </Button>
      </div>
      <Card className="pb-52">
        <CardContent>
          <TestsTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>

      <CreateTestFormModal
        isOpen={createOpen}
        initialSelectedSubjects={[subject]}
        onClose={() => setCreateOpen(false)}
      />

      {editing && (
        <EditTestFormModal
          isOpen
          test={editing}
          initialSelectedSubjects={[subject]}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmPopup
        isOpen={Boolean(confirm)}
        title={`Delete ${confirm?.name ?? ""}?`}
        message="The test will be soft-deleted. Its questions stay in the database."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => deleteMutation.mutate(deletingId ?? 0)}
      />
    </div>
  );
}
