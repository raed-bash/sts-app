import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { useTranslation } from "react-i18next";
import { useQueryClient } from "@tanstack/react-query";
import { testSessionsPaths } from "../test-sessions.paths";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";
import { CheckCircle2, Clock3, Send } from "lucide-react";
import toast from "@/shared/lib/toast";
import { cn } from "cn";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import Loading from "@/shared/components/custom/loading/Loading";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import QuestionTypeBadge from "@/components/QuestionTypeBadge";
import { BlanksAnswers, OrderAnswers } from "../components/exam/DragAnswers";

import { useExamTestSession } from "../api/get-exam-test-session.api";
import { useSubmitTestSession } from "../api/submit-test-session.api";
import type {
  ExamAnswerDto,
  ExamQuestionDto,
} from "../dtos/exam-test-session.dto";

type AnswerState = Record<number, (number | null)[]>;

const blankCount = (question: ExamQuestionDto) =>
  question.completeQuestion
    ? question.completeQuestion.text.split(";;;;").length - 1
    : 0;

function initAnswerState(questions: ExamQuestionDto[]): AnswerState {
  const state: AnswerState = {};

  for (const question of questions) {
    const blanks = blankCount(question);

    if (question.type === "DRAG_DROP") {
      state[question.id] =
        blanks > 0
          ? Array.from({ length: blanks }, () => null)
          : question.answers.map((answer) => answer.id);
    } else if (question.type === "COMPLETE") {
      state[question.id] = Array.from({ length: blanks }, () => null);
    } else {
      state[question.id] = [];
    }
  }

  return state;
}

// Answers survive a refresh or accidental tab close during the exam.
const draftKey = (id: number) => `exam-draft-${id}`;

function loadDraft(id: number, fresh: AnswerState): AnswerState {
  try {
    const saved = JSON.parse(localStorage.getItem(draftKey(id)) ?? "null");
    if (!saved || typeof saved !== "object") return fresh;
    const merged = { ...fresh };
    for (const key of Object.keys(fresh)) {
      const value = saved[key];
      // only reuse drafts whose shape still matches the question
      if (Array.isArray(value) && value.length === fresh[+key].length)
        merged[+key] = value;
      else if (Array.isArray(value) && fresh[+key].length === 0)
        merged[+key] = value.slice(0, 1);
    }
    return merged;
  } catch {
    return fresh;
  }
}

function saveDraft(id: number, answers: AnswerState) {
  try {
    localStorage.setItem(draftKey(id), JSON.stringify(answers));
  } catch {
    // storage unavailable: answers stay in memory only
  }
}

function clearDraft(id: number) {
  try {
    localStorage.removeItem(draftKey(id));
  } catch {
    // ignore
  }
}

function isAnswered(question: ExamQuestionDto, value: (number | null)[]) {
  // an untouched reorder list is already "complete"; blanks/choices need input
  if (question.type === "DRAG_DROP" && blankCount(question) === 0)
    return value.length > 0;
  return value.some((answerId) => answerId !== null);
}

