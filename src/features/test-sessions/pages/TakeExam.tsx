import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router";
import { testSessionsPaths } from "../test-sessions.paths";
import { CheckCircle2, Clock3, Send } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "cn";

import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import Loading from "@/shared/components/custom/skeleton/Loading";
import QuestionTypeBadge from "@/components/QuestionTypeBadge";

import { useExamTestSession } from "../api/get-exam-test-session.api";
import { useSubmitTestSession } from "../api/submit-test-session.api";
import type {
  ExamAnswerDto,
  ExamQuestionDto,
} from "../dtos/exam-test-session.dto";

type AnswerState = Record<number, (number | null)[]>;

function initAnswerState(questions: ExamQuestionDto[]): AnswerState {
  const state: AnswerState = {};

  for (const question of questions) {
    if (question.type === "DRAG_DROP") {
      const blanks = question.completeQuestion
        ? question.completeQuestion.text.split(";;;;").length - 1
        : 0;
      state[question.id] =
        blanks > 0
          ? Array.from({ length: blanks }, () => null)
          : question.answers.map((answer) => answer.id);
    } else if (question.type === "COMPLETE") {
      const blanks = question.completeQuestion
        ? question.completeQuestion.text.split(";;;;").length - 1
        : 0;
      state[question.id] = Array.from({ length: blanks }, () => null);
    } else {
      state[question.id] = [];
    }
  }

  return state;
}

