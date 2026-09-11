import * as React from "react";
import { Toaster } from "react-hot-toast";
import { Outlet, useNavigation } from "react-router";
import { useApiInterceptor } from "@/hooks";

function Container() {
  useApiInterceptor();

  return (
    <>
      <Progress />

      <Outlet />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
}

export default Container;

const Progress = () => {
  const { state, location } = useNavigation();

  const progressRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (progressRef.current) {
      progressRef.current.style.width = "0";
    }
  }, [location?.pathname, progressRef]);

  React.useEffect(() => {
    if (state === "loading" && progressRef.current) {
      let progress = 0;

      const timer = setInterval(() => {
        if (progress === 100) clearInterval(timer);
        progress += progress > 100 ? 0 : 10;

        if (progressRef.current) {
          progressRef.current.style.width = `${progress}%`;
        }
      }, 300);

      return () => {
        clearInterval(timer);
      };
    }
  }, [state, progressRef]);

  if (state !== "loading") {
    return null;
  }

  return (
    <div
      className="fixed left-0 top-0 h-1 bg-blue-500 transition-all duration-200 ease-in-out z-200"
      ref={progressRef}
    ></div>
  );
};
