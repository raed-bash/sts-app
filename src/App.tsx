import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import AppRouter from "./app.router";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppRouter></AppRouter>
    </QueryClientProvider>
  );
}

export default App;
