import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import { useApiInterceptor } from "@/hooks";

function Container() {
  useApiInterceptor();

  return (
    <>
      <Outlet />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default Container;
