import { Suspense, type SuspenseProps } from "react";
import Loading from "./skeleton/Loading";

export type PageFallbackProps = SuspenseProps & {
  height?: string;
};

function PageFallback({
  children,
  height = "65vh",
  ...props
}: PageFallbackProps) {
  return (
    <Suspense
      fallback={
        <div
          className="flex justify-center items-center"
          style={{
            height,
          }}
        >
          <Loading />
        </div>
      }
      {...props}
    >
      {children}
    </Suspense>
  );
}

export default PageFallback;
