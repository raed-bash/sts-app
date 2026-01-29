import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import "./App.css";
import AppRouter from "./app.router";
import AuthProvider from "./contexts/AuthProvider";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AppRouter></AppRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
