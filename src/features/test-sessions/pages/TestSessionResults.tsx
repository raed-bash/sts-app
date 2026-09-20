import { useEffect, useMemo } from "react";
import { useParams, useSearchParams } from "react-router";
import { testSessionsPaths } from "../test-sessions.paths";
import { useTestSessionResults } from "../api/get-test-session-results.api";
import { useTestSessionStudents } from "../api/get-test-session-students.api";
import { Card, CardContent } from "@/shared/components/ui/card";
import Loading from "@/shared/components/custom/loading/Loading";
import QuestionTypeBadge from "@/components/QuestionTypeBadge";
import { useRole } from "@/hooks/useRole";
import { dateFormatter } from "@/shared/utils";
import { cn } from "cn";
import type { SessionStudentResultDto } from "../dtos/session-student-result.dto";

export default function TestSessionResults() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const role = useRole();
  const isAdmin = role === "SUPER_ADMIN";

  const testSessionId = Number(id);
  const studentIdParam = searchParams.get("studentId");
  const studentId = studentIdParam ? Number(studentIdParam) : undefined;

  const studentsQuery = useTestSessionStudents({
    id: testSessionId,
    queryConfig: { enabled: isAdmin && Number.isFinite(testSessionId) },
  });
  const students = useMemo(
    () => studentsQuery.data ?? [],
    [studentsQuery.data],
  );

  useEffect(() => {
    if (!isAdmin || studentIdParam) return;
    const finished = students.find((s) => s.status === "FINISHED");
    if (finished) {
      setSearchParams({ studentId: String(finished.id) }, { replace: true });
    }
  }, [isAdmin, studentIdParam, students, setSearchParams]);

  const resultsQuery = useTestSessionResults({
    id: testSessionId,
    studentId,
    queryConfig: {
      enabled:
        Number.isFinite(testSessionId) && (isAdmin ? Boolean(studentId) : true),
    },
  });

  const selectStudent = (student: SessionStudentResultDto) => {
    setSearchParams({ studentId: String(student.id) }, { replace: true });
  };

  if (isAdmin && studentsQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  if (resultsQuery.isLoading) {
    return (
      <div className="flex justify-center py-20">
        <Loading />
      </div>
    );
  }

  const data = resultsQuery.data;

  if (isAdmin && students.length === 0) {
    return (
      <div className="text-center text-(--text-muted) py-20">
        No students are registered in this test session.
      </div>
    );
  }

  if (resultsQuery.isError || !data || Number.isNaN(testSessionId)) {
    return (
      <div className="text-center text-(--text-muted) py-20">
        Unable to load results for this test session.
      </div>
    );
  }

  if (isAdmin && !studentIdParam) {
    return (
      <div className="text-center text-(--text-muted) py-20">
        No finished results yet.
      </div>
    );
  }

  const percentage =
    data.points > 0 ? Math.round((data.studentPoints / data.points) * 100) : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Test Results</h1>
        <a
          href={`/${testSessionsPaths.list}`}
          className="text-sm text-(--primary) no-underline hover:underline"
        >
          Back to sessions
        </a>
      </div>

      {isAdmin && (
        <div className="flex flex-wrap gap-2">
          {students.map((student) => {
            const isActive = student.id === studentId;
            const finished = student.status === "FINISHED";
            return (
              <button
                key={student.id}
                type="button"
                disabled={!finished}
                onClick={() => selectStudent(student)}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm border transition-all duration-200 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-(--primary)",
                  isActive
                    ? "bg-(--primary) text-white border-(--primary) shadow-sm hover:bg-(--primary-hover) hover:border-(--primary-hover)"
                    : finished
                      ? "bg-(--secondary)/10 text-(--text) border-(--border) hover:bg-(--primary)/10 hover:border-(--primary)/40"
                      : "bg-(--secondary)/5 text-(--text-muted) border-(--border) opacity-60 cursor-not-allowed",
                )}
              >
                <span className="font-medium">
                  {student.fullName || student.username}
                </span>
                {finished ? (
                  <span
                    className={cn(
                      "ms-2 text-xs rounded-full px-2 py-0.5",
                      isActive
                        ? "bg-white/20 text-white"
                        : "bg-(--success)/15 text-(--success)",
                    )}
                  >
                    {student.studentPoints}/{student.points} (
                    {student.percentage}
                    %)
                  </span>
                ) : (
                  <span className="ms-2 text-xs text-(--text-muted) uppercase">
                    {student.status}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}

      <Card>
        <CardContent className="pt-6 grid md:grid-cols-4 gap-4">
          <div className="p-4 rounded-lg bg-(--secondary)/10">
            <div className="text-xs text-(--text-muted) uppercase">Subject</div>
            <div className="text-lg font-semibold">{data.subject.name}</div>
          </div>
          <div className="p-4 rounded-lg bg-(--secondary)/10">
            <div className="text-xs text-(--text-muted) uppercase">
              Total points
            </div>
            <div className="text-lg font-semibold">{data.points}</div>
          </div>
          <div className="p-4 rounded-lg bg-(--success)/10">
            <div className="text-xs text-(--text-muted) uppercase">
              Student points
            </div>
            <div className="text-lg font-semibold text-(--success)">
              {data.studentPoints}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-(--primary)/10">
            <div className="text-xs text-(--text-muted) uppercase">Score</div>
            <div className="text-lg font-semibold text-(--primary)">
              {percentage}%
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex flex-col gap-4">
        {data.questions.map((question, qIndex) => {
          const answeredAt = question.studentAnswers?.[0]?.answeredAt;

          return (
            <Card key={question.id}>
              <CardContent className="pt-6 flex flex-col gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-(--text-muted)">
                    Q{qIndex + 1}
                  </span>
                  <QuestionTypeBadge type={question.type} />
                  <span className="text-xs text-(--text-muted)">
                    {question.points} pts
                  </span>
                  <span className="ms-auto text-xs font-semibold text-(--success)">
                    +{question.studentPoints}
                  </span>
                </div>
                <div className="font-medium">{question.text}</div>

                {question.type === "CHOOSE" && question.answers?.length ? (
                  <div className="flex flex-col gap-2 mt-2">
                    {question.answers.map((answer) => {
                      const isRightAnswer = answer.isCorrect;

                      const isStudentAnswer =
                        question.studentAnswers?.[0]?.answer?.id === answer.id;

                      return (
                        <div
                          key={answer.id}
                          className={`px-3 py-2 rounded-lg text-sm border ${
                            isRightAnswer
                              ? "bg-(--success)/10 border-(--success)/40"
                              : isStudentAnswer && !isRightAnswer
                                ? "bg-(--danger)/10 border-(--danger)/40"
                                : "bg-(--secondary)/5 border-(--border)"
                          }`}
                        >
                          <span className="me-2 text-(--text-muted)">
                            {answer.order}.
                          </span>
                          {answer.text}
                          {isRightAnswer && (
                            <span className="ms-2 text-xs text-(--success)">
                              Correct answer
                            </span>
                          )}
                          {isStudentAnswer && !isRightAnswer && (
                            <span className="ms-2 text-xs text-(--danger)">
                              Your answer
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : question.type === "DRAG_DROP" &&
                  question.answers?.length ? (
                  <div className="flex flex-col gap-2 mt-2">
                    <div className="text-xs text-(--text-muted)">
                      Correct order:{" "}
                      {[...question.answers]
                        .sort(
                          (a, b) =>
                            (a.correctIndex ?? 0) - (b.correctIndex ?? 0),
                        )
                        .map((answer, index) => `${index + 1}. ${answer.text}`)
                        .join("  ")}
                    </div>
                    {question.answers.map((answer) => {
                      const placed = question.studentAnswers?.find(
                        (studentAnswer) =>
                          studentAnswer.answer?.id === answer.id,
                      );
                      const placedIndex = placed?.answerIndex ?? null;
                      const isAtCorrectPosition =
                        placedIndex === answer.correctIndex;

                      return (
                        <div
                          key={answer.id}
                          className={`px-3 py-2 rounded-lg text-sm border flex items-center gap-3 ${
                            isAtCorrectPosition
                              ? "bg-(--success)/10 border-(--success)/40"
                              : placedIndex !== null
                                ? "bg-(--danger)/10 border-(--danger)/40"
                                : "bg-(--secondary)/5 border-(--border)"
                          }`}
                        >
                          <span className="inline-flex size-6 shrink-0 items-center justify-center rounded-full bg-(--secondary)/15 text-xs font-bold">
                            {placedIndex !== null ? placedIndex + 1 : "–"}
                          </span>
                          <span className="min-w-0 flex-1">{answer.text}</span>
                          {isAtCorrectPosition ? (
                            <span className="ms-2 shrink-0 text-xs text-(--success)">
                              Correct position
                            </span>
                          ) : placedIndex !== null ? (
                            <span className="ms-2 shrink-0 text-xs text-(--danger)">
                              Wrong position (correct:{" "}
                              {(answer.correctIndex ?? 0) + 1})
                            </span>
                          ) : (
                            <span className="ms-2 shrink-0 text-xs text-(--text-muted)">
                              Not placed
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                ) : question.type === "COMPLETE" ? (
                  <div className="mt-2 flex flex-col gap-3">
                    <div className="rounded-lg border border-(--border) bg-(--secondary)/5 p-3 text-sm leading-8">
                      {(question.completeQuestion?.text ?? question.text)
                        .split(";;;;")
                        .map((segment, blankIndex, segments) => {
                          const placed = question.studentAnswers?.find(
                            (studentAnswer) =>
                              studentAnswer.answerIndex === blankIndex &&
                              studentAnswer.answer?.id != null,
                          );
                          const isCorrect =
                            placed?.answer?.correctIndex === blankIndex;

                          return (
                            <span key={blankIndex}>
                              {segment}
                              {blankIndex < segments.length - 1 && (
                                <span
                                  className={cn(
                                    "mx-1 inline-flex min-w-20 items-center justify-center border-b-2 px-1 text-sm",
                                    placed
                                      ? isCorrect
                                        ? "border-(--success) text-(--success)"
                                        : "border-(--danger) text-(--danger)"
                                      : "border-(--border) text-(--text-muted)",
                                  )}
                                >
                                  {placed?.answer?.text ?? "—"}
                                </span>
                              )}
                            </span>
                          );
                        })}
                    </div>
                    <div className="flex flex-col gap-2">
                      {(question.answers ?? []).map((answer) => {
                        const placed = question.studentAnswers?.find(
                          (studentAnswer) =>
                            studentAnswer.answer?.id === answer.id,
                        );
                        const placedIndex = placed?.answerIndex ?? null;
                        const isInCorrectBlank =
                          placedIndex === answer.correctIndex;

                        return (
                          <div
                            key={answer.id}
                            className={`px-3 py-2 rounded-lg text-sm border ${
                              isInCorrectBlank
                                ? "bg-(--success)/10 border-(--success)/40"
                                : placedIndex !== null
                                  ? "bg-(--danger)/10 border-(--danger)/40"
                                  : "bg-(--secondary)/5 border-(--border)"
                            }`}
                          >
                            <span className="me-2 text-(--text-muted)">
                              {answer.order}.
                            </span>
                            {answer.text}
                            {isInCorrectBlank ? (
                              <span className="ms-2 text-xs text-(--success)">
                                Correct blank
                              </span>
                            ) : placedIndex !== null ? (
                              <span className="ms-2 text-xs text-(--danger)">
                                Wrong blank (correct:{" "}
                                {(answer.correctIndex ?? 0) + 1})
                              </span>
                            ) : (
                              <span className="ms-2 text-xs text-(--text-muted)">
                                Not used
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ) : null}

                {answeredAt && (
                  <div className="text-xs text-(--text-muted)">
                    Answered at {dateFormatter(answeredAt)}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
