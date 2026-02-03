import { createBrowserRouter, Navigate, RouterProvider } from "react-router";
import Container from "./components/container/Container";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/layout/Layout";
import { authRouter } from "./pages/auth/auth.router";
import { usersRouter } from "./pages/users/users.router";

export default function AppRouter() {
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
            ...usersRouter,
            {
              path: "settings",
              element: <h1>Settings</h1>,
            },
          ],
        },
        ...authRouter,
      ],
    },
  ]);

  return <RouterProvider router={routers} />;
}
