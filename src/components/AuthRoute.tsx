import { type ReactNode } from "react";
import { Navigate } from "react-router";
import { useAuthContext } from "@/contexts/AuthContext";
import { homePaths } from "@/features/home/home.paths";

export type AuthRouteProps = { children: ReactNode };

function AuthRoute({ children }: AuthRouteProps) {
  const { loggedIn } = useAuthContext();

  if (!loggedIn) {
    return children;
  }

  return <Navigate to={`/${homePaths.home}`} replace />;
}

export default AuthRoute;
