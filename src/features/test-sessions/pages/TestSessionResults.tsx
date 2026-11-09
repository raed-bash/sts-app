import { useEffect, useMemo, useState } from "react";
import type { AxiosError } from "axios";
import { useQueryClient } from "@tanstack/react-query";
import { testSessionsQueryKeys } from "../test-sessions.api-keys";
import { useParams, useSearchParams } from "react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowLeft,
  CheckCircle2,
  CircleMinus,
  Lock,
  XCircle,
} from "lucide-react";
import { testSessionsPaths } from "../test-sessions.paths";
import { useTestSessionResults } from "../api/get-test-session-results.api";
import { useTestSessionStudents } from "../api/get-test-session-students.api";
import { Card, CardContent } from "@/shared/components/ui/card";
import Loading from "@/shared/components/custom/loading/Loading";
import AppLink from "@/shared/components/custom/AppLink";
import QuestionTypeBadge from "@/components/QuestionTypeBadge";
import { useRole } from "@/hooks/useRole";
import { dateFormatter } from "@/shared/utils";
import { STUDENT_TEST_SESSION_STATUS_TITLES } from "@/constants/student-test-session-status";
import { cn } from "cn";
import type { SessionStudentResultDto } from "../dtos/session-student-result.dto";
import type { ResultQuestionDto } from "../dtos/result-test-session.dto";

// Stored positions (answer.correctIndex, studentAnswer.answerIndex) are 1-based.

/** Rounds partial points (e.g. 4/3) for display. */
const pts = (n: number) => Math.round(n * 100) / 100;

const percentOf = (got: number, total: number) =>
  total > 0 ? Math.round((got / total) * 100) : 0;

const scoreTone = (percentage: number) =>
  percentage >= 85
    ? "text-success"
    : percentage >= 50
      ? "text-warning"
      : "text-destructive";

function questionOutcome(question: ResultQuestionDto) {
  const answered = question.studentAnswers?.some(
    (studentAnswer) => studentAnswer.answer?.id != null,
  );
  if (!answered) return "unanswered" as const;
  if (question.studentPoints >= question.points) return "correct" as const;
  if (question.studentPoints > 0) return "partial" as const;
  return "wrong" as const;
}

const OUTCOME_STYLES = {
  correct: "border-s-4 border-s-success",
  partial: "border-s-4 border-s-warning",
  wrong: "border-s-4 border-s-destructive",
  unanswered: "border-s-4 border-s-muted-foreground/30",
} as const;

function Centered({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center gap-4 py-20 text-center text-muted-foreground">
      {children}
    </div>
  );
}

