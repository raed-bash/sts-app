import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { useRole } from "@/hooks/useRole";
import toast from "@/shared/lib/toast";
import { useCheckStudentTestSessions } from "../api/check-student-test-sessions.api";
import { testSessionsPaths } from "../test-sessions.paths";

/**
 * While a student has an exam in progress the API rejects every other page
 * ("finish the test first"), so keep them on the exam instead of on broken pages.
 */
export default function ActiveExamRedirect() {
  const isStudent = useRole() === "STUDENT";
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { t } = useTranslation(["testSessions"]);

  const check = useCheckStudentTestSessions({
    queryConfig: { enabled: isStudent, staleTime: 0 },
  });
  const { refetch } = check;

  useEffect(() => {
    if (isStudent) refetch();
  }, [isStudent, pathname, refetch]);

  const activeId =
    check.data?.status === "STARTED" ? check.data.testSessionId : undefined;

  useEffect(() => {
    if (!activeId) return;
    const examPath = testSessionsPaths.examLink(activeId);
    if (pathname === examPath) return;
    toast.info(t("testSessions:exam.returnToExam"), { id: "return-to-exam" });
    navigate(examPath, { replace: true });
  }, [activeId, pathname, navigate, t]);

  return null;
}
