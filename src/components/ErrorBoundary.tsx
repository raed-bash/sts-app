import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "@/shared/components/ui/button";

type ErrorBoundaryProps = {
  children?: ReactNode;
  error?: unknown;
};

type ErrorBoundaryState = {
  hasError: boolean;
};

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError && !this.props.error) {
      return this.props.children;
    }

    return (
      <div className="flex min-h-svh flex-col items-center justify-center gap-5 bg-slate-50 p-6 text-center dark:bg-slate-950">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
            Something went wrong
          </h1>
          <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
            An unexpected error occurred. Your data is safe. Please try again
            reloading the page.
          </p>
        </div>
        <Button type="button" onClick={this.handleReload}>
          Reload page
        </Button>
      </div>
    );
  }
}

export default ErrorBoundary;
