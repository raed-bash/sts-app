import { lazy, Suspense } from "react";
import { QueryClientProvider } from "@tanstack/react-query";
import AuthProvider from "./contexts/AuthProvider";
import ThemeProvider from "./contexts/ThemeProvider";
import { TooltipProvider } from "./shared/components/ui/tooltip";
import AppRouter from "./app/app.router";
import { queryClient } from "./lib/react-query";

const ReactQueryDevtools = import.meta.env.DEV
  ? lazy(() =>
      import("@tanstack/react-query-devtools").then((module) => ({
        default: module.ReactQueryDevtools,
      })),
    )
  : null;

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {ReactQueryDevtools && (
        <Suspense fallback={null}>
          <ReactQueryDevtools />
        </Suspense>
      )}
      <ThemeProvider>
        <AuthProvider>
          <TooltipProvider>
            <AppRouter />
          </TooltipProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;