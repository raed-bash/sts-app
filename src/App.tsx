import { QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import AuthProvider from "./contexts/AuthProvider";
import ThemeProvider from "./contexts/ThemeProvider";
import { TooltipProvider } from "./shared/components/ui/tooltip";
import AppRouter from "./app/app.router";
import { queryClient } from "./lib/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      {import.meta.env.DEV && <ReactQueryDevtools />}
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
