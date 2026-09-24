import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Layout from "../components/layout/Layout";
import { authRouter } from "../features/auth/auth.router";
import { homeRouter } from "../features/home/home.router";
import { usersRouter } from "../features/users/users.router";
import { subjectsRouter } from "../features/subjects/subjects.router";
import { testsRouter } from "../features/tests/tests.router";
import { questionsRouter } from "../features/questions/questions.router";
import { answersRouter } from "../features/answers/answers.router";
import { testSessionsRouter } from "../features/test-sessions/test-sessions.router";
import { settingsRouter } from "../features/settings/settings.router";
import { homePaths } from "../features/home/home.paths";
import Container from "@/components/layout/Container";
import ErrorBoundary from "@/components/ErrorBoundary";
import NotFound from "@/components/NotFound";
import PrivateRoute from "@/components/PrivateRoute";
import { useQueryClient, type QueryClient } from "@tanstack/react-query";

// eslint-disable-next-line react-refresh/only-export-components
export const convert = (queryClient: QueryClient) => (m: any) => {
  const { clientLoader, default: Component, ...rest } = m;

  return { ...rest, loader: clientLoader?.(queryClient), Component };
};

export default function AppRouter() {
  const queryClient = useQueryClient();

  const routers = createBrowserRouter([
    {
      path: "/",
      errorElement: <ErrorBoundary />,
      element: <Container />,
      children: [
        {
          element: (
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          ),
          children: [
            { index: true, element: <Navigate to={homePaths.home} replace /> },
            ...homeRouter(queryClient),
            ...usersRouter(queryClient),
            ...subjectsRouter(queryClient),
            ...testsRouter(queryClient),
            ...questionsRouter(queryClient),
            ...answersRouter(queryClient),
            ...testSessionsRouter(queryClient),
            ...settingsRouter(queryClient),
          ],
        },
        ...authRouter(queryClient),
        { path: "*", element: <NotFound /> },
      ],
    },
  ]);

  return <RouterProvider router={routers} />;
}
