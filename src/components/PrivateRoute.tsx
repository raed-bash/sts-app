import { type ReactNode } from "react";
import { Navigate } from "react-router";

export type PrivateRouteProps = { children: ReactNode };

function PrivateRoute({ children }: PrivateRouteProps) {
  const loggedIn = false;

  if (loggedIn) {
    return children;
  }

  return <Navigate to="/login" replace />;
}

export default PrivateRoute;