function formatTime(totalSeconds: number): string {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;

  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

export default function TakeExam() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const testSessionId = Number(id);

  const examQuery = useExamTestSession({
    id: testSessionId,
    queryConfig: { enabled: Number.isFinite(testSessionId) },
  });

  const exam = examQuery.data;

  const [answers, setAnswers] = useState<AnswerState>({});
  const answersRef = useRef<AnswerState>({});

  useEffect(() => {
    answersRef.current = answers;
  }, [answers]);

  useEffect(() => {
    if (exam) setAnswers(initAnswerState(exam.questions));
  }, [exam]);

  const totalSeconds = useMemo(
    () => (exam ? Math.floor((exam.test.period || 0) * 60) : 0),
    [exam],
  );

  const [remaining, setRemaining] = useState(totalSeconds);

  const submitFnRef = useRef<() => void>(() => {});

  useEffect(() => {
    if (!exam?.startedAt) return;
    setRemaining(totalSeconds);

    const deadline = new Date(exam.startedAt).getTime() + totalSeconds * 1000;

    const timer = setInterval(() => {
      const left = Math.max(0, Math.floor((deadline - Date.now()) / 1000));
      setRemaining(left);
      if (left === 0 && totalSeconds > 0) submitFnRef.current();
    }, 1000);

    return () => clearInterval(timer);
  }, [exam?.startedAt, totalSeconds, exam]);

  const submitMutation = useSubmitTestSession({
    mutationConfig: {
      onSuccess: () => {
        toast.success("Answers submitted successfully");
        navigate(testSessionsPaths.resultsLink(testSessionId));
      },
      onError: () => {
        toast.error("Failed to submit answers");
      },
    },
  });

  const buildPayload = useCallback(
    (finalAnswers: AnswerState) => {
      const questions = Object.entries(finalAnswers)
        .filter(([, answerIds]) =>
          answerIds.some((answerId) => answerId !== null),
        )
        .map(([questionId, answerIds]) => ({
          questionId: Number(questionId),
          answers: answerIds
            .filter((answerId): answerId is number => answerId !== null)
            .map((answerId) => ({ answerId })),
        }));

      return { id: testSessionId, questions };
    },
    [testSessionId],
  );

  const submitRef = useRef(false);

  const submit = useCallback(
    (finalAnswers: AnswerState = answersRef.current) => {
      if (submitRef.current) return;
      submitRef.current = true;
      submitMutation.mutate(buildPayload(finalAnswers));
    },
    [buildPayload, submitMutation],
  );

  useEffect(() => {
    submitFnRef.current = submit;
  }, [submit]);

  const answeredCount = useMemo(
    () =>
      Object.values(answers).filter((answerIds) =>
        answerIds.some((answerId) => answerId !== null),
      ).length,
    [answers],
  );

  if (!Object.keys(answers).length) {
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
        <div className="text-(--text-muted)">
          Unable to load the exam. You may have already finished it or it has
          not started yet.
        </div>
        <Button variant="outline" onClick={() => navigate(`/${testSessionsPaths.list}`)}>
          Back to sessions
        </Button>
        <Button
          variant="outline-info"
          onClick={() => navigate(testSessionsPaths.resultsLink(testSessionId))}
        >
          View results
        </Button>
      </div>
    );
  }

  const progress =
    totalSeconds > 0
      ? Math.min(100, Math.round((remaining / totalSeconds) * 100))
      : 0;

  return (
    <div className="flex flex-col gap-6">
      <div className="sticky top-0 z-10 -mx-4 -mt-1 border-b bg-(--background) px-4 py-3 backdrop-blur">
        <div className="flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-xs text-(--text-muted) uppercase">
              {exam.subject.name}
            </div>
            <div className="text-lg font-bold">{exam.test.name}</div>
          </div>

          <div className="flex items-center gap-4">
            <div
              className={cn(
                "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-bold tabular-nums",
                remaining <= 60
                  ? "border-(--danger)/40 bg-(--danger)/10 text-(--danger)"
                  : "border-(--border) bg-(--secondary)/10",
              )}
            >
              <Clock3 size={16} />
              {formatTime(remaining)}
            </div>
            <Button
              className="flex items-center gap-2"
              disabled={submitMutation.isPending}
              onClick={() => submit()}
            >
              <Send size={16} />
              {submitMutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </div>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-(--secondary)/20">
          <div
            className="h-full rounded-full bg-(--primary) transition-all"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      <div className="text-sm text-(--text-muted)">
        {answeredCount} of {exam.questions.length} questions answered
      </div>

      <div className="flex flex-col gap-4">
        {exam.questions.map((question, qIndex) => (
          <ExamQuestionCard
            key={question.id}
            question={question}
            index={qIndex}
            value={answers[question.id]}
            onChange={(answerIds) => setQuestionAnswer(question.id, answerIds)}
          />
        ))}
      </div>

      <div className="sticky bottom-4 mt-2 flex items-center justify-center">
        <Button
          size="lg"
          variant="success"
          className="flex items-center gap-2"
          disabled={submitMutation.isPending}
          onClick={() => submit()}
        >
          <CheckCircle2 size={18} />
          Submit exam
        </Button>
      </div>
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
  const answered = value.some((answerId) => answerId !== null);

  return (
    <Card className={cn(answered && "border-(--success)/40")}>
      <CardContent className="pt-6 flex flex-col gap-3">
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-(--text-muted)">
            Q{index + 1}
          </span>
          <QuestionTypeBadge type={question.type} />
          <span className="text-xs text-(--text-muted)">
            {question.points} pts
          </span>
          {answered && (
            <CheckCircle2 size={16} className="ms-auto text-(--success)" />
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
            <CompleteAnswers
              question={question}
              value={value}
              onChange={onChange}
              dragMode
            />
          ) : (
            <DragDropAnswers
              answers={question.answers}
              value={value as number[]}
              onChange={onChange}
            />
          ))}

        {question.type === "COMPLETE" && (
          <CompleteAnswers
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
            onClick={() => onSelect(answer.id)}
            className={cn(
              "px-3 py-2 rounded-lg text-sm border text-left transition-colors",
              isSelected
                ? "bg-(--primary)/10 border-(--primary)"
                : "bg-(--secondary)/5 border-(--border) hover:bg-(--secondary)/10",
            )}
          >
            <span className="me-2 text-xs text-(--text-muted)">
              {String.fromCharCode(65 + index)}.
            </span>
            {answer.text}
          </button>
        );
      })}
    </div>
  );
}

