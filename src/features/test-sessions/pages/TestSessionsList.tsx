import ViewSwitch from "@/shared/components/custom/views/ViewSwitch";
import { useViewMode } from "@/shared/components/custom/views/use-view-mode";
import SessionsBoard from "../components/SessionsBoard";
import { useState } from "react";
import {
  Ban,
  Pencil,
  Play,
  Plus,
  Square,
  Trash,
  BarChart3,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import TestSessionsTable from "../components/TestSessionsTable";
import CreateTestSessionFormModal from "../components/CreateTestSessionFormModal";
import EditTestSessionFormModal from "../components/EditTestSessionFormModal";
import StudentSessions from "../components/StudentSessions";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { QueryTestSessionDto } from "../dtos/query-test-session.dto";
import type { TestSessionDto } from "../dtos/test-session.dto";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getTestSessionsQueryOptions } from "../api/get-test-sessions.api";
import type { QueryClient } from "@tanstack/react-query";
import { useTestSessionsTable } from "../hooks/useTestSessionsTable";
import { useStartTestSession } from "../api/start-test-session.api";
import { useFinishTestSession } from "../api/finish-test-session.api";
import { useDeleteTestSession } from "../api/delete-test-session.api";
import { useCancelTestSession } from "../api/cancel-test-session.api";
import { useRegisterTestSession } from "../api/register-test-session.api";
import { useStartStudentTestSession } from "../api/start-student-test-session.api";
import { useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router";
import { testSessionsPaths } from "../test-sessions.paths";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";
import { useRole } from "@/hooks/useRole";
import { Button } from "@/shared/components/ui/button";
import toast from "@/shared/lib/toast";
import Loading from "@/shared/components/custom/loading/Loading";
import { useTestSessionsStudents } from "../hooks/useTestSessionsStudents";

// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getTestSessionsQueryOptions(new QueryTestSessionDto({}));

  return (
    queryClient.getQueryData(query.queryKey) ?? (await queryClient.query(query))
  );
};

export default function TestSessionsList() {
  const role = useRole();
  const isStudent = role === "STUDENT";

  return isStudent ? <StudentTestSessionsView /> : <AdminTestSessionsView />;
}

