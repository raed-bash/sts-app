import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthContext } from "src/contexts/AuthContext";

export type PrivateRouteProps = { children: ReactNode };

function PrivateRoute({ children }: PrivateRouteProps) {
  const { loggedIn } = useAuthContext();

  if (loggedIn) {
    return children;
  }

  return <Navigate to="/login" replace />;
}

export default PrivateRoute;
