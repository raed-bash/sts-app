import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { authPaths } from "@/features/auth/auth.paths";

export type PrivateRouteProps = { children: ReactNode };

function PrivateRoute({ children }: PrivateRouteProps) {
  const { loggedIn } = useAuthContext();

  if (loggedIn) {
    return children;
  }

  return <Navigate to={`/${authPaths.login}`} replace />;
}

export default PrivateRoute;
