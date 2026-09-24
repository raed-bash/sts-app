import { Button } from "@/shared/components/ui/button";

type NotFoundProps = {
  title?: string;
  description?: string;
};

function NotFound({
  title = "Page not found",
  description = "The page you are looking for does not exist or has been moved.",
}: NotFoundProps) {
  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 p-6 text-center">
      <div className="space-y-2">
        <p className="text-6xl font-bold tracking-tight text-slate-300 dark:text-slate-700">
          404
        </p>
        <h1 className="text-2xl font-semibold text-slate-900 dark:text-slate-50">
          {title}
        </h1>
        <p className="max-w-md text-sm text-slate-500 dark:text-slate-400">
          {description}
        </p>
      </div>
      <Button type="button" onClick={handleGoBack}>
        Go back
      </Button>
    </div>
  );
}

export default NotFound;
