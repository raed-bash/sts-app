import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Layout from "../components/layout/Layout";
import { authRouter } from "../features/auth/auth.router";
import { usersRouter } from "../features/users/users.router";
import Container from "@/components/layout/Container";
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
      element: <Container />,
      children: [
        {
          element: (
            <PrivateRoute>
              <Layout />
            </PrivateRoute>
          ),
          children: [
            { index: true, element: <Navigate to="home" replace /> },
            {
              path: "home",
              element: (
                <div className="h-[200vh]">
                  <h1>Home</h1>
                </div>
              ),
            },
            ...usersRouter(queryClient),
            {
              path: "settings",
              element: <h1>Settings</h1>,
            },
          ],
        },
        ...authRouter(queryClient),
      ],
    },
  ]);

  return <RouterProvider router={routers} />;
}
