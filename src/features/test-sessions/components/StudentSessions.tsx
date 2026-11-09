import type { ReactNode } from "react";
import { formatIn, useNow } from "@/shared/hooks";
import {
  BarChart3,
  CalendarClock,
  CheckCircle2,
  Clock3,
  Lock,
  Play,
  UserPlus,
  XCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Button } from "@/shared/components/ui/button";
import { dateFormatter } from "@/shared/utils";
import TestSessionStatusBadge from "@/components/TestSessionStatusBadge";
import type { TestSessionDto } from "../dtos/test-session.dto";

export type StudentSessionsProps = {
  data: TestSessionDto[];
  /** id of the session whose action is in flight */
  pendingId?: number | null;
  onRegister: (session: TestSessionDto) => void;
  onStart: (session: TestSessionDto) => void;
  onResults: (session: TestSessionDto) => void;
};

export default function StudentSessions({
  data,
  pendingId,
  onRegister,
  onStart,
  onResults,
}: StudentSessionsProps) {
  const { t } = useTranslation(["common", "testSessions"]);
  const now = useNow();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
      {data.map((session) => {
        const busy = pendingId === session.id;
        const full = "w-full flex items-center justify-center gap-2";

        const note = (icon: ReactNode, text: string, className = "") => (
          <div
            className={`w-full flex items-center justify-center gap-2 rounded-md border border-dashed px-3 py-2 text-sm ${className}`}
          >
            {icon}
            {text}
          </div>
        );

        // What this student can do depends on the session AND their own registration.
        let action: ReactNode;
        const sessionOver =
          session.status === "FINISHED" || session.status === "CANCELED";
        if (session.myStatus === "FINISHED" && !sessionOver) {
          // results are released when the session ends (anti-cheating)
          action = note(
            <Lock size={16} />,
            t("testSessions:student.submittedWaiting", {
              time: dateFormatter(session.finishDate),
            }),
            "border-success/40 text-success",
          );
        } else if (session.myStatus === "FINISHED") {
          action = (
            <Button
              variant="outline-info"
              className={full}
              onClick={() => onResults(session)}
            >
              <BarChart3 size={16} />
              {t("common:actions.viewResults")}
            </Button>
          );
        } else if (session.status === "PENDING") {
          action =
            session.myStatus === "PENDING" ? (
              note(
                <CheckCircle2 size={16} />,
                t("testSessions:student.registered"),
                "border-success/40 text-success",
              )
            ) : (
              <Button
                className={full}
                onClick={() => onRegister(session)}
                disabled={busy}
              >
                <UserPlus size={16} />
                {t("testSessions:actions.register")}
              </Button>
            );
        } else if (
          session.status === "STARTED" &&
          (session.myStatus === "PENDING" || session.myStatus === "STARTED")
        ) {
          action = (
            <Button
              variant="success"
              className={full}
              onClick={() => onStart(session)}
              disabled={busy}
            >
              <Play size={16} />
              {session.myStatus === "STARTED"
                ? t("testSessions:actions.continue")
                : t("testSessions:actions.start")}
            </Button>
          );
        } else if (session.status === "STARTED") {
          action = note(
            <Clock3 size={16} />,
            t("testSessions:student.registrationClosed"),
            "text-muted-foreground",
          );
        } else if (session.status === "CANCELED") {
          action = note(
            <XCircle size={16} />,
            t("testSessions:student.canceled"),
            "text-muted-foreground",
          );
        } else {
          action = note(
            <XCircle size={16} />,
            t("testSessions:student.missed"),
            "text-muted-foreground",
          );
        }

        return (
          <Card
            key={session.id}
            className={`transition-shadow hover:shadow-lg ${
              session.status === "STARTED" && session.myStatus
                ? "ring-2 ring-success/40"
                : ""
            }`}
          >
            <CardContent className="flex h-full flex-col gap-3 pt-6">
              <div className="flex items-center justify-between gap-2">
                <TestSessionStatusBadge status={session.status} />
                {session.status === "PENDING" &&
                new Date(session.startDate).getTime() > now ? (
                  <span className="text-xs font-medium text-muted-foreground tabular-nums">
                    {t("testSessions:student.startsIn", {
                      time: formatIn(
                        new Date(session.startDate).getTime() - now,
                      ),
                    })}
                  </span>
                ) : session.status === "STARTED" &&
                  new Date(session.finishDate).getTime() > now ? (
                  <span className="text-xs font-medium text-success tabular-nums">
                    {t("testSessions:student.endsIn", {
                      time: formatIn(
                        new Date(session.finishDate).getTime() - now,
                      ),
                    })}
                  </span>
                ) : (
                  <span className="text-xs text-muted-foreground">
                    #{session.id}
                  </span>
                )}
              </div>

              <div>
                {session.subject && (
                  <div className="text-xs font-medium uppercase text-muted-foreground">
                    {session.subject.name}
                  </div>
                )}
                <div className="text-lg font-semibold">{session.test.name}</div>
                <div className="text-sm text-muted-foreground">
                  {t("testSessions:student.duration", {
                    count: session.test.period ?? "—",
                  })}
                </div>
              </div>

              <div className="flex flex-col gap-1 text-sm">
                <div className="flex justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-muted-foreground">
                    <CalendarClock size={14} />
                    {t("testSessions:student.starts")}
                  </span>
                  <span className="text-end">
                    {dateFormatter(session.startDate)}
                  </span>
                </div>
                <div className="flex justify-between gap-2">
                  <span className="text-muted-foreground ps-5">
                    {t("testSessions:student.ends")}
                  </span>
                  <span className="text-end">
                    {dateFormatter(session.finishDate)}
                  </span>
                </div>
              </div>

              <div className="mt-auto pt-2">{action}</div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
