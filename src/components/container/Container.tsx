import { Toaster } from "react-hot-toast";
import { Outlet } from "react-router";
import { useAxiosInterceptor } from "@/hooks";

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