function AdminTestSessionsView() {
  const { t } = useTranslation(["testSessions", "common"]);
  const { tableProps } = useTestSessionsTable();
  const [view, setView] = useViewMode("test-sessions");
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<TestSessionDto | null>(null);
  const [confirm, setConfirm] = useState<{
    session: TestSessionDto;
    kind: "delete" | "finish" | "cancel";
  } | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: testSessionsQueryKeys.all });
  };

  const done = (message: string) => () => {
    setConfirm(null);
    refresh();
    toast.success(message);
  };

  const startMutation = useStartTestSession({
    mutationConfig: { onSuccess: done(t("testSessions:toasts.started")) },
  });
  const finishMutation = useFinishTestSession({
    mutationConfig: { onSuccess: done(t("testSessions:toasts.finished")) },
  });
  const cancelMutation = useCancelTestSession({
    mutationConfig: { onSuccess: done(t("testSessions:toasts.canceled")) },
  });
  const deleteMutation = useDeleteTestSession({
    mutationConfig: { onSuccess: done(t("testSessions:toasts.deleted")) },
  });

  const active = (session: TestSessionDto) =>
    session.status === "PENDING" || session.status === "STARTED";

  const actions: TableAction<TestSessionDto>[] = [
    {
      name: "results",
      label: t("testSessions:actions.results"),
      icon: <BarChart3 />,
      hidden: (session) =>
        session.status !== "FINISHED" && session.status !== "STARTED",
      onClick: (session) => navigate(testSessionsPaths.resultsLink(session.id)),
    },
    {
      name: "edit",
      label: t("testSessions:actions.editSchedule"),
      icon: <Pencil />,
      hidden: (session) => !active(session) || Boolean(session.deletedAt),
      onClick: (session) => setEditing(session),
    },
    {
      name: "start",
      label: t("testSessions:actions.startNow"),
      icon: <Play />,
      hidden: (session) =>
        session.status !== "PENDING" || Boolean(session.deletedAt),
      onClick: (session) => startMutation.mutate(session.id),
    },
    {
      name: "finish",
      label: t("testSessions:actions.finish"),
      icon: <Square />,
      hidden: (session) => session.status !== "STARTED",
      onClick: (session) => setConfirm({ session, kind: "finish" }),
    },
    {
      name: "cancel",
      label: t("testSessions:actions.cancel"),
      icon: <Ban />,
      variant: "destructive",
      hidden: (session) => !active(session) || Boolean(session.deletedAt),
      onClick: (session) => setConfirm({ session, kind: "cancel" }),
    },
    {
      name: "delete",
      label: t("common:actions.remove"),
      icon: <Trash />,
      variant: "destructive",
      hidden: (session) => Boolean(session.deletedAt),
      onClick: (session) => setConfirm({ session, kind: "delete" }),
    },
  ];

  const confirmCopy =
    confirm &&
    {
      delete: {
        title: t("testSessions:confirm.deleteTitle", {
          id: confirm.session.id,
        }),
        message: t("testSessions:confirm.deleteMessage"),
        label: t("common:actions.delete"),
        mutation: deleteMutation,
      },
      finish: {
        title: t("testSessions:confirm.finishTitle", {
          id: confirm.session.id,
        }),
        message: t("testSessions:confirm.finishMessage"),
        label: t("testSessions:actions.finish"),
        mutation: finishMutation,
      },
      cancel: {
        title: t("testSessions:confirm.cancelTitle", {
          id: confirm.session.id,
        }),
        message: t("testSessions:confirm.cancelMessage"),
        label: t("testSessions:actions.cancel"),
        mutation: cancelMutation,
      },
    }[confirm.kind];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">{t("testSessions:list.title")}</h1>
        <div className="flex items-center gap-2">
          <ViewSwitch value={view} onChange={setView} />
          <Button
            className="w-fit flex items-center gap-2"
            onClick={() => setCreateOpen(true)}
          >
            <Plus size={16} />
            {t("testSessions:list.create")}
          </Button>
        </div>
      </div>
      {view === "cards" ? (
        <SessionsBoard actions={actions} />
      ) : (
        <Card className="pb-0">
          <CardContent>
            <TestSessionsTable {...tableProps} actions={actions} />
          </CardContent>
        </Card>
      )}

      <CreateTestSessionFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {editing && (
        <EditTestSessionFormModal
          isOpen
          session={editing}
          onClose={() => setEditing(null)}
        />
      )}

      <ConfirmPopup
        isOpen={Boolean(confirm)}
        title={confirmCopy?.title ?? ""}
        message={confirmCopy?.message ?? ""}
        confirmLabel={confirmCopy?.label ?? ""}
        destructive
        loading={confirmCopy?.mutation.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() =>
          confirm && confirmCopy?.mutation.mutate(confirm.session.id)
        }
      />
    </div>
  );
}

// Live sessions first, then upcoming, then past.
const STATUS_ORDER: Record<TestSessionDto["status"], number> = {
  STARTED: 0,
  PENDING: 1,
  FINISHED: 2,
  CANCELED: 3,
};

function StudentTestSessionsView() {
  const { t } = useTranslation(["testSessions"]);
  const { data, isLoading } = useTestSessionsStudents();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: testSessionsQueryKeys.all });
  };

  const registerMutation = useRegisterTestSession({
    mutationConfig: {
      onSuccess: () => {
        refresh();
        toast.success(t("testSessions:toasts.registered"));
      },
    },
  });
  const startMutation = useStartStudentTestSession({
    mutationConfig: {
      // no list refresh here: during the exam the API blocks every other page
      onSuccess: (_, sessionId) => {
        queryClient.setQueryData(
          testSessionsQueryKeys.checkStudentTestSessions(),
          { status: "STARTED", testSessionId: sessionId },
        );
        navigate(testSessionsPaths.examLink(sessionId));
      },
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">{t("testSessions:list.myTitle")}</h1>
        <p className="text-muted-foreground text-sm">
          {t("testSessions:list.subtitle")}
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loading />
        </div>
      ) : data && data.length > 0 ? (
        <StudentSessions
          data={[...data].sort(
            (a, b) =>
              STATUS_ORDER[a.status] - STATUS_ORDER[b.status] ||
              new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
          )}
          pendingId={
            registerMutation.isPending
              ? registerMutation.variables
              : startMutation.isPending
                ? startMutation.variables
                : null
          }
          onRegister={(session) => registerMutation.mutate(session.id)}
          onStart={(session) => startMutation.mutate(session.id)}
          onResults={(session) =>
            navigate(testSessionsPaths.resultsLink(session.id))
          }
        />
      ) : (
        <div className="text-center text-muted-foreground py-20">
          {t("testSessions:list.noSessions")}
        </div>
      )}
    </div>
  );
}
