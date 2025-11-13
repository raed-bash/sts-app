import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router-dom";
import useAxiosInterceptor from "src/hooks/useAxiosInterceptor";

function Container() {
  useAxiosInterceptor();

  return (
    <>
      <Outlet />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default Container;
