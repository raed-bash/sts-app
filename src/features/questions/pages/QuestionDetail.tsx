import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { questionsPaths } from "../questions.paths";
import { ArrowLeft, ChevronDown, Edit, Plus, Trash } from "lucide-react";
import AppLink from "@/shared/components/custom/AppLink";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/shared/components/ui/collapsible";
import { testsPaths } from "@/features/tests/tests.paths";
import EditQuestionFormModal from "../components/EditQuestionFormModal";
import QuestionPreview from "../components/form/QuestionPreview";
import { fromStored, parseBlanks } from "../utils/blanks";
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
import { useTranslation } from "react-i18next";

export default function QuestionDetail() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const questionId = Number(id);
  const { t } = useTranslation([
    "common",
    "questions",
    "answers",
    "testSessions",
  ]);

  const queryClient = useQueryClient();

  const { data: question, isLoading } = useQuestion({
    id: questionId,
    queryConfig: { enabled: Number.isFinite(questionId) },
  });

  const { tableProps } = useAnswersTable({ questionId });

  const [createOpen, setCreateOpen] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(false);
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
        toast.success(t("answers:toasts.deleted"));
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
      label: t("common:actions.edit"),
      icon: <Edit size={16} />,
      onClick: (answer) => setEditing(answer),
    },
    {
      name: "delete",
      label: t("common:actions.remove"),
      icon: <Trash size={16} />,
      variant: "destructive",
      onClick: (answer) => {
        setConfirm(answer);
        setDeletingId(answer.id);
      },
    },
  ];

  const answers = question.answers ?? [];
  const parsed = question.completeQuestion
    ? parseBlanks(fromStored(question.completeQuestion.text, answers))
    : null;
  const choices = [...answers]
    .sort((a, b) => a.order - b.order)
    .map(({ text, isCorrect }) => ({ text, isCorrect }));
  const preview = {
    type: question.type,
    text: question.text,
    points: question.points,
    choices,
    segments: parsed?.segments ?? [],
    blanks: parsed?.blanks ?? [],
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Button
          variant="outline"
          className="w-fit gap-2"
          onClick={() => navigate(`/${questionsPaths.list}`)}
        >
          <ArrowLeft size={16} className="rtl:rotate-180" />
          {t("questions:detail.back")}
        </Button>
        <Button className="gap-2" onClick={() => setEditingQuestion(true)}>
          <Edit size={16} />
          {t("questions:detail.editQuestion")}
        </Button>
      </div>

      <Card>
        <CardContent className="flex flex-col gap-4 pt-6">
          <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
            <QuestionTypeBadge type={question.type} />
            <span>#{question.id}</span>
            <span>·</span>
            <span>
              {t("testSessions:results.pts", { count: question.points })}
            </span>
            <span>·</span>
            <span>{dateFormatter(question.createdAt)}</span>
            {(question.answeredCount ?? 0) > 0 && (
              <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-medium text-secondary-foreground">
                {t("questions:detail.answeredTimes", {
                  count: question.answeredCount,
                })}
              </span>
            )}
          </div>
          <h1 className="text-2xl font-bold leading-snug">{question.text}</h1>

          <div>
            <div className="mb-2 text-xs font-semibold uppercase text-muted-foreground">
              {t("questions:detail.usedIn")}
            </div>
            {question.tests?.length ? (
              <div className="flex flex-wrap gap-2">
                {question.tests.map((test) => (
                  <AppLink
                    key={test.id}
                    to={testsPaths.testDetailLink(test.id)}
                    className="rounded-full border px-3 py-1 text-sm no-underline text-foreground transition-colors hover:border-primary/50 hover:bg-secondary"
                  >
                    {test.name}
                  </AppLink>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground">
                {t("questions:detail.notUsed")}
              </p>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-5 lg:grid-cols-2">
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            {t("questions:detail.preview")}
          </h2>
          <QuestionPreview {...preview} />
        </section>
        <section className="flex flex-col gap-2">
          <h2 className="text-lg font-semibold">
            {t("questions:detail.answerKey")}
          </h2>
          <QuestionPreview {...preview} showAnswers />
        </section>
      </div>

      {/* raw answer rows: kept for edge cases (order/positions by hand) */}
      <Collapsible>
        <CollapsibleTrigger className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground">
          <ChevronDown size={16} />
          {t("questions:detail.manageRaw")}
        </CollapsibleTrigger>
        <CollapsibleContent className="mt-3 flex flex-col gap-3">
          <div className="flex justify-end">
            <Button
              size="sm"
              variant="outline"
              className="w-fit gap-2"
              onClick={() => setCreateOpen(true)}
            >
              <Plus size={14} />
              {t("common:actions.addAnswer")}
            </Button>
          </div>
          <Card className="pb-0">
            <CardContent>
              <AnswersTable {...tableProps} actions={actions} />
            </CardContent>
          </Card>
        </CollapsibleContent>
      </Collapsible>

      {editingQuestion && (
        <EditQuestionFormModal
          isOpen
          question={question}
          onClose={() => setEditingQuestion(false)}
        />
      )}

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
        title={t("answers:confirm.deleteTitle", { id: confirm?.id ?? "" })}
        message={t("answers:confirm.deleteMessage")}
        confirmLabel={t("common:actions.delete")}
        destructive
        loading={deleteMutation.isPending}
        onCancel={() => setConfirm(null)}
        onConfirm={() => deleteMutation.mutate(deletingId ?? 0)}
      />
    </div>
  );
}
