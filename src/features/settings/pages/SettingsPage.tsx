import type { SettingDto } from "../dtos/setting.dto";
import { Card, CardContent } from "@/shared/components/ui/card";
import { useTranslation } from "react-i18next";
import { useSettings } from "../api/get-settings.api";
import { useUpdateSetting } from "../api/update-setting.api";
import { useQueryClient } from "@tanstack/react-query";
import { settingsQueryKeys } from "../settings.api-keys";
import { useState } from "react";
import { Button } from "@/shared/components/ui/button";
import Input from "@/shared/components/custom/inputs/Input";
import Loading from "@/shared/components/custom/loading/Loading";
import { useRequireRole } from "@/hooks/useRequireRole";
import { translateDynamic } from "@/shared/lib/translate-dynamic";

const SETTING_LABELS: Record<string, string> = {
  STUDENT_PENDING_TTL_MINUTES: "settings:labels.STUDENT_PENDING_TTL_MINUTES",
  SESSION_EXPIRE_MINUTES: "settings:labels.SESSION_EXPIRE_MINUTES",
};

export default function SettingsPage() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const { data: settings, isLoading } = useSettings();
  const updateSetting = useUpdateSetting();
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common", "settings"]);
  const [values, setValues] = useState<Record<string, string>>({});

  if (!allowed) return null;

  const handleSave = (key: string) => {
    const setting = settings?.data?.find((s: SettingDto) => s.key === key);
    const nextValue = values[key] ?? setting?.value ?? "";

    updateSetting.mutate(
      { key, value: nextValue },
      {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: settingsQueryKeys.all });
          setValues((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
          });
        },
      },
    );
  };

  if (isLoading) return <Loading />;

  const settingEntries = settings?.data ?? [];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold mb-4">{t("entities.settings")}</h1>
      <div className="grid gap-4 max-w-xl">
        {settingEntries.map((setting: SettingDto) => (
          <Card key={setting.key}>
            <CardContent className="flex flex-col gap-3 pt-6">
              <div className="text-sm font-semibold text-muted-foreground">
                {translateDynamic(
                  t,
                  SETTING_LABELS[setting.key] ?? setting.key,
                )}
              </div>
              <div className="flex items-center gap-3">
                <Input
                  className="flex-1"
                  value={values[setting.key] ?? setting.value}
                  onChange={(e) =>
                    setValues((prev) => ({
                      ...prev,
                      [setting.key]: e.target.value,
                    }))
                  }
                />
                <Button
                  className="shrink-0"
                  onClick={() => handleSave(setting.key)}
                  disabled={updateSetting.isPending}
                >
                  {updateSetting.isPending
                    ? t("common:actions.saving")
                    : t("common:actions.save")}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
        {settingEntries.length === 0 && (
          <div className="text-muted-foreground text-sm">
            {t("settings:noSettings")}
          </div>
        )}
      </div>
    </div>
  );
}