function formatTime(totalSeconds: number): string {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  const mmss = `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;

  return hours > 0 ? `${hours}:${mmss}` : mmss;
}

export default function TakeExam() {
  const { t } = useTranslation(["common", "testSessions"]);
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const testSessionId = Number(id);

  const examQuery = useExamTestSession({
    id: testSessionId,
    queryConfig: {
      enabled: Number.isFinite(testSessionId),
      retry: false,
      // never refetch mid-exam: it would reset in-progress state
      refetchOnWindowFocus: false,
      staleTime: Infinity,
    },
  });

  const exam = examQuery.data;

  const [answers, setAnswers] = useState<AnswerState | null>(null);
  const answersRef = useRef<AnswerState>({});

  useEffect(() => {
    if (!answers) return;
    answersRef.current = answers;
    saveDraft(testSessionId, answers);
  }, [answers, testSessionId]);

  useEffect(() => {
    if (exam)
      setAnswers(loadDraft(testSessionId, initAnswerState(exam.questions)));
  }, [exam, testSessionId]);

  // Deadline: the student's own time limit, capped by the session end.
  const deadline = useMemo(() => {
    if (!exam?.startedAt) return null;
    const own =
      new Date(exam.startedAt).getTime() + (exam.test.period || 0) * 60_000;
    const sessionEnd = exam.finishDate
      ? new Date(exam.finishDate).getTime()
      : Infinity;
    return Math.min(own, sessionEnd);
  }, [exam]);

  const totalSeconds = Math.floor((exam?.test.period || 0) * 60);
  const secondsLeft = () =>
    deadline ? Math.max(0, Math.floor((deadline - Date.now()) / 1000)) : 0;

  const [remaining, setRemaining] = useState(0);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const submitFnRef = useRef<() => void>(() => {});
  const submitRef = useRef(false);

  useEffect(() => {
    if (!deadline) return;

    const tick = () => {
      const left = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0) submitFnRef.current();
    };

    tick();
    const timer = setInterval(tick, 1000);

    return () => clearInterval(timer);
  }, [deadline]);

  const submitMutation = useSubmitTestSession({
    mutationConfig: {
      onSuccess: () => {
        clearDraft(testSessionId);
        // clear the exam lock first, or ActiveExamRedirect bounces back here
        queryClient.setQueryData(
          testSessionsQueryKeys.checkStudentTestSessions(),
          { status: "NONE" },
        );
        // mark stale only: an immediate refetch would re-request this finished exam (400)
        queryClient.invalidateQueries({
          queryKey: testSessionsQueryKeys.all,
          refetchType: "none",
        });
        toast.success(t("testSessions:toasts.submittedWaiting"));
        navigate(testSessionsPaths.resultsLink(testSessionId), {
          replace: true,
        });
      },
      onError: (error) => {
        submitRef.current = false; // allow retry
        toast.error(error.message || t("testSessions:toasts.submitError"));
      },
    },
  });

  const buildPayload = useCallback(
    (finalAnswers: AnswerState) => {
      const questions = Object.entries(finalAnswers)
        .map(([questionId, answerIds]) => ({
          questionId: Number(questionId),
          // keep each answer's position so empty blanks don't shift the rest
          answers: answerIds.flatMap((answerId, answerIndex) =>
            answerId === null ? [] : [{ answerId, answerIndex }],
          ),
        }))
        .filter((question) => question.answers.length > 0);

      return { id: testSessionId, questions };
    },
    [testSessionId],
  );

  const submit = useCallback(
    (finalAnswers: AnswerState = answersRef.current) => {
      if (submitRef.current) return;
      submitRef.current = true;
      setConfirmOpen(false);
      submitMutation.mutate(buildPayload(finalAnswers));
    },
    [buildPayload, submitMutation],
  );

  useEffect(() => {
    submitFnRef.current = submit;
  }, [submit]);

  // Warn before closing/refreshing while the exam is running.
  useEffect(() => {
    if (!exam) return;
    const onBeforeUnload = (event: BeforeUnloadEvent) => {
      if (submitRef.current) return;
      event.preventDefault();
    };
    window.addEventListener("beforeunload", onBeforeUnload);
    return () => window.removeEventListener("beforeunload", onBeforeUnload);
  }, [exam]);

  const answeredCount = useMemo(
    () =>
      exam && answers
        ? exam.questions.filter((question) =>
            isAnswered(question, answers[question.id] ?? []),
          ).length
        : 0,
    [answers, exam],
  );

  if (examQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  if (examQuery.isError || !exam || Number.isNaN(testSessionId)) {
    return (
      <div className="flex flex-col items-center gap-4 py-20 text-center">
        <div className="max-w-md text-muted-foreground">
          {t("testSessions:exam.loadError")}
        </div>
        {examQuery.error?.message && (
          <div className="max-w-md text-xs text-muted-foreground">
            {examQuery.error.message}
          </div>
        )}
        <div className="flex flex-wrap justify-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/${testSessionsPaths.list}`)}
          >
            {t("common:actions.backToSessions")}
          </Button>
          <Button
            variant="outline-info"
            onClick={() =>
              navigate(testSessionsPaths.resultsLink(testSessionId))
            }
          >
            {t("common:actions.viewResults")}
          </Button>
        </div>
      </div>
    );
  }

  if (!answers) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  const setQuestionAnswer = (
    questionId: number,
    answerIds: (number | null)[],
  ) => setAnswers((prev) => ({ ...prev, [questionId]: answerIds }));

  const total = exam.questions.length;
  const unanswered = total - answeredCount;
  const timeUp = deadline !== null && remaining === 0;
  const progress =
    totalSeconds > 0
      ? Math.min(100, Math.round((remaining / totalSeconds) * 100))
      : 0;

  const requestSubmit = () =>
    unanswered > 0 ? setConfirmOpen(true) : submit();

  const submitting = submitMutation.isPending;

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-24 z-10 rounded-lg border bg-card/95 px-4 py-3 shadow-base backdrop-blur">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <div className="text-xs text-muted-foreground uppercase">
              {exam.subject.name}
            </div>
            <div className="truncate text-lg font-bold">{exam.test.name}</div>
          </div>

          <div className="flex items-center gap-3">
            <div
              role="timer"
              aria-live={remaining <= 60 ? "assertive" : "off"}
              aria-label={t("testSessions:exam.timeLeft")}
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-bold tabular-nums",
                remaining <= 60
                  ? "border-destructive/40 bg-destructive/10 text-destructive animate-pulse"
                  : remaining <= 300
                    ? "border-warning/50 bg-warning/10"
                    : "border-border bg-secondary",
              )}
            >
              <Clock3 size={16} />
              {formatTime(remaining || secondsLeft())}
            </div>
            <Button
              className="flex items-center gap-2"
              disabled={submitting}
              onClick={requestSubmit}
            >
              <Send size={16} />
              {submitting
                ? t("testSessions:exam.submitting")
                : t("testSessions:exam.submit")}
            </Button>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-3">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-secondary">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                remaining <= 60 ? "bg-destructive" : "bg-primary",
              )}
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="text-xs text-muted-foreground tabular-nums">
            {t("testSessions:exam.answeredProgress", {
              answered: answeredCount,
              total,
            })}
          </span>
        </div>
        {/* jump to a question; shows which are still empty */}
        <div className="mt-2 flex flex-wrap gap-1.5">
          {exam.questions.map((question, qIndex) => {
            const done = isAnswered(question, answers[question.id] ?? []);
            return (
              <a
                key={question.id}
                href={`#question-${question.id}`}
                aria-label={t("testSessions:results.q", { n: qIndex + 1 })}
                className={cn(
                  "flex size-7 items-center justify-center rounded-md border text-xs font-semibold no-underline transition-colors",
                  done
                    ? "border-success/50 bg-success/15 text-success"
                    : "border-border text-muted-foreground hover:bg-secondary",
                )}
              >
                {qIndex + 1}
              </a>
            );
          })}
        </div>
      </div>

      {timeUp && (
        <div className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {t("testSessions:exam.timeUp")}
        </div>
      )}

      {total === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          {t("testSessions:exam.noQuestions")}
        </div>
      ) : (
        <div className="flex flex-col gap-4">
          {exam.questions.map((question, qIndex) => (
            <ExamQuestionCard
              key={question.id}
              question={question}
              index={qIndex}
              value={answers[question.id] ?? []}
              onChange={(answerIds) =>
                setQuestionAnswer(question.id, answerIds)
              }
            />
          ))}
        </div>
      )}

      <div className="sticky bottom-4 mt-2 flex items-center justify-center">
        <Button
          size="lg"
          variant="success"
          className="flex items-center gap-2 shadow-lg"
          disabled={submitting}
          onClick={requestSubmit}
        >
          <CheckCircle2 size={18} />
          {t("testSessions:exam.submitExam")}
        </Button>
      </div>

      <ConfirmPopup
        isOpen={confirmOpen}
        title={t("testSessions:exam.confirmTitle")}
        message={t("testSessions:exam.confirmUnanswered", {
          count: unanswered,
        })}
        confirmLabel={t("testSessions:exam.submitExam")}
        loading={submitting}
        onCancel={() => setConfirmOpen(false)}
        onConfirm={() => submit()}
      />
    </div>
  );
}

function ExamQuestionCard({
  question,
  index,
  value,
  onChange,
}: {
  question: ExamQuestionDto;
  index: number;
  value: (number | null)[];
  onChange: (answerIds: (number | null)[]) => void;
}) {
  const { t } = useTranslation(["testSessions"]);
  const answered = isAnswered(question, value);

  return (
    <Card
      id={`question-${question.id}`}
      className={cn("scroll-mt-64", answered && "border-success/40")}
    >
      <CardContent className="pt-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-muted-foreground">
            {t("testSessions:results.q", { n: index + 1 })}
          </span>
          <QuestionTypeBadge type={question.type} />
          <span className="text-xs text-muted-foreground">
            {t("testSessions:results.pts", { count: question.points })}
          </span>
          {answered && (
            <CheckCircle2 size={16} className="ms-auto text-success" />
          )}
        </div>

        <div className="font-medium">{question.text}</div>

        {question.type === "CHOOSE" && (
          <ChooseAnswers
            answers={question.answers}
            selected={value[0] ?? null}
            onSelect={(answerId) =>
              onChange(answerId === value[0] ? [] : [answerId])
            }
          />
        )}

        {question.type === "DRAG_DROP" &&
          (question.completeQuestion?.text.includes(";;;;") ? (
            <BlanksAnswers
              question={question}
              value={value}
              onChange={onChange}
              dragMode
            />
          ) : (
            <OrderAnswers
              question={question}
              value={value as number[]}
              onChange={onChange}
            />
          ))}

        {question.type === "COMPLETE" && (
          <BlanksAnswers
            question={question}
            value={value}
            onChange={onChange}
          />
        )}
      </CardContent>
    </Card>
  );
}

function ChooseAnswers({
  answers,
  selected,
  onSelect,
}: {
  answers: ExamAnswerDto[];
  selected: number | null;
  onSelect: (answerId: number) => void;
}) {
  return (
    <div className="flex flex-col gap-2">
      {answers.map((answer, index) => {
        const isSelected = selected === answer.id;

        return (
          <button
            key={answer.id}
            type="button"
            aria-pressed={isSelected}
            onClick={() => onSelect(answer.id)}
            className={cn(
              "px-3 py-2.5 rounded-lg text-sm border text-start transition-colors flex items-center gap-2",
              isSelected
                ? "bg-primary/10 border-primary ring-1 ring-primary"
                : "border-border hover:bg-secondary",
            )}
          >
            <span
              className={cn(
                "flex size-6 shrink-0 items-center justify-center rounded-full border text-xs font-semibold",
                isSelected
                  ? "border-primary bg-primary text-primary-foreground"
                  : "text-muted-foreground",
              )}
            >
              {String.fromCharCode(65 + index)}
            </span>
            {answer.text}
          </button>
        );
      })}
    </div>
  );
}
