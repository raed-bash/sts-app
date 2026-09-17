export const testSessionsPaths = {
  list: "test-sessions",
  results: "test-sessions/:id/results",
  exam: "test-sessions/:id/exam",
  resultsLink: (id: number) => `/test-sessions/${id}/results`,
  examLink: (id: number) => `/test-sessions/${id}/exam`,
};