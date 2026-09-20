import { useState } from "react";
import { Pencil, Play, Plus, Square, Trash, BarChart3 } from "lucide-react";
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
  const { tableProps } = useTestSessionsTable();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<TestSessionDto | null>(null);
  const [confirm, setConfirm] = useState<TestSessionDto | null>(null);

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: testSessionsQueryKeys.all });
  };

  const startMutation = useStartTestSession({
    mutationConfig: { onSuccess: refresh },
  });
  const finishMutation = useFinishTestSession({
    mutationConfig: { onSuccess: refresh },
  });
  const deleteMutation = useDeleteTestSession({
    mutationConfig: {
      onSuccess: () => {
        setConfirm(null);
        refresh();
        toast.success("Test session deleted");
      },
    },
  });

  const actions: TableAction<TestSessionDto>[] = [
    {
      name: "edit",
      label: "Edit schedule",
      icon: <Pencil />,
      onClick: (session) => setEditing(session),
    },
    {
      name: "start",
      label: "Start",
      icon: <Play />,
      hidden: (session) => session.status !== "PENDING",
      onClick: (session) => startMutation.mutate(session.id),
    },
    {
      name: "finish",
      label: "Finish",
      icon: <Square />,
      hidden: (session) => session.status !== "STARTED",
      onClick: (session) => finishMutation.mutate(session.id),
    },
    {
      name: "results",
      label: "View results",
      icon: <BarChart3 />,
      hidden: (session) => session.status !== "FINISHED",
      onClick: (session) => navigate(testSessionsPaths.resultsLink(session.id)),
    },
    {
      name: "delete",
      label: "Remove",
      icon: <Trash />,
      variant: "destructive",
      hidden: (session) => Boolean(session.deletedAt),
      onClick: (session) => setConfirm(session),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Test Sessions</h1>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          Create Session
        </Button>
      </div>
      <Card className="pb-0">
        <CardContent>
          <TestSessionsTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>

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
        title={`Delete session #${confirm?.id ?? ""}?`}
        message="The test session will be soft-deleted."
        confirmLabel="Delete"
        destructive
        loading={deleteMutation.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => confirm && deleteMutation.mutate(confirm.id)}
      />
    </div>
  );
}

function StudentTestSessionsView() {
  const { data, isLoading } = useTestSessionsStudents();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const refresh = () => {
    queryClient.invalidateQueries({ queryKey: testSessionsQueryKeys.all });
  };

  const registerMutation = useRegisterTestSession({
    mutationConfig: { onSuccess: refresh },
  });
  const startMutation = useStartStudentTestSession({
    mutationConfig: {
      onSuccess: () => {
        refresh();
        const sessionId = startMutation.variables;
        if (sessionId != null) navigate(testSessionsPaths.examLink(sessionId));
      },
    },
  });

  return (
    <div className="flex flex-col gap-5">
      <div>
        <h1 className="text-3xl font-bold">My Test Sessions</h1>
        <p className="text-(--text-muted) text-sm">
          Register for a session ahead of time, then start it when it goes live.
        </p>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loading />
        </div>
      ) : data && data.length > 0 ? (
        <StudentSessions
          data={data}
          loading={registerMutation.isPending || startMutation.isPending}
          onRegister={(session) => registerMutation.mutate(session.id)}
          onStart={(session) => startMutation.mutate(session.id)}
          onResults={(session) =>
            navigate(testSessionsPaths.resultsLink(session.id))
          }
        />
      ) : (
        <div className="text-center text-(--text-muted) py-20">
          No test sessions available yet.
        </div>
      )}
    </div>
  );
}
