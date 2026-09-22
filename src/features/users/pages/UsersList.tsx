import { useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  CircleSlash,
  Edit,
  KeyRound,
  Trash,
  UserPlus,
  RotateCcw,
} from "lucide-react";
import type { TableAction } from "@/shared/components/custom/table/components/TableActionsCell";
import UsersTable from "../components/UsersTable";
import CreateUserFormModal from "../components/CreateUserFormModal";
import EditUserFormModal from "../components/EditUserFormModal";
import ChangePasswordModal from "../components/ChangePasswordModal";
import ConfirmPopup from "@/shared/components/custom/popups/ConfirmPopup";
import { QueryUserDto } from "../dtos/query-user.dto";
import type { UserDto } from "../dtos/user.dto";
import { Card, CardContent } from "@/shared/components/ui/card";
import { getUsersQueryOptions } from "../api/get-users.api";
import type { QueryClient } from "@tanstack/react-query";
import { useUsersTable } from "../hooks/useUsersTable";
import { useRequireRole } from "@/hooks/useRequireRole";
import { Button } from "@/shared/components/ui/button";
import toast from "@/shared/lib/toast";
import { useQueryClient } from "@tanstack/react-query";
import { usersQueryKeys } from "../users.api-keys";
import { useUpdateUser } from "../api/update-user.api";
import { useDeleteUser } from "../api/delete-user.api";
import { useRestoreUser } from "../api/restore-user.api";
import { UpdateUserDto } from "../dtos/update-user.dto";
import { useTranslation } from "react-i18next";

// eslint-disable-next-line react-refresh/only-export-components
export const clientLoader = (queryClient: QueryClient) => async () => {
  const query = getUsersQueryOptions(new QueryUserDto({}));

  return (
    queryClient.getQueryData(query.queryKey) ?? (await queryClient.query(query))
  );
};

type ConfirmState =
  | { action: "delete"; user: UserDto }
  | { action: "block"; user: UserDto }
  | { action: "activate"; user: UserDto }
  | { action: "restore"; user: UserDto }
  | null;

