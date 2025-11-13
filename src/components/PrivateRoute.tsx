import { memo, type ReactNode } from "react";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

export type PrivateRouteProps = { children: ReactNode };

function PrivateRoute({ children }: PrivateRouteProps) {
  const loggedIn = useSelector((state) => state.app.loggedIn);

  if (loggedIn) {
    return children;
  }

  return <Navigate to="/login" replace />;
}

export default memo(PrivateRoute);