function DragDropAnswers({
  answers,
  value,
  onChange,
}: {
  answers: ExamAnswerDto[];
  value: number[];
  onChange: (answerIds: number[]) => void;
}) {
  const [dragging, setDragging] = useState<number | null>(null);

  const move = (targetId: number) => {
    if (dragging === null || dragging === targetId) {
      setDragging(null);
      return;
    }

    const next = [...value];
    const fromIndex = next.indexOf(dragging);
    const toIndex = next.indexOf(targetId);

    if (fromIndex < 0 || toIndex < 0) {
      setDragging(null);
      return;
    }

    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onChange(next);
    setDragging(null);
  };

  return (
    <div>
      <div className="text-xs text-(--text-muted) mb-2">
        Drag the answers into the correct order.
      </div>
      <div className="flex flex-col gap-2">
        {value.map((answerId, position) => {
          const answer = answers.find((a) => a.id === answerId);
          if (!answer) return null;

          const isDragging = dragging === answerId;

          return (
            <div
              key={answerId}
              draggable
              onDragStart={() => setDragging(answerId)}
              onDragEnd={() => setDragging(null)}
              onDragOver={(event) => event.preventDefault()}
              onDrop={() => move(answerId)}
              className={cn(
                "px-3 py-2 rounded-lg text-sm border bg-(--secondary)/5 flex items-center gap-3 cursor-grab select-none transition-opacity",
                isDragging && "opacity-40",
                "border-(--border)",
              )}
            >
              <span className="flex size-6 items-center justify-center rounded-full bg-(--secondary)/15 text-xs font-bold">
                {position + 1}
              </span>
              {answer.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function CompleteAnswers({
  question,
  value,
  onChange,
  dragMode = false,
}: {
  question: ExamQuestionDto;
  value: (number | null)[];
  onChange: (answerIds: (number | null)[]) => void;
  dragMode?: boolean;
}) {
  const [active, setActive] = useState<number | null>(null);

  const template = question.completeQuestion?.text ?? "";
  const segments = template.split(";;;;");

  const place = (answerId: number) => {
    if (active === null) return;

    const next = [...value];
    next[active] = answerId;
    onChange(next);
  };

  const clearBlank = (blankIndex: number) => {
    const next = [...value];
    next[blankIndex] = null;
    onChange(next);
  };

  const isUsed = (answerId: number) => value.includes(answerId);

  return (
    <div className="flex flex-col gap-3">
      <div className="text-xs text-(--text-muted)">
        {dragMode
          ? "Drag an answer and drop it into the correct blank (or click a blank, then an answer)."
          : "Select a blank, then click an answer to fill it."}
      </div>

      <div className="rounded-lg border border-(--border) bg-(--secondary)/5 p-3 text-sm leading-8">
        {segments.map((segment, blankIndex) => (
          <span key={blankIndex}>
            {segment}
            {blankIndex < segments.length - 1 && (
              <button
                type="button"
                onDragOver={(event) => {
                  event.preventDefault();
                  setActive(blankIndex);
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  const dropped = Number(event.dataTransfer.getData("text/plain"));
                  if (Number.isInteger(dropped)) {
                    const next = [...value];
                    next[blankIndex] = dropped;
                    onChange(next);
                  }
                }}
                onClick={() =>
                  value[blankIndex] !== null
                    ? clearBlank(blankIndex)
                    : setActive(blankIndex)
                }
                className={cn(
                  "mx-1 inline-flex min-w-20 items-center justify-center border-b-2 px-1 text-sm",
                  value[blankIndex] !== null
                    ? "text-(--text) border-(--success)"
                    : cn(
                        "border-dashed border-(--border)",
                        active === blankIndex &&
                          "border-(--primary) text-(--primary)",
                      ),
                )}
              >
                {value[blankIndex] !== null
                  ? question.answers.find((a) => a.id === value[blankIndex])
                      ?.text
                  : active === blankIndex
                    ? "…"
                    : ""}
              </button>
            )}
          </span>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {question.answers.map((answer) => (
          <button
            key={answer.id}
            type="button"
            draggable
            onDragStart={(event) => {
              event.dataTransfer.setData("text/plain", String(answer.id));
              event.dataTransfer.effectAllowed = "move";
            }}
            disabled={isUsed(answer.id)}
            onClick={() => place(answer.id)}
            className={cn(
              "px-3 py-1.5 rounded-lg text-sm border",
              isUsed(answer.id)
                ? "opacity-40 bg-(--secondary)/5 border-(--border) cursor-not-allowed"
                : active !== null
                  ? "border-(--primary) bg-(--primary)/10 hover:bg-(--primary)/20"
                  : "border-(--border) bg-(--secondary)/5 hover:bg-(--secondary)/10",
            )}
          >
            {answer.text}
          </button>
        ))}
      </div>
    </div>
  );
}
