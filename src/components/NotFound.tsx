import { useTranslation } from "react-i18next";
import AppLink from "@/shared/components/custom/AppLink";
import { buttonVariants } from "@/shared/components/ui/button-variants";
import { homePaths } from "@/features/home/home.paths";

type NotFoundProps = {
  title?: string;
  description?: string;
};

function NotFound({ title, description }: NotFoundProps) {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-5 p-6 text-center">
      <div className="space-y-2">
        <p className="text-6xl font-bold tracking-tight text-muted-foreground/40">
          404
        </p>
        <h1 className="text-2xl font-semibold">
          {title ?? t("notFound.title")}
        </h1>
        <p className="max-w-md text-sm text-muted-foreground">
          {description ?? t("notFound.description")}
        </p>
      </div>
      <AppLink
        to={`/${homePaths.home}`}
        className={buttonVariants({ className: "no-underline" })}
      >
        {t("notFound.goHome")}
      </AppLink>
    </div>
  );
}

export default NotFound;
