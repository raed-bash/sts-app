import { useQueryClient } from "@tanstack/react-query";
import toast from "@/shared/lib/toast";
import Popup from "@/shared/components/custom/popups/Popup";
import { Button } from "@/shared/components/ui/button";
import LabeledField from "@/shared/components/custom/inputs/LabeledField";
import { SelectItem } from "@/shared/components/ui/select";
import { useAppFormik } from "@/shared/lib/formik";
import { useCreateUser } from "../api/create-user.api";
import { usersQueryKeys } from "../users.api-keys";
import { CreateUserDto } from "../dtos/create-user.dto";
import { ROLE_TITLES, type UserRole } from "@/constants/user-role";
import { STATUS_TITLES, type UserStatus } from "@/constants/user-status";
import {
  createUserFormSchema,
  type CreateUserFormValues,
} from "../schemas/user-form.schema";
import { useTranslation } from "react-i18next";

export type CreateUserFormModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function CreateUserFormModal({
  isOpen,
  onClose,
}: CreateUserFormModalProps) {
  const queryClient = useQueryClient();

  const { t } = useTranslation(["common", "users"]);

  const createMutation = useCreateUser({
    mutationConfig: {
      onSuccess: () => {
        onClose();
        queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });
        toast.success(t("users:toasts.created"));
      },
    },
  });

  const loading = createMutation.isPending;

  const formik = useAppFormik<CreateUserFormValues>({
    initialValues: {
      username: "",
      password: "",
      role: "STUDENT",
      status: "PENDING",
    },
    validationZodSchema: () => createUserFormSchema(t),
    onSubmit: (values) => createMutation.mutate(new CreateUserDto(values)),
  });

  return (
    <Popup
      isOpen={isOpen}
      onClose={onClose}
      title={t("users:modal.createTitle")}
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
          type="password"
          name="password"
          title={t("common:fields.password")}
          value={formik.values.password}
          helperText={formik.touchedErrors.password}
          onChange={formik.handleChange}
          onBlur={formik.handleBlur}
          autoComplete="new-password"
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
            {loading ? t("common:actions.saving") : t("common:actions.create")}
          </Button>
        </div>
      </form>
    </Popup>
  );
}