export default function UsersList() {
  const allowed = useRequireRole(["SUPER_ADMIN"]);
  const queryClient = useQueryClient();
  const { t } = useTranslation(["common", "users"]);
  const { tableProps } = useUsersTable();

  const [createOpen, setCreateOpen] = useState(false);
  const [editing, setEditing] = useState<UserDto | null>(null);
  const [changingPassword, setChangingPassword] = useState<UserDto | null>(
    null,
  );
  const [confirm, setConfirm] = useState<ConfirmState>(null);
  const [pendingId, setPendingId] = useState<number | null>(null);

  const refresh = () =>
    queryClient.invalidateQueries({ queryKey: usersQueryKeys.all });

  const deleteMutation = useDeleteUser();
  const restoreMutation = useRestoreUser();
  const blockMutation = useUpdateUser({
    mutationConfig: { onSuccess: refresh },
  });

  if (!allowed) return null;

  const handleStatus = (user: UserDto, status: "ACTIVE" | "BLOCKED") => {
    blockMutation.mutate({
      id: user.id,
      data: new UpdateUserDto(user.id, {
        username: user.username,
        role: user.role,
        status,
      }),
    });
  };

  const actions: TableAction<UserDto>[] = [
    {
      name: "edit",
      label: t("common:actions.edit"),
      icon: <Edit />,
      onClick: (user) => setEditing(user),
    },
    {
      name: "approve",
      label: t("users:actions.approve"),
      icon: <BadgeCheck />,
      hidden: (user) => user.status !== "PENDING",
      onClick: (user) => handleStatus(user, "ACTIVE"),
    },
    {
      name: "activate",
      label: t("common:actions.activate"),
      icon: <CheckCircle2 />,
      hidden: (user) => user.status !== "BLOCKED",
      onClick: (user) => handleStatus(user, "ACTIVE"),
    },
    {
      name: "block",
      label: t("common:actions.block"),
      icon: <CircleSlash />,
      hidden: (user) => user.status !== "ACTIVE",
      onClick: (user) => setConfirm({ action: "block", user }),
    },
    {
      name: "password",
      label: t("users:actions.changePassword"),
      icon: <KeyRound />,
      onClick: (user) => setChangingPassword(user),
    },
    {
      name: "restore",
      label: t("common:actions.restore"),
      icon: <RotateCcw />,
      hidden: (user) => !user.deletedAt,
      onClick: (user) => {
        setPendingId(user.id);
        restoreMutation.mutate(user.id, {
          onSettled: () => {
            setPendingId(null);
            refresh();
          },
        });
      },
    },
    {
      name: "delete",
      label: t("common:actions.remove"),
      icon: <Trash />,
      variant: "destructive",
      hidden: (user) => Boolean(user.deletedAt),
      onClick: (user) => setConfirm({ action: "delete", user }),
    },
  ];

  return (
    <div className="flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{t("entities.users")}</h1>
        <Button
          className="w-fit flex items-center gap-2"
          onClick={() => setCreateOpen(true)}
        >
          <UserPlus size={16} />
          {t("users:list.add")}
        </Button>
      </div>
      <Card className="pb-0">
        <CardContent>
          <UsersTable {...tableProps} actions={actions} />
        </CardContent>
      </Card>

      <CreateUserFormModal
        isOpen={createOpen}
        onClose={() => setCreateOpen(false)}
      />

      {editing && (
        <EditUserFormModal
          isOpen
          user={editing}
          onClose={() => setEditing(null)}
        />
      )}

      {changingPassword && (
        <ChangePasswordModal
          isOpen
          user={changingPassword}
          onClose={() => setChangingPassword(null)}
        />
      )}

      <ConfirmPopup
        isOpen={confirm?.action === "delete"}
        title={t("common:confirm.deleteTitle", {
          name: confirm?.user.username ?? "",
        })}
        message={t("users:confirm.deleteMessage")}
        confirmLabel={t("common:actions.delete")}
        destructive
        loading={pendingId !== null}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.action !== "delete") return;

          setPendingId(confirm.user.id);
          deleteMutation.mutate(confirm.user.id, {
            onSettled: () => {
              setPendingId(null);
              setConfirm(null);
              refresh();
              toast.success(t("users:toasts.deleted"));
            },
          });
        }}
      />

      <ConfirmPopup
        isOpen={confirm?.action === "block"}
        title={t("users:confirm.blockTitle", {
          name: confirm?.user.username ?? "",
        })}
        message={t("users:confirm.blockMessage")}
        confirmLabel={t("common:actions.block")}
        loading={pendingId !== null}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.action !== "block") return;

          handleStatus(confirm.user, "BLOCKED");
          setConfirm(null);
          toast.success(t("users:toasts.blocked"));
        }}
      />

      <ConfirmPopup
        isOpen={confirm?.action === "activate"}
        title={t("users:confirm.activateTitle", {
          name: confirm?.user.username ?? "",
        })}
        confirmLabel={t("common:actions.activate")}
        loading={pendingId !== null}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.action !== "activate") return;

          handleStatus(confirm.user, "ACTIVE");
          setConfirm(null);
          toast.success(t("users:toasts.activated"));
        }}
      />

      <ConfirmPopup
        isOpen={confirm?.action === "restore"}
        title={t("users:confirm.restoreTitle", {
          name: confirm?.user.username ?? "",
        })}
        confirmLabel={t("common:actions.restore")}
        loading={pendingId !== null}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.action !== "restore") return;

          setPendingId(confirm.user.id);
          restoreMutation.mutate(confirm.user.id, {
            onSettled: () => {
              setPendingId(null);
              setConfirm(null);
              refresh();
            },
          });
        }}
      />
    </div>
  );
}
