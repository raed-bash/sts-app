import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { Search, X } from "lucide-react";
import { useDebouncedValue } from "@/shared/hooks";
import { useRole } from "@/hooks";
import type { UserRole } from "@/constants/user-role";
import { sidebarCategories } from "@/app/navigation";
import {
  Combobox,
  ComboboxContent,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
} from "@/shared/components/ui/combobox";
import {
  InputGroupAddon,
  InputGroupButton,
} from "@/shared/components/ui/input-group";
import { Spinner } from "@/shared/components/ui/spinner";
import { Kbd } from "@/shared/components/ui/kbd";
import { useUsers } from "@/features/users/api/get-users.api";
import { QueryUserDto } from "@/features/users/dtos/query-user.dto";
import { useSubjects } from "@/features/subjects/api/get-subjects.api";
import { QuerySubjectDto } from "@/features/subjects/dtos/query-subject.dto";
import { useTests } from "@/features/tests/api/get-tests.api";
import { QueryTestDto } from "@/features/tests/dtos/query-test.dto";
import { useQuestions } from "@/features/questions/api/get-questions.api";
import { QueryQuestionDto } from "@/features/questions/dtos/query-question.dto";
import { useAnswers } from "@/features/answers/api/get-answers.api";
import { QueryAnswerDto } from "@/features/answers/dtos/query-answer.dto";
import { usersPaths } from "@/features/users/users.paths";
import { subjectsPaths } from "@/features/subjects/subjects.paths";
import { testsPaths } from "@/features/tests/tests.paths";
import { questionsPaths } from "@/features/questions/questions.paths";
import { answersPaths } from "@/features/answers/answers.paths";

type SearchResult = {
  to: string;
  label: string;
  hint: string;
};

type SearchGroup = {
  label: string;
  results: SearchResult[];
};

const MIN_TERM = 2;

const PER_GROUP = 5;

const MAX_LABEL = 70;

function truncate(value: string) {
  return value.length > MAX_LABEL ? `${value.slice(0, MAX_LABEL)}…` : value;
}

function canAccess(role: UserRole | null, roles?: UserRole[]) {
  return !roles || Boolean(role && roles.includes(role));
}

