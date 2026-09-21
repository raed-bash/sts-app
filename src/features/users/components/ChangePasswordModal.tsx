import { useQueryClient } from "@tanstack/react-query";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { useAppFormik } from "@/shared/lib/formik";
import { useChangeUserPassword } from "../api/change-user-password.api";
import { usersQueryKeys } from "../users.api-keys";
import { ChangePasswordDto } from "../dtos/change-password.dto";
import type { UserDto } from "../dtos/user.dto";
import {
  changePasswordSchema,
  type ChangePasswordValues,
} from "../schemas/user-form.schema";
import { useTranslation } from "react-i18next";

export type ChangePasswordModalProps = {
  isOpen: boolean;
  user: UserDto;
  onClose: () => void;
};

export default function ChangePasswordModal({
  isOpen,
  user,
  onClose,
}: ChangePasswordModalProps) {
  const queryClient = useQueryClient();

  const { t } = useTranslation(["common", "users"]);

  const passwordMutation = useChangeUserPassword({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
        toast.success(t("users:toasts.passwordChanged"));
      },
    },
  });

  const loading = passwordMutation.isPending;

  const formik = useAppFormik<ChangePasswordValues>({
    initialValues: {
      password: "",
    },
    validationZodSchema: () => changePasswordSchema(t),
    onSubmit: (values) =>
      passwordMutation.mutate(new ChangePasswordDto(user.id, values.password)),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("users:passwordModal.title", { name: user?.username ?? "" })}
      description={t("users:passwordModal.description")}
    >
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField
          type="password"
          name="password"
          title={t("users:passwordModal.newPassword")}
          value={formik.values.password}
          helperText={formik.touchedErrors.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="new-password"
        />

        <div className="flex justify-end gap-3 mt-2">
          <Button
            type="button"
            variant="outline"
            className="w-fit"
            onClick={onClose}
            disabled={loading}
          >
            {t("common:actions.cancel")}
          </Button>
          <Button type="submit" className="w-fit" disabled={loading}>
            {loading ? t("common:actions.saving") : t("common:actions.save")}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
