import { useQueryClient } from "@tanstack/react-query";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { SelectItem } from "@/shared/components/ui/select";
import { useAppFormik } from "@/shared/lib/formik";
import { useUpdateUser } from "../api/update-user.api";
import { usersQueryKeys } from "../users.api-keys";
import { UpdateUserDto } from "../dtos/update-user.dto";
import type { UserDto } from "../dtos/user.dto";
import { ROLE_TITLES, type UserRole } from "@/constants/user-role";
import { STATUS_TITLES, type UserStatus } from "@/constants/user-status";
import {
  editUserFormSchema,
  type EditUserFormValues,
} from "../schemas/user-form.schema";
import { useTranslation } from "react-i18next";

export type EditUserFormModalProps = {
  isOpen: boolean;
  user: UserDto;
  onClose: () => void;
};

export default function EditUserFormModal({
  isOpen,
  user,
  onClose,
}: EditUserFormModalProps) {
  const queryClient = useQueryClient();

  const { t } = useTranslation(["common", "users"]);

  const updateMutation = useUpdateUser({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
        toast.success(t("users:toasts.updated"));
      },
    },
  });

  const loading = updateMutation.isPending;

  const formik = useAppFormik<EditUserFormValues>({
    initialValues: {
      username: user.username,
      role: user.role,
      status: user.status,
    },
    enableReinitialize: true,
    validationZodSchema: () => editUserFormSchema(t),
    onSubmit: (values) =>
      updateMutation.mutate({
        id: user.id,
        data: new UpdateUserDto(user.id, values),
      }),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("users:modal.editTitle", { name: user?.username ?? "" })}
    >
      <form
        className="flex flex-col gap-3 w-full"
        onSubmit={formik.handleSubmit}
      >
        <LabeledField
          type="text"
          name="username"
          title={t("common:fields.username")}
          value={formik.values.username}
          helperText={formik.touchedErrors.username}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
        />
        <LabeledField
          type="select"
          name="role"
          title={t("common:fields.role")}
          value={formik.values.role}
          onChange={formik.handleChange}
          getInputLabel={(value) =>
            value
              ? t(ROLE_TITLES[value as UserRole])
              : t("users:modal.selectRole")
          }
        >
          {(Object.keys(ROLE_TITLES) as UserRole[]).map((role) => (
            <SelectItem key={role} value={role}>
              {t(ROLE_TITLES[role])}
            </SelectItem>
          ))}
        </LabeledField>
        <LabeledField
          type="select"
          name="status"
          title={t("common:fields.status")}
          value={formik.values.status}
          onChange={formik.handleChange}
          getInputLabel={(value) =>
            value
              ? t(STATUS_TITLES[value as UserStatus])
              : t("users:modal.selectStatus")
          }
        >
          {(Object.keys(STATUS_TITLES) as UserStatus[]).map((status) => (
            <SelectItem key={status} value={status}>
              {t(STATUS_TITLES[status])}
            </SelectItem>
          ))}
        </LabeledField>

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
