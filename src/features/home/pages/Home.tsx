import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Card, CardContent } from "@/shared/components/ui/card";
import { Skeleton } from "@/shared/components/ui/skeleton";
import {
  Users,
  BookOpen,
  FileText,
  HelpCircle,
  CalendarCheck,
  TrendingUp,
} from "lucide-react";
import { getUsersQueryOptions } from "@/features/users/api/get-users.api";
import { QueryUserDto } from "@/features/users/dtos/query-user.dto";
import { getSubjectsQueryOptions } from "@/features/subjects/api/get-subjects.api";
import { QuerySubjectDto } from "@/features/subjects/dtos/query-subject.dto";
import { getTestsQueryOptions } from "@/features/tests/api/get-tests.api";
import { QueryTestDto } from "@/features/tests/dtos/query-test.dto";
import { getQuestionsQueryOptions } from "@/features/questions/api/get-questions.api";
import { QueryQuestionDto } from "@/features/questions/dtos/query-question.dto";
import { getTestSessionsQueryOptions } from "@/features/test-sessions/api/get-test-sessions.api";
import { QueryTestSessionDto } from "@/features/test-sessions/dtos/query-test-session.dto";
import { useRole } from "@/hooks/useRole";
import { useAuthContext } from "@/contexts/AuthContext";
import { homePaths } from "../home.paths";
import { usersPaths } from "@/features/users/users.paths";
import { subjectsPaths } from "@/features/subjects/subjects.paths";
import { testsPaths } from "@/features/tests/tests.paths";
import { questionsPaths } from "@/features/questions/questions.paths";
import { answersPaths } from "@/features/answers/answers.paths";
import { testSessionsPaths } from "@/features/test-sessions/test-sessions.paths";
import { settingsPaths } from "@/features/settings/settings.paths";
import AppLink from "@/shared/components/custom/AppLink";

export default function Home() {
  const role = useRole();
  const { user } = useAuthContext();

  const { t } = useTranslation(["common", "home"]);

  const isStudent = role === "STUDENT";
  const staff = { enabled: !isStudent };

  const usersQuery = useQuery({
    ...getUsersQueryOptions(new QueryUserDto({})),
    ...staff,
  });
  const subjectsQuery = useQuery({
    ...getSubjectsQueryOptions(new QuerySubjectDto({})),
    ...staff,
  });
  const testsQuery = useQuery({
    ...getTestsQueryOptions(new QueryTestDto({})),
    ...staff,
  });
  const questionsQuery = useQuery({
    ...getQuestionsQueryOptions(new QueryQuestionDto({})),
    ...staff,
  });
  const sessionsQuery = useQuery(
    getTestSessionsQueryOptions(new QueryTestSessionDto({})),
  );

  const stats = isStudent
    ? [
        {
          Icon: CalendarCheck,
          color: "text-teal-500",
          label: t("entities.testSessions"),
          to: `/${testSessionsPaths.list}`,
          query: sessionsQuery,
        },
      ]
    : [
        {
          Icon: Users,
          color: "text-blue-500",
          label: t("entities.users"),
          to: `/${usersPaths.list}`,
          query: usersQuery,
        },
        {
          Icon: BookOpen,
          color: "text-green-500",
          label: t("entities.subjects"),
          to: `/${subjectsPaths.list}`,
          query: subjectsQuery,
        },
        {
          Icon: FileText,
          color: "text-purple-500",
          label: t("entities.tests"),
          to: `/${testsPaths.list}`,
          query: testsQuery,
        },
        {
          Icon: HelpCircle,
          color: "text-orange-500",
          label: t("entities.questions"),
          to: `/${questionsPaths.list}`,
          query: questionsQuery,
        },
        {
          Icon: CalendarCheck,
          color: "text-teal-500",
          label: t("entities.testSessions"),
          to: `/${testSessionsPaths.list}`,
          query: sessionsQuery,
        },
      ];

  const actionLinks = isStudent
    ? [
        {
          to: `/${testSessionsPaths.list}`,
          label: t("home:actions.myTestSessions"),
        },
        { to: `/${homePaths.home}`, label: t("home:dashboard") },
      ]
    : role === "TEACHER"
      ? []
      : [
          {
            to: `/${usersPaths.list}`,
            label: t("home:actions.usersManagement"),
          },
          {
            to: `/${subjectsPaths.list}`,
            label: t("home:actions.subjectsManagement"),
          },
          {
            to: `/${testsPaths.list}`,
            label: t("home:actions.testsManagement"),
          },
          {
            to: `/${questionsPaths.list}`,
            label: t("home:actions.questionsManagement"),
          },
          {
            to: `/${answersPaths.list}`,
            label: t("home:actions.answersManagement"),
          },
          {
            to: `/${testSessionsPaths.list}`,
            label: t("entities.testSessions"),
          },
          {
            to: `/${settingsPaths.settings}`,
            label: t("home:actions.systemSettings"),
          },
        ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">
          {isStudent
            ? t("home:welcome", {
                name: user?.username ?? t("home:fallbackStudent"),
              })
            : t("home:dashboard")}
        </h1>
        <p className="text-muted-foreground text-sm">
          {isStudent ? t("home:subtitle.student") : t("home:subtitle.default")}
        </p>
      </div>

      <div
        className={`grid grid-cols-2 ${isStudent ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-5"} gap-4`}
      >
        {stats.map(({ Icon, color, label, to, query }) => (
          <AppLink
            key={label}
            to={to}
            className="rounded-xl no-underline text-foreground focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none"
          >
            <Card className="h-full transition-all hover:-translate-y-0.5 hover:shadow-lg">
              <CardContent className="flex flex-col items-center gap-3 pt-6 pb-8">
                <div className={`p-3 rounded-full bg-current/10 ${color}`}>
                  <Icon size={28} />
                </div>
                <span className="text-sm font-medium text-muted-foreground text-center">
                  {label}
                </span>
                {query.isPending ? (
                  <Skeleton className="h-9 w-14" />
                ) : (
                  <span className="text-3xl font-bold tabular-nums">
                    {query.isError ? "—" : (query.data?.meta.total ?? 0)}
                  </span>
                )}
              </CardContent>
            </Card>
          </AppLink>
        ))}
      </div>

      {actionLinks.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp size={18} />
                {t("home:quickNav")}
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {actionLinks.map(({ to, label }) => (
                  <AppLink
                    key={to}
                    to={to}
                    className="p-3 rounded-lg border border-border hover:bg-secondary hover:text-secondary-foreground hover:border-primary/30 transition-colors no-underline text-foreground"
                  >
                    {label}
                  </AppLink>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
