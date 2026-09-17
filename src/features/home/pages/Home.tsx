import { useQuery } from "@tanstack/react-query";
import { Card, CardContent } from "@/shared/components/ui/card";
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

  const usersQuery = useQuery(getUsersQueryOptions(new QueryUserDto({})));
  const subjectsQuery = useQuery(
    getSubjectsQueryOptions(new QuerySubjectDto({})),
  );
  const testsQuery = useQuery(getTestsQueryOptions(new QueryTestDto({})));
  const questionsQuery = useQuery(
    getQuestionsQueryOptions(new QueryQuestionDto({})),
  );
  const sessionsQuery = useQuery(
    getTestSessionsQueryOptions(new QueryTestSessionDto({})),
  );

  const isStudent = role === "STUDENT";

  const stats = isStudent
    ? [
        {
          Icon: CalendarCheck,
          color: "text-teal-500",
          label: "Test Sessions",
          value: sessionsQuery.data?.meta.total ?? 0,
        },
      ]
    : [
        {
          Icon: Users,
          color: "text-blue-500",
          label: "Users",
          value: usersQuery.data?.meta.total ?? 0,
        },
        {
          Icon: BookOpen,
          color: "text-green-500",
          label: "Subjects",
          value: subjectsQuery.data?.meta.total ?? 0,
        },
        {
          Icon: FileText,
          color: "text-purple-500",
          label: "Tests",
          value: testsQuery.data?.meta.total ?? 0,
        },
        {
          Icon: HelpCircle,
          color: "text-orange-500",
          label: "Questions",
          value: questionsQuery.data?.meta.total ?? 0,
        },
        {
          Icon: CalendarCheck,
          color: "text-teal-500",
          label: "Test Sessions",
          value: sessionsQuery.data?.meta.total ?? 0,
        },
      ];

  const actionLinks = isStudent
    ? [
        { to: `/${testSessionsPaths.list}`, label: "My Test Sessions" },
        { to: `/${homePaths.home}`, label: "Dashboard" },
      ]
    : role === "TEACHER"
      ? []
      : [
          { to: `/${usersPaths.list}`, label: "Users Management" },
          { to: `/${subjectsPaths.list}`, label: "Subjects Management" },
          { to: `/${testsPaths.list}`, label: "Tests Management" },
          { to: `/${questionsPaths.list}`, label: "Questions Management" },
          { to: `/${answersPaths.list}`, label: "Answers Management" },
          { to: `/${testSessionsPaths.list}`, label: "Test Sessions" },
          { to: `/${settingsPaths.settings}`, label: "System Settings" },
        ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-bold mb-1">
          {isStudent ? `Welcome, ${user?.username ?? "student"}` : "Dashboard"}
        </h1>
        <p className="text-(--text-muted) text-sm">
          {isStudent
            ? "Register for upcoming test sessions and start them when they go live."
            : "Overview of the Student Testing System"}
        </p>
      </div>

      <div
        className={`grid grid-cols-2 ${isStudent ? "md:grid-cols-3" : "md:grid-cols-3 lg:grid-cols-5"} gap-4`}
      >
        {stats.map(({ Icon, color, label, value }) => (
          <Card key={label} className="transition-shadow hover:shadow-lg">
            <CardContent className="flex flex-col items-center gap-3 pt-6 pb-8">
              <div className={`p-3 rounded-full bg-(--secondary)/10 ${color}`}>
                <Icon size={28} />
              </div>
              <span className="text-sm font-medium text-(--text-muted)">
                {label}
              </span>
              <span className="text-3xl font-bold">{value}</span>
            </CardContent>
          </Card>
        ))}
      </div>

      {actionLinks.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex flex-col gap-4">
              <h2 className="text-lg font-semibold flex items-center gap-2">
                <TrendingUp size={18} />
                Quick Navigation
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 text-sm">
                {actionLinks.map(({ to, label }) => (
                  <AppLink
                    key={to}
                    to={to}
                    className="p-3 rounded-lg border border-(--border) hover:bg-(--secondary)/10 transition-colors no-underline text-(--text)"
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