export default function TestSessionResults() {
  const { t } = useTranslation(["common", "testSessions"]);
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const role = useRole();
  const isAdmin = role === "SUPER_ADMIN";

  const testSessionId = Number(id);
  const studentIdParam = searchParams.get("studentId");
  const studentId = studentIdParam ? Number(studentIdParam) : undefined;

  const studentsQuery = useTestSessionStudents({
    id: testSessionId,
    queryConfig: {
      enabled: isAdmin && Number.isFinite(testSessionId),
      refetchInterval: 15_000, // live roster while the session runs
    },
  });
  const students = useMemo(
    () => studentsQuery.data ?? [],
    [studentsQuery.data],
  );
  const finishedStudents = useMemo(
    () => students.filter((s) => s.status === "FINISHED"),
    [students],
  );

  useEffect(() => {
    if (!isAdmin || studentIdParam) return;
    const first = finishedStudents[0];
    if (first) {
      setSearchParams({ studentId: String(first.id) }, { replace: true });
    }
  }, [isAdmin, studentIdParam, finishedStudents, setSearchParams]);

  const resultsQuery = useTestSessionResults({
    id: testSessionId,
    studentId,
    queryConfig: {
      enabled:
        Number.isFinite(testSessionId) && (isAdmin ? Boolean(studentId) : true),
      retry: false,
    },
  });

  const selectStudent = (student: SessionStudentResultDto) => {
    setSearchParams({ studentId: String(student.id) }, { replace: true });
  };

  const backLink = (
    <AppLink
      to={`/${testSessionsPaths.list}`}
      className="inline-flex items-center gap-1 text-sm text-primary no-underline hover:underline"
    >
      <ArrowLeft size={14} className="rtl:rotate-180" />
      {t("common:actions.backToSessions")}
    </AppLink>
  );

  if (Number.isNaN(testSessionId)) {
    return (
      <Centered>
        {t("testSessions:results.loadError")}
        {backLink}
      </Centered>
    );
  }

  if (isAdmin && studentsQuery.isLoading) {
    return (
      <Centered>
        <Loading />
      </Centered>
    );
  }

  if (isAdmin && students.length === 0) {
    return (
      <Centered>
        {t("testSessions:results.noStudents")}
        {backLink}
      </Centered>
    );
  }

  if (isAdmin && finishedStudents.length === 0) {
    return (
      <Centered>
        {t("testSessions:results.noFinishedResults")}
        {backLink}
      </Centered>
    );
  }

  const lockedData = (
    resultsQuery.error as AxiosError<{ code?: string; availableAt?: string }>
  )?.response?.data;
  const lockedUntil =
    lockedData?.code === "RESULTS_NOT_AVAILABLE"
      ? (lockedData.availableAt ?? "")
      : null;

  const average =
    finishedStudents.length > 0
      ? Math.round(
          finishedStudents.reduce((sum, s) => sum + s.percentage, 0) /
            finishedStudents.length,
        )
      : 0;
  const scores = finishedStudents.map((s) => s.percentage);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-3xl font-bold">
          {t("testSessions:results.title")}
        </h1>
        {backLink}
      </div>

      {isAdmin && (
        <Card>
          <CardContent className="flex flex-col gap-4 pt-6">
            <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
              <Stat
                label={t("testSessions:results.finishedCount")}
                value={`${finishedStudents.length} / ${students.length}`}
              />
              <Stat
                label={t("testSessions:results.average")}
                value={`${average}%`}
                className={scoreTone(average)}
              />
              <Stat
                label={t("testSessions:results.highest")}
                value={`${Math.max(...scores)}%`}
              />
              <Stat
                label={t("testSessions:results.lowest")}
                value={`${Math.min(...scores)}%`}
              />
            </div>

            <div className="flex flex-wrap gap-2">
              {students.map((student) => {
                const isActive = student.id === studentId;
                const finished = student.status === "FINISHED";
                return (
                  <button
                    key={student.id}
                    type="button"
                    disabled={!finished}
                    aria-pressed={isActive}
                    onClick={() => selectStudent(student)}
                    className={cn(
                      "px-3 py-2 rounded-lg text-sm border transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary",
                      isActive
                        ? "bg-primary text-primary-foreground border-primary shadow-sm"
                        : finished
                          ? "text-foreground border-border hover:bg-secondary hover:border-primary/40"
                          : "text-muted-foreground border-border opacity-60 cursor-not-allowed",
                    )}
                  >
                    <span className="font-medium">
                      {student.fullName || student.username}
                    </span>
                    {finished ? (
                      <span
                        className={cn(
                          "ms-2 text-xs font-semibold tabular-nums",
                          isActive ? "" : scoreTone(student.percentage),
                        )}
                      >
                        {student.percentage}%
                      </span>
                    ) : (
                      <span className="ms-2 text-xs uppercase">
                        {t(STUDENT_TEST_SESSION_STATUS_TITLES[student.status])}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {resultsQuery.isLoading ? (
        <Centered>
          <Loading />
        </Centered>
      ) : lockedUntil ? (
        <ResultsLocked availableAt={lockedUntil} />
      ) : resultsQuery.isError || !resultsQuery.data ? (
        <Centered>
          <p>{t("testSessions:results.loadError")}</p>
          {resultsQuery.error?.message && (
            <p className="text-xs">{resultsQuery.error.message}</p>
          )}
        </Centered>
      ) : (
        <ResultDetails data={resultsQuery.data} />
      )}
    </div>
  );
}

function ResultsLocked({ availableAt }: { availableAt: string }) {
  const { t } = useTranslation(["testSessions"]);
  const queryClient = useQueryClient();
  const [now, setNow] = useState(() => Date.now());
  const target = availableAt ? new Date(availableAt).getTime() : 0;

  useEffect(() => {
    const timer = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(timer);
  }, []);

  const due = target > 0 && now >= target;

  // when the session end passes, try again (the server cron closes it within ~10s)
  useEffect(() => {
    if (!due) return;
    const retry = setInterval(
      () =>
        queryClient.invalidateQueries({ queryKey: testSessionsQueryKeys.all }),
      12_000,
    );
    return () => clearInterval(retry);
  }, [due, queryClient]);

  const left = Math.max(0, Math.floor((target - now) / 1000));
  const h = Math.floor(left / 3600);
  const m = Math.floor((left % 3600) / 60);
  const s = left % 60;
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <Card>
      <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
        <div className="flex size-14 items-center justify-center rounded-full bg-success/15 text-success">
          <Lock size={26} />
        </div>
        <h2 className="text-xl font-semibold">
          {t("testSessions:results.lockedTitle")}
        </h2>
        <p className="max-w-md text-sm text-muted-foreground">
          {t("testSessions:results.lockedMessage")}
        </p>
        {target > 0 && (
          <>
            <div className="text-3xl font-bold tabular-nums" role="timer">
              {left > 0
                ? `${h > 0 ? `${h}:` : ""}${pad(m)}:${pad(s)}`
                : t("testSessions:results.lockedSoon")}
            </div>
            <div className="text-xs text-muted-foreground">
              {t("testSessions:results.availableAt", {
                time: dateFormatter(availableAt),
              })}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function Stat({
  label,
  value,
  className,
}: {
  label: string;
  value: React.ReactNode;
  className?: string;
}) {
  return (
    <div className="rounded-lg bg-secondary/60 p-4">
      <div className="text-xs uppercase text-muted-foreground">{label}</div>
      <div className={cn("text-xl font-semibold tabular-nums", className)}>
        {value}
      </div>
    </div>
  );
}

function ResultDetails({
  data,
}: {
  data: NonNullable<ReturnType<typeof useTestSessionResults>["data"]>;
}) {
  const { t } = useTranslation(["common", "testSessions"]);
  const percentage = percentOf(data.studentPoints, data.points);
  const outcomes = data.questions.map(questionOutcome);
  const count = (o: string) => outcomes.filter((x) => x === o).length;

  return (
    <>
      <Card>
        <CardContent className="grid gap-4 pt-6 md:grid-cols-[auto_1fr] md:items-center">
          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex size-24 shrink-0 flex-col items-center justify-center rounded-full border-8",
                percentage >= 85
                  ? "border-success/30"
                  : percentage >= 50
                    ? "border-warning/30"
                    : "border-destructive/30",
              )}
            >
              <span
                className={cn(
                  "text-2xl font-bold tabular-nums",
                  scoreTone(percentage),
                )}
              >
                {percentage}%
              </span>
            </div>
            <div>
              <div className="text-xs uppercase text-muted-foreground">
                {data.subject.name}
              </div>
              <div className="text-lg font-semibold tabular-nums">
                {t("testSessions:results.pointsOf", {
                  got: pts(data.studentPoints),
                  total: pts(data.points),
                })}
              </div>
              {data.studentTestSession?.finishedAt && (
                <div className="text-xs text-muted-foreground">
                  {t("testSessions:results.submittedAt", {
                    time: dateFormatter(data.studentTestSession.finishedAt),
                  })}
                </div>
              )}
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <Stat
              label={t("testSessions:results.correct")}
              value={count("correct")}
              className="text-success"
            />
            <Stat
              label={t("testSessions:results.partial")}
              value={count("partial")}
              className="text-warning"
            />
            <Stat
              label={t("testSessions:results.wrong")}
              value={count("wrong")}
              className="text-destructive"
            />
            <Stat
              label={t("testSessions:results.unanswered")}
              value={count("unanswered")}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {data.questions.map((question, qIndex) => (
          <ResultQuestion
            key={question.id}
            question={question}
            index={qIndex}
            outcome={outcomes[qIndex]}
          />
        ))}
      </div>
    </>
  );
}

function ResultQuestion({
  question,
  index,
  outcome,
}: {
  question: ResultQuestionDto;
  index: number;
  outcome: ReturnType<typeof questionOutcome>;
}) {
  const { t } = useTranslation(["common", "testSessions"]);
  const answeredAt = question.studentAnswers?.find((a) => a.answer)?.answeredAt;
  const hasBlanks = Boolean(question.completeQuestion?.text.includes(";;;;"));

  const OutcomeIcon =
    outcome === "correct"
      ? CheckCircle2
      : outcome === "unanswered"
        ? CircleMinus
        : XCircle;

  return (
    <Card className={OUTCOME_STYLES[outcome]}>
      <CardContent className="pt-6 flex flex-col gap-3">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm font-bold text-muted-foreground">
            {t("testSessions:results.q", { n: index + 1 })}
          </span>
          <QuestionTypeBadge type={question.type} />
          <span
            className={cn(
              "ms-auto flex items-center gap-1 text-sm font-semibold tabular-nums",
              outcome === "correct"
                ? "text-success"
                : outcome === "partial"
                  ? "text-warning"
                  : outcome === "wrong"
                    ? "text-destructive"
                    : "text-muted-foreground",
            )}
          >
            <OutcomeIcon size={16} />
            {pts(question.studentPoints)} / {pts(question.points)}
          </span>
        </div>
        <div className="font-medium">{question.text}</div>

        {question.type === "CHOOSE" && question.answers?.length ? (
          <ChooseResult question={question} />
        ) : hasBlanks ? (
          <BlanksResult question={question} />
        ) : question.type === "DRAG_DROP" && question.answers?.length ? (
          <OrderResult question={question} />
        ) : null}

        {outcome === "unanswered" && (
          <div className="text-xs text-muted-foreground">
            {t("testSessions:results.notAnswered")}
          </div>
        )}

        {answeredAt && (
          <div className="text-xs text-muted-foreground">
            {t("testSessions:results.answeredAt", {
              time: dateFormatter(answeredAt),
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ChooseResult({ question }: { question: ResultQuestionDto }) {
  const { t } = useTranslation(["testSessions"]);
  const chosenId = question.studentAnswers?.find((a) => a.answer)?.answer?.id;

  return (
    <div className="flex flex-col gap-2 mt-1">
      {[...(question.answers ?? [])]
        .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
        .map((answer, aIndex) => {
          const isRight = Boolean(answer.isCorrect);
          const isChosen = chosenId === answer.id;

          return (
            <div
              key={answer.id}
              className={cn(
                "px-3 py-2 rounded-lg text-sm border flex flex-wrap items-center gap-2",
                isRight
                  ? "bg-success/10 border-success/40"
                  : isChosen
                    ? "bg-destructive/10 border-destructive/40"
                    : "border-border",
              )}
            >
              <span className="text-muted-foreground">
                {String.fromCharCode(65 + aIndex)}.
              </span>
              <span className="flex-1">{answer.text}</span>
              {isChosen && (
                <span
                  className={cn(
                    "text-xs font-medium",
                    isRight ? "text-success" : "text-destructive",
                  )}
                >
                  {t("testSessions:results.yourAnswer")}
                </span>
              )}
              {isRight && (
                <span className="text-xs text-success">
                  {t("testSessions:results.correctAnswer")}
                </span>
              )}
            </div>
          );
        })}
    </div>
  );
}

function BlanksResult({ question }: { question: ResultQuestionDto }) {
  const { t } = useTranslation(["testSessions"]);
  const answers = question.answers ?? [];
  const segments = (question.completeQuestion?.text ?? "").split(";;;;");

  return (
    <div className="mt-1 flex flex-col gap-3">
      <div className="rounded-lg border border-border p-3 text-sm leading-9">
        {segments.map((segment, blankIndex) => {
          const position = blankIndex + 1;
          const placed = question.studentAnswers?.find(
            (sa) => sa.answerIndex === position && sa.answer?.id != null,
          );
          const expected = answers.find((a) => a.correctIndex === position);
          const isCorrect = placed?.answer?.correctIndex === position;

          return (
            <span key={blankIndex}>
              {segment}
              {blankIndex < segments.length - 1 && (
                <span className="mx-1 inline-flex flex-wrap items-baseline gap-1">
                  <span
                    className={cn(
                      "inline-flex min-w-16 items-center justify-center rounded border-b-2 px-1.5",
                      placed
                        ? isCorrect
                          ? "border-success bg-success/10 text-success"
                          : "border-destructive bg-destructive/10 text-destructive line-through"
                        : "border-border text-muted-foreground",
                    )}
                  >
                    {placed?.answer?.text ?? "—"}
                  </span>
                  {!isCorrect && expected && (
                    <span className="text-xs font-medium text-success">
                      {expected.text}
                    </span>
                  )}
                </span>
              )}
            </span>
          );
        })}
      </div>
      <div className="text-xs text-muted-foreground">
        {t("testSessions:results.blanksLegend")}
      </div>
    </div>
  );
}

function OrderResult({ question }: { question: ResultQuestionDto }) {
  const { t } = useTranslation(["testSessions"]);
  const answers = question.answers ?? [];

  return (
    <div className="flex flex-col gap-2 mt-1">
      {[...answers]
        .sort((a, b) => (a.correctIndex ?? 0) - (b.correctIndex ?? 0))
        .map((answer) => {
          const placedIndex =
            question.studentAnswers?.find((sa) => sa.answer?.id === answer.id)
              ?.answerIndex ?? null;
          const isCorrect = placedIndex === answer.correctIndex;

          return (
            <div
              key={answer.id}
              className={cn(
                "px-3 py-2 rounded-lg text-sm border flex items-center gap-3",
                isCorrect
                  ? "bg-success/10 border-success/40"
                  : placedIndex !== null
                    ? "bg-destructive/10 border-destructive/40"
                    : "border-border",
              )}
            >
              <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold">
                {answer.correctIndex}
              </span>
              <span className="min-w-0 flex-1">{answer.text}</span>
              <span
                className={cn(
                  "shrink-0 text-xs",
                  isCorrect
                    ? "text-success"
                    : placedIndex !== null
                      ? "text-destructive"
                      : "text-muted-foreground",
                )}
              >
                {isCorrect
                  ? t("testSessions:results.correctPosition")
                  : placedIndex !== null
                    ? t("testSessions:results.placedAt", {
                        position: placedIndex,
                      })
                    : t("testSessions:results.notPlaced")}
              </span>
            </div>
          );
        })}
    </div>
  );
}
