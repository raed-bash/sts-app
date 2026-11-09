import { test, expect, type Route } from "@playwright/test";

const API = "http://localhost:3000";
const SESSION = 7;

const exam = () => ({
  id: SESSION,
  status: "STARTED",
  startedAt: new Date().toISOString(),
  finishDate: new Date(Date.now() + 30 * 60_000).toISOString(),
  test: { id: 1, name: "Algebra Basics", period: 30 },
  subject: { id: 1, name: "Mathematics" },
  questions: [
    {
      id: 1,
      text: "What is 2 + 2?",
      type: "CHOOSE",
      points: 2,
      completeQuestion: null,
      answers: [
        { id: 11, text: "3", order: 1 },
        { id: 12, text: "4", order: 2 },
      ],
    },
    {
      id: 2,
      text: "Fill the blanks",
      type: "COMPLETE",
      points: 3,
      completeQuestion: { id: 1, text: "one ;;;; two ;;;; three ;;;;" },
      answers: [
        { id: 21, text: "alpha", order: 1 },
        { id: 22, text: "beta", order: 2 },
        { id: 23, text: "gamma", order: 3 },
      ],
    },
    {
      id: 3,
      text: "Put in order",
      type: "DRAG_DROP",
      points: 2,
      completeQuestion: null,
      answers: [
        { id: 31, text: "first", order: 1 },
        { id: 32, text: "second", order: 2 },
      ],
    },
  ],
});

const json = (route: Route, body: unknown, status = 200) =>
  route.fulfill({
    status,
    contentType: "application/json",
    body: JSON.stringify(body),
  });

test.describe("taking an exam", () => {
  test("answers every question type and submits the right positions", async ({
    page,
  }) => {
    await page.addInitScript(() => {
      localStorage.setItem("token", "test-token");
      localStorage.setItem(
        "user",
        JSON.stringify({ id: 5, username: "student1", role: "STUDENT" }),
      );
    });

    // anything not mocked below answers with an empty page
    let submitted:
      { questions: { questionId: number; answers: unknown[] }[] } | undefined;
    await page.route(`${API}/**`, (route) =>
      json(route, {
        data: [],
        meta: { currentPage: 1, lastPage: 0, perPage: 10, total: 0 },
      }),
    );
    await page.route(
      `${API}/test-sessions/check-student-test-sessions`,
      // like the API: the exam lock clears once the student has submitted
      (route) =>
        json(
          route,
          submitted
            ? { status: "NONE" }
            : { status: "STARTED", testSessionId: SESSION },
        ),
    );
    await page.route(`${API}/test-sessions/${SESSION}/exam`, (route) =>
      json(route, exam()),
    );

    await page.route(`${API}/test-sessions/${SESSION}/submit`, (route) => {
      submitted = route.request().postDataJSON();
      return json(route, {
        message: "Submitted successfully",
        results: null,
        resultsAvailableAt: new Date(Date.now() + 31 * 60_000).toISOString(),
      });
    });
    await page.route(`${API}/test-sessions/${SESSION}/results`, (route) =>
      json(
        route,
        {
          statusCode: 403,
          code: "RESULTS_NOT_AVAILABLE",
          message: "Results will be available when the test session ends",
          availableAt: new Date(Date.now() + 31 * 60_000).toISOString(),
        },
        403,
      ),
    );

    await page.goto(`/test-sessions/${SESSION}/exam`);
    await expect(page.getByText("Algebra Basics")).toBeVisible();

    // multiple choice
    await page.getByRole("button", { name: "B 4" }).click();

    // blanks: leave blank 1 empty, tap "beta" then blank 2 ...
    await page.getByRole("button", { name: "beta" }).click();
    await page.getByRole("button", { name: "Blank 2", exact: true }).click();
    await expect(
      page.getByRole("button", { name: /Blank 2: beta/ }),
    ).toBeVisible();

    // ... and really drag "gamma" into blank 3 (pointer events, works on touch too)
    const chip = page.getByRole("button", { name: "gamma" });
    const target = page.getByRole("button", { name: "Blank 3", exact: true });
    const from = (await chip.boundingBox())!;
    const to = (await target.boundingBox())!;
    await page.mouse.move(from.x + from.width / 2, from.y + from.height / 2);
    await page.mouse.down();
    await page.mouse.move(to.x + to.width / 2, to.y + to.height / 2, {
      steps: 12,
    });
    await page.mouse.up();
    await expect(
      page.getByRole("button", { name: /Blank 3: gamma/ }),
    ).toBeVisible();

    // ordering: move "second" above "first"
    await page.getByRole("button", { name: "Move up" }).nth(1).click();

    await expect(page.getByText("3 of 3 questions answered")).toBeVisible();
    await page.getByRole("button", { name: "Submit exam" }).click();

    // results stay locked until the session ends
    await expect(
      page.getByRole("heading", { name: "Answers submitted" }),
    ).toBeVisible();

    const byId = Object.fromEntries(
      submitted!.questions.map((q) => [q.questionId, q.answers]),
    );
    expect(byId[1]).toEqual([{ answerId: 12, answerIndex: 0 }]);
    // blank 1 stayed empty, so the others keep their own positions
    expect(byId[2]).toEqual([
      { answerId: 22, answerIndex: 1 },
      { answerId: 23, answerIndex: 2 },
    ]);
    expect(byId[3]).toEqual([
      { answerId: 32, answerIndex: 0 },
      { answerId: 31, answerIndex: 1 },
    ]);
  });
});