export default function GlobalSearch() {
  const navigate = useNavigate();

  const containerRef = useRef<HTMLDivElement>(null);

  const [term, setTerm] = useState("");

  const [open, setOpen] = useState(false);

  const [highlighted, setHighlighted] = useState<SearchResult | undefined>(
    undefined,
  );

  const role = useRole();

  const isAdmin = role === "SUPER_ADMIN";

  const rawTerm = term.trim();

  const debouncedTerm = useDebouncedValue(rawTerm, 300);

  const search = debouncedTerm.length >= MIN_TERM ? debouncedTerm : "";

  const enabled = isAdmin && Boolean(search);

  const users = useUsers({
    query: new QueryUserDto({ username: search, isDeleted: false }),
    queryConfig: { enabled },
  });

  const subjects = useSubjects({
    query: new QuerySubjectDto({
      name: search,
      isDeleted: false,
      perPage: PER_GROUP,
    }),
    queryConfig: { enabled },
  });

  const tests = useTests({
    query: new QueryTestDto({
      name: search,
      isDeleted: false,
      perPage: PER_GROUP,
    }),
    queryConfig: { enabled },
  });

  const questions = useQuestions({
    query: new QueryQuestionDto({
      text: search,
      isDeleted: false,
      perPage: PER_GROUP,
    }),
    queryConfig: { enabled },
  });

  const answers = useAnswers({
    query: new QueryAnswerDto({ text: search }),
    queryConfig: { enabled },
  });

  const isFetching =
    enabled &&
    (users.isFetching ||
      subjects.isFetching ||
      tests.isFetching ||
      questions.isFetching ||
      answers.isFetching);

  const groups = useMemo<SearchGroup[]>(() => {
    if (rawTerm.length < 1) return [];

    const query = rawTerm.toLowerCase();

    const pages: SearchResult[] = [];

    for (const category of sidebarCategories) {
      for (const link of category.links) {
        if ("pages" in link) {
          if (!canAccess(role, link.roles)) continue;

          for (const page of link.pages) {
            if (page.label.toLowerCase().includes(query)) {
              pages.push({
                to: `/${page.to}`,
                label: page.label,
                hint: link.label,
              });
            }
          }
        } else {
          if (!canAccess(role, link.roles)) continue;

          if (link.label.toLowerCase().includes(query)) {
            pages.push({
              to: `/${link.to}`,
              label: link.label,
              hint: category.title,
            });
          }
        }
      }
    }

    if (!search) {
      return pages.length ? [{ label: "Pages", results: pages }] : [];
    }

    const result: SearchGroup[] = [];

    if (pages.length) result.push({ label: "Pages", results: pages });

    const userResults = (users.data?.data ?? []).map<SearchResult>((user) => ({
      to: `/${usersPaths.list}`,
      label: user.username,
      hint: "User",
    }));

    if (userResults.length)
      result.push({ label: "Users", results: userResults });

    const subjectResults = (subjects.data?.data ?? []).map<SearchResult>(
      (subject) => ({
        to: subjectsPaths.subjectDetailLink(subject.id),
        label: subject.name,
        hint: "Subject",
      }),
    );

    if (subjectResults.length)
      result.push({ label: "Subjects", results: subjectResults });

    const testResults = (tests.data?.data ?? []).map<SearchResult>((test) => ({
      to: testsPaths.testDetailLink(test.id),
      label: test.name,
      hint: "Test",
    }));

    if (testResults.length)
      result.push({ label: "Tests", results: testResults });

    const questionResults = (questions.data?.data ?? []).map<SearchResult>(
      (question) => ({
        to: questionsPaths.questionDetailLink(question.id),
        label: truncate(question.text),
        hint: "Question",
      }),
    );

    if (questionResults.length)
      result.push({ label: "Questions", results: questionResults });

    const answerResults = (answers.data?.data ?? []).map<SearchResult>(
      (answer) => ({
        to: `/${answersPaths.list}`,
        label: truncate(answer.text),
        hint: "Answer",
      }),
    );

    if (answerResults.length)
      result.push({ label: "Answers", results: answerResults });

    return result;
  }, [
    role,
    rawTerm,
    search,
    users.data,
    subjects.data,
    tests.data,
    questions.data,
    answers.data,
  ]);

  const hasResults = groups.some((group) => group.results.length > 0);

  useEffect(() => {
    const handleShortcut = (event: KeyboardEvent) => {
      if ((event.metaKey || event.ctrlKey) && event.key.toLowerCase() === "k") {
        event.preventDefault();

        containerRef.current?.querySelector("input")?.focus();

        if (rawTerm) setOpen(true);
      }
    };

    window.addEventListener("keydown", handleShortcut);

    return () => window.removeEventListener("keydown", handleShortcut);
  }, [rawTerm]);

  const handleSelect = (result: SearchResult | null) => {
    if (!result) return;

    navigate(result.to);

    setTerm("");
    setOpen(false);
  };

  return (
    <div ref={containerRef}>
      <Combobox<SearchResult>
        items={groups.flatMap((group) => group.results)}
        filter={null}
        inputValue={term}
        onInputValueChange={(value) => {
          setTerm(value);
          setOpen(value.trim().length > 0);
        }}
        value={null}
        onValueChange={handleSelect}
        onItemHighlighted={(item) => setHighlighted(item)}
        itemToStringLabel={(item) => item.label}
        autoHighlight
        open={open}
        onOpenChange={setOpen}
      >
        <ComboboxInput
          placeholder="Search..."
          showTrigger={false}
          showClear={false}
          className="w-56 md:w-72"
          onKeyDown={(event) => {
            if (event.key !== "Enter" || highlighted) return;

            const firstResult = groups[0]?.results[0];

            if (!firstResult) return;

            event.preventDefault();
            handleSelect(firstResult);
          }}
        >
          <InputGroupAddon align="inline-start">
            <Search />
          </InputGroupAddon>
          {rawTerm ? (
            <InputGroupAddon align="inline-end">
              <InputGroupButton
                size="icon-xs"
                aria-label="Clear search"
                onClick={() => {
                  setTerm("");
                  setOpen(false);
                  containerRef.current?.querySelector("input")?.focus();
                }}
              >
                <X />
              </InputGroupButton>
            </InputGroupAddon>
          ) : (
            <InputGroupAddon
              align="inline-end"
              className="hidden md:flex pointer-events-none"
            >
              <Kbd className="rounded border border-input">⌘K</Kbd>
            </InputGroupAddon>
          )}
        </ComboboxInput>

        <ComboboxContent className="w-56 md:w-72">
          <ComboboxList>
            {groups.map((group) => (
              <ComboboxGroup key={group.label}>
                <ComboboxLabel>{group.label}</ComboboxLabel>
                {group.results.map((result, index) => (
                  <ComboboxItem
                    key={`${group.label}-${result.to}-${index}`}
                    value={result}
                  >
                    <span className="flex min-w-0 flex-col">
                      <span className="truncate">{result.label}</span>
                    </span>
                    <span className="ml-auto shrink-0 text-xs text-muted-foreground">
                      {result.hint}
                    </span>
                  </ComboboxItem>
                ))}
              </ComboboxGroup>
            ))}

            {!hasResults && (
              <div className="flex items-center justify-center gap-2 px-2 py-6 text-sm text-muted-foreground">
                {isFetching ? (
                  <>
                    <Spinner />
                    Searching...
                  </>
                ) : rawTerm.length < MIN_TERM ? (
                  "Keep typing to search…"
                ) : (
                  `No results for “${rawTerm}”`
                )}
              </div>
            )}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
    </div>
  );
}
