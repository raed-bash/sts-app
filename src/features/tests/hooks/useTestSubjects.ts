import { useRef, useState } from "react";
import { getSubjects } from "@/features/subjects/api/get-subjects.api";
import { QuerySubjectDto } from "@/features/subjects/dtos/query-subject.dto";
import { subjectsQueryKeys } from "@/features/subjects/subjects.api-keys";
import type { SubjectDto } from "@/features/subjects/dtos/subject.dto";
import type { QueryFnParams } from "@/shared/hooks/useSelectApi";

export const useTestSubjects = (testId: number) => {
  const seenSubjectPages = useRef(new Set<number>());
  const [subjects, setSubjects] = useState<SubjectDto[]>([]);

  const loadSubjects = (params: QueryFnParams, signal: AbortSignal) =>
    getSubjects(
      new QuerySubjectDto({ ...params, testIds: [testId] }),
      signal,
    ).then((response) => {
      if (!seenSubjectPages.current.has(params.page)) {
        seenSubjectPages.current.add(params.page);
        setSubjects((prev) => [...prev, ...response.data]);
      }
      return response;
    });

  const subjectsQueryKey = subjectsQueryKeys.infiniteList(
    new QuerySubjectDto({ testIds: [testId] }),
  );

  return { subjects, loadSubjects, subjectsQueryKey };
};