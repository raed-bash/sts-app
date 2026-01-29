import { createBrowserRouter, RouterProvider } from "react-router";
import Container from "./components/container/Container";
import PrivateRoute from "./components/PrivateRoute";
import Layout from "./components/layout/Layout";
import { authRouter } from "./pages/auth/auth.router";

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
        },
        ...authRouter,
      ],
    },
  ]);

  return <RouterProvider router={routers} />;
}
