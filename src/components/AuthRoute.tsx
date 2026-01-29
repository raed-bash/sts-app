import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthContext } from "src/contexts/AuthContext";

export type AuthRouteProps = { children: ReactNode };

function AuthRoute({ children }: AuthRouteProps) {
  const { loggedIn } = useAuthContext();

  if (!loggedIn) {
    return children;
  }

  return <Navigate to="/home" replace />;
}

export default AuthRoute;
