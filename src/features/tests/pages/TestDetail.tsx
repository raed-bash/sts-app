import ShowDeletedToggle from "@/shared/components/custom/views/ShowDeletedToggle";
import { useShowDeleted } from "@/shared/components/custom/views/use-show-deleted";
import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { testsPaths } from "../tests.paths";
import { questionsPaths } from "@/features/questions/questions.paths";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit,
  HelpCircle,
  ListChecks,
  Plus,
  RotateCcw,
  Star,
  Trash,
} from "lucide-react";
import AppLink from "@/shared/components/custom/AppLink";
import ViewSwitch from "@/shared/components/custom/views/ViewSwitch";
import { useViewMode } from "@/shared/components/custom/views/use-view-mode";
import { subjectsPaths } from "@/features/subjects/subjects.paths";
import TestQuestionItem from "../components/TestQuestionItem";
import Fact from "@/shared/components/custom/views/Fact";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import EditTestFormModal from "../components/EditTestFormModal";
import CreateQuestionFormModal from "@/features/questions/components/CreateQuestionFormModal";
import EditQuestionFormModal from "@/features/questions/components/EditQuestionFormModal";
import QuestionsTable from "@/features/questions/components/QuestionsTable";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useTest } from "../api/get-test.api";
import { useQuestionsTable } from "@/features/questions/hooks/useQuestionsTable";
import { useRequireRole } from "@/hooks/useRequireRole";
import { useQueryClient } from "@tanstack/react-query";
import { useDeleteQuestion } from "@/features/questions/api/delete-question.api";
import { useRestoreQuestion } from "@/features/questions/api/restore-question.api";
import { useDeleteTest } from "../api/delete-test.api";
import { questionsQueryKeys } from "@/features/questions/questions.api-keys";
import { testsQueryKeys } from "../tests.api-keys";
import toast from "@/shared/lib/toast";
import Loading from "@/shared/components/custom/loading/Loading";
import { Button } from "@/shared/components/ui/button";
import type { QuestionDto } from "@/features/questions/dtos/question.dto";
import type { TestDto } from "../dtos/test.dto";
import { dateFormatter } from "@/shared/utils";
import { useTranslation } from "react-i18next";

