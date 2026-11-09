import { useTranslation } from "react-i18next";
import { CalendarClock, Clock3, Radio, Users } from "lucide-react";
import { cn } from "cn";
import { dateFormatter } from "@/shared/utils";
import { formatIn, useNow } from "@/shared/hooks";
import ItemCard from "@/shared/components/custom/views/ItemCard";
import { Skeleton } from "@/shared/components/ui/skeleton";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import TestSessionStatusBadge from "@/components/TestSessionStatusBadge";
import { useTestSessions } from "../api/get-test-sessions.api";
import { QueryTestSessionDto } from "../dtos/query-test-session.dto";
import type { TestSessionDto } from "../dtos/test-session.dto";

const time = (d: Date | string) => new Date(d).getTime();

/** Admin overview: what is live now, what is coming, what just happened. */
export default function SessionsBoard({
  actions,
}: {
  actions: TableAction<TestSessionDto>[];
}) {
  const { t } = useTranslation(["testSessions", "common"]);
  const now = useNow(1000);

  // shortcut: newest 100 sessions only; the table view pages through everything
  const query = useTestSessions({
    query: new QueryTestSessionDto({ perPage: 100 }),
    queryConfig: { refetchInterval: 15_000 },
  });
  const sessions = (query.data?.data ?? []).filter((s) => !s.deletedAt);

  const live = sessions.filter((s) => s.status === "STARTED");
  const upcoming = sessions
    .filter((s) => s.status === "PENDING")
    .sort((a, b) => time(a.startDate) - time(b.startDate));
  const past = sessions
    .filter((s) => s.status === "FINISHED" || s.status === "CANCELED")
    .sort((a, b) => time(b.finishDate) - time(a.finishDate));

  if (query.isPending)
    return (
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <Skeleton key={i} className="h-44 rounded-xl" />
        ))}
      </div>
    );

  const subtitle = (s: TestSessionDto) =>
    [s.subject?.name, `#${s.id}`].filter(Boolean).join(" · ");

  return (
    <div className="flex flex-col gap-8">
      <Section
        icon={<Radio size={16} className="text-success" />}
        title={t("testSessions:board.live")}
        count={live.length}
        empty={t("testSessions:board.noLive")}
      >
        {live.map((s) => {
          const total = time(s.finishDate) - time(s.startDate);
          const left = Math.max(0, time(s.finishDate) - now);
          const registered = s.registeredCount ?? 0;
          const done = s.finishedCount ?? 0;
          return (
            <ItemCard
              key={s.id}
              row={s}
              actions={actions}
              className="border-success/40 ring-1 ring-success/20"
              eyebrow={
                <>
                  <span className="relative flex size-2">
                    <span className="absolute inline-flex size-full animate-ping rounded-full bg-success opacity-75" />
                    <span className="relative inline-flex size-2 rounded-full bg-success" />
                  </span>
                  {subtitle(s)}
                </>
              }
              title={s.test.name}
            >
              <Meter
                label={t("testSessions:board.timeLeft")}
                value={
                  left > 0 ? formatIn(left) : t("testSessions:board.ending")
                }
                percent={total > 0 ? (left / total) * 100 : 0}
                tone={left < 5 * 60_000 ? "warning" : "primary"}
              />
              <Meter
                label={t("testSessions:board.submitted")}
                value={`${done} / ${registered}`}
                percent={registered > 0 ? (done / registered) * 100 : 0}
                tone="success"
              />
            </ItemCard>
          );
        })}
      </Section>

      <Section
        icon={<CalendarClock size={16} className="text-primary" />}
        title={t("testSessions:board.upcoming")}
        count={upcoming.length}
        empty={t("testSessions:board.noUpcoming")}
      >
        {upcoming.map((s) => (
          <ItemCard
            key={s.id}
            row={s}
            actions={actions}
            eyebrow={subtitle(s)}
            title={s.test.name}
            footer={
              <>
                <span className="flex items-center gap-1">
                  <Clock3 size={13} />
                  {dateFormatter(s.startDate)}
                </span>
                <span className="flex items-center gap-1">
                  <Users size={13} />
                  {t("testSessions:board.registered", {
                    count: s.registeredCount ?? 0,
                  })}
                </span>
              </>
            }
          >
            <div className="text-2xl font-bold tabular-nums text-primary">
              {time(s.startDate) > now
                ? t("testSessions:student.startsIn", {
                    time: formatIn(time(s.startDate) - now),
                  })
                : t("testSessions:board.startingNow")}
            </div>
          </ItemCard>
        ))}
      </Section>

      <Section
        title={t("testSessions:board.past")}
        count={past.length}
        empty={t("testSessions:board.noPast")}
      >
        {past.slice(0, 12).map((s) => (
          <ItemCard
            key={s.id}
            row={s}
            actions={actions}
            eyebrow={
              <>
                <TestSessionStatusBadge status={s.status} />
                {subtitle(s)}
              </>
            }
            title={s.test.name}
            footer={
              <>
                <span>{dateFormatter(s.finishDate)}</span>
                <span className="flex items-center gap-1">
                  <Users size={13} />
                  {t("testSessions:board.submittedOf", {
                    done: s.finishedCount ?? 0,
                    total: s.registeredCount ?? 0,
                  })}
                </span>
              </>
            }
          />
        ))}
      </Section>
      {past.length > 12 && (
        <p className="-mt-4 text-center text-xs text-muted-foreground">
          {t("testSessions:board.morePast", { count: past.length - 12 })}
        </p>
      )}
    </div>
  );
}

function Section({
  icon,
  title,
  count,
  empty,
  children,
}: {
  icon?: React.ReactNode;
  title: string;
  count: number;
  empty: string;
  children: React.ReactNode;
}) {
  return (
    <section className="flex flex-col gap-3">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        {icon}
        {title}
        <span className="rounded-full bg-secondary px-2 py-0.5 text-xs font-semibold text-secondary-foreground">
          {count}
        </span>
      </h2>
      {count === 0 ? (
        <p className="rounded-xl border border-dashed px-4 py-6 text-center text-sm text-muted-foreground">
          {empty}
        </p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {children}
        </div>
      )}
    </section>
  );
}

function Meter({
  label,
  value,
  percent,
  tone,
}: {
  label: string;
  value: string;
  percent: number;
  tone: "primary" | "success" | "warning";
}) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex justify-between text-xs">
        <span className="text-muted-foreground">{label}</span>
        <span className="font-semibold tabular-nums">{value}</span>
      </div>
      <div className="h-1.5 overflow-hidden rounded-full bg-secondary">
        <div
          className={cn(
            "h-full rounded-full transition-all",
            tone === "success"
              ? "bg-success"
              : tone === "warning"
                ? "bg-warning"
                : "bg-primary",
          )}
          style={{ width: `${Math.min(100, Math.max(0, percent))}%` }}
        />
      </div>
    </div>
  );
}
