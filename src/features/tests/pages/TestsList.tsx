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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation(["common", "tests"]);
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
        toast.success(t("tests:toasts.deleted"));
      },
    },
  });

  const restoreMutation = useRestoreTest({
    mutationConfig: {
      onSuccess: () => {
        refresh();
        toast.success(t("tests:toasts.restored"));
      },
    },
  });

  if (!allowed) return null;

  const actions: TableAction<TestDto>[] = [
    {
      name: "view",
      label: t("tests:actions.open"),
      icon: <ListChecks size={16} />,
      onClick: (test) => navigate(testsPaths.testDetailLink(test.id)),
    },
    {
      name: "edit",
      label: t("common:actions.edit"),
      icon: <Edit />,
      onClick: (test) => setEditing(test),
    },
    {
      name: "restore",
      label: t("common:actions.restore"),
      icon: <RotateCcw />,
      hidden: (test) => !test.deletedAt,
      onClick: (test) => restoreMutation.mutate(test.id),
    },
    {
      name: "delete",
      label: t("common:actions.remove"),
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
        <h1 className="text-3xl font-bold">{t("entities.tests")}</h1>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          {t("tests:list.add")}
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
        title={t("common:confirm.deleteTitle", { name: confirm?.name ?? "" })}
        message={t("tests:confirm.deleteMessage")}
        confirmLabel={t("common:actions.delete")}
        destructive
        loading={deleteMutation.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => deleteMutation.mutate(deletingId ?? 0)}
      />
    </div>
  );
}