export default function TestDetail() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const testId = Number(id);

  const queryClient = useQueryClient();
  const { t } = useTranslation(["common", "tests", "questions"]);

  const { data: test, isLoading } = useTest({
    id: testId,
    queryConfig: { enabled: Number.isFinite(testId) },
  });

  const [showDeleted, setShowDeleted] = useShowDeleted("test-questions");
  const { tableProps } = useQuestionsTable({
    testIds: [testId],
    isDeleted: showDeleted,
  });
  const [view, setView] = useViewMode("test-questions");

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
        toast.success(t("tests:toasts.deleted"));
        navigate(`/${testsPaths.list}`);
      },
    },
  });

  const deleteQuestionMutation = useDeleteQuestion({
    mutationConfig: {
      onSuccess: () => {
        setConfirmQuestion(null);
        refresh();
        toast.success(t("questions:toasts.deleted"));
      },
    },
  });

  const restoreQuestionMutation = useRestoreQuestion({
    mutationConfig: {
      onSuccess: () => {
        refresh();
        toast.success(t("questions:toasts.restored"));
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

  const activeQuestions = (test.questions ?? [])
    .map(({ question }) => question)
    .filter((question) => showDeleted || !question.deletedAt);
  const totalPoints = activeQuestions
    .filter((q) => !q.deletedAt)
    .reduce((sum, q) => sum + q.points, 0);

  const questionActions: TableAction<QuestionDto>[] = [
    {
      name: "answers",
      label: t("entities.answers"),
      icon: <ListChecks size={16} />,
      onClick: (question) =>
        navigate(questionsPaths.questionDetailLink(question.id)),
    },
    {
      name: "edit",
      label: t("common:actions.edit"),
      icon: <Edit size={16} />,
      onClick: (question) => setEditingQuestion(question),
    },
    {
      name: "restore",
      label: t("common:actions.restore"),
      icon: <RotateCcw size={16} />,
      hidden: (question) => !question.deletedAt,
      onClick: (question) => {
        restoreQuestionMutation.mutate(question.id);
      },
    },
    {
      name: "delete",
      label: t("common:actions.remove"),
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
          {t("tests:detail.back")}
        </Button>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="w-fit gap-2"
            onClick={() => setEditingTest(test)}
          >
            <Edit size={16} />
            {t("tests:detail.edit")}
          </Button>
          <Button
            variant="destructive"
            className="w-fit gap-2"
            onClick={() => setConfirmTest(test)}
          >
            <Trash size={16} />
            {t("common:actions.delete")}
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div>
            <div className="text-xs text-muted-foreground">#{test.id}</div>
            <h1 className="text-3xl font-bold">{test.name}</h1>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
            <Fact
              icon={<Clock3 size={16} />}
              label={t("tests:detail.duration")}
              value={t("tests:detail.minutes", { count: test.period })}
            />
            <Fact
              icon={<HelpCircle size={16} />}
              label={t("entities.questions")}
              value={activeQuestions.filter((q) => !q.deletedAt).length}
            />
            <Fact
              icon={<Star size={16} />}
              label={t("tests:detail.totalPoints")}
              value={Math.round(totalPoints * 100) / 100}
            />
            <Fact
              icon={<CalendarDays size={16} />}
              label={t("common:fields.created")}
              value={dateFormatter(test.createdAt, "date")}
            />
          </div>
          <div>
            <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              {t("tests:detail.subjects")}
            </div>
            {test.subjects?.length ? (
              <div className="flex flex-wrap gap-2">
                {test.subjects.map((subject) => (
                  <AppLink
                    key={subject.id}
                    to={subjectsPaths.subjectDetailLink(subject.id)}
                    className="rounded-full border px-3 py-1 text-sm no-underline text-foreground transition-colors hover:border-primary/50 hover:bg-secondary"
                  >
                    {subject.name}
                  </AppLink>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("tests:detail.subjectsNotAssigned")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-2xl font-bold">{t("entities.questions")}</h2>
        <div className="flex items-center gap-2">
          <ShowDeletedToggle value={showDeleted} onChange={setShowDeleted} />
          <ViewSwitch value={view} onChange={setView} />
          <Button
            className="w-fit flex items-center gap-2"
            onClick={() => setCreateQuestionOpen(true)}
          >
            <Plus size={16} />
            {t("common:actions.addQuestion")}
          </Button>
        </div>
      </div>

      {view === "cards" ? (
        activeQuestions.length === 0 ? (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed py-14 text-center text-muted-foreground">
            <HelpCircle size={28} />
            {t("tests:detail.noQuestions")}
            <Button
              variant="outline"
              className="gap-2"
              onClick={() => setCreateQuestionOpen(true)}
            >
              <Plus size={16} />
              {t("common:actions.addQuestion")}
            </Button>
          </div>
        ) : (
          <ol className="flex flex-col gap-3">
            {activeQuestions.map((question, index) => (
              <TestQuestionItem
                key={question.id}
                index={index}
                question={question}
                actions={questionActions}
              />
            ))}
          </ol>
        )
      ) : (
        <Card className="pb-52">
          <CardContent>
            <QuestionsTable {...tableProps} actions={questionActions} />
          </CardContent>
        </Card>
      )}

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
        title={t("questions:confirm.deleteTitle", {
          id: confirmQuestion?.id ?? "",
        })}
        message={t("questions:confirm.deleteMessage")}
        confirmLabel={t("common:actions.delete")}
        destructive
        loading={deleteQuestionMutation.isPending}
        onCancel={() => setConfirmQuestion(null)}
        onConfirm={() =>
          confirmQuestion && deleteQuestionMutation.mutate(confirmQuestion.id)
        }
      />

      <ConfirmPopup
        isOpen={Boolean(confirmTest)}
        title={t("common:confirm.deleteTitle", {
          name: confirmTest?.name ?? "",
        })}
        message={t("tests:confirm.deleteMessage")}
        confirmLabel={t("common:actions.delete")}
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
