import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { questionsPaths } from "../questions.paths";
import { ArrowLeft, Edit, Plus, Trash } from "lucide-react";
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
import { translateDynamic } from "@/shared/lib/translate-dynamic";
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
  const { t } = useTranslation(["common", "questions", "answers"]);

  const queryClient = useQueryClient();

  const { data: question, isLoading } = useQuestion({
    id: questionId,
    queryConfig: { enabled: Number.isFinite(questionId) },
  });

  const { tableProps } = useAnswersTable({ questionId });

  const [createOpen, setCreateOpen] = useState(false);
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

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          className="w-fit gap-2"
          onClick={() => navigate(`/${questionsPaths.list}`)}
        >
          <ArrowLeft size={16} />
          {t("questions:detail.back")}
        </Button>
      </div>

      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center justify-between gap-4">
            <h1 className="text-3xl font-bold">{question.text}</h1>
            <QuestionTypeBadge type={question.type} />
          </div>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            <div className="p-4 rounded-lg bg-secondary/10">
              <div className="text-xs text-muted-foreground uppercase">
                {t("common:fields.type")}
              </div>
              <div className="text-lg font-semibold">
                {translateDynamic(
                  t,
                  `common:questionTypes.${question.type.toLowerCase()}`,
                )}
              </div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/10">
              <div className="text-xs text-muted-foreground uppercase">
                {t("common:fields.points")}
              </div>
              <div className="text-lg font-semibold">{question.points}</div>
            </div>
            <div className="p-4 rounded-lg bg-secondary/10">
              <div className="text-xs text-muted-foreground uppercase">
                {t("common:fields.created")}
              </div>
              <div className="text-lg font-semibold">
                {dateFormatter(question.createdAt)}
              </div>
            </div>
          </div>
          {question.completeQuestion && (
            <div className="mt-4 p-4 rounded-lg bg-info/10">
              <div className="text-xs text-muted-foreground uppercase">
                {t("questions:detail.completeAnswer")}
              </div>
              <div className="text-lg font-semibold">
                {question.completeQuestion.text}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">{t("entities.answers")}</h2>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <Plus size={16} />
          {t("common:actions.addAnswer")}
        </Button>
      </div>
      <Card className="pb-52">
        <CardContent>
          <AnswersTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>

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
