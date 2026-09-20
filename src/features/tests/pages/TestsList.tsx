import { useState } from "react";
import { useNavigate } from "react-router";
import { testsPaths } from "../tests.paths";
import { Edit, ListChecks, Plus, RotateCcw, Trash } from "lucide-react";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import TestsTable from "../components/TestsTable";
import CreateTestFormModal from "../components/CreateTestFormModal";
import EditTestFormModal from "../components/EditTestFormModal";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { QueryTestDto } from "../dtos/query-test.dto";
import type { TestDto } from "../dtos/test.dto";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getTestsQueryOptions } from "../api/get-tests.api";
import type { QueryClient } from "@tanstack/react-query";
import { useTestsTable } from "../hooks/useTestsTable";
import { useRequireRole } from "@/hooks/useRequireRole";
import { Button } from "@/shared/components/ui/button";
import toast from "@/shared/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { testsQueryKeys } from "../tests.api-keys";
import { useDeleteTest } from "../api/delete-test.api";
import { useRestoreTest } from "../api/restore-test.api";

// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getTestsQueryOptions(new QueryTestDto({}));

  return (
    queryClient.getQueryData(query.queryKey) ?? (await queryClient.query(query))
  );
};

export default function TestsList() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const { tableProps } = useTestsTable();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<TestDto | null>(null);
  const [confirm, setConfirm] = useState<TestDto | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: testsQueryKeys.all });

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
      icon: <Edit />,
      onClick: (test) => setEditing(test),
    },
    {
      name: "restore",
      label: "Restore",
      icon: <RotateCcw />,
      hidden: (test) => !test.deletedAt,
      onClick: (test) => restoreMutation.mutate(test.id),
    },
    {
      name: "delete",
      label: "Remove",
      icon: <Trash />,
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
        <h1 className="text-3xl font-bold">Tests</h1>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          Add Test
        </Button>
      </div>
      <Card className="pb-0">
        <CardContent>
          <TestsTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>

      <CreateTestFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
        onSuccess={(data) => navigate(testsPaths.testDetailLink(data.id))}
      />

      {editing && (
        <EditTestFormModal
          isOpen
          test={editing}
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