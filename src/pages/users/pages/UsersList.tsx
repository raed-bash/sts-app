import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../users.api";
import { UserPages } from "../users.pages";
import Paper from "src/components/paper/Paper";
import useSelectRows from "src/hooks/useSelectRows";
import useHiddenColumnsLocalStorage from "src/hooks/useHiddenColumnsLocalStorage";
import { useState } from "react";
import useSorts from "src/hooks/useSorts";
import UsersTable from "../components/UsersTable";

export default function UsersList() {
  const usersQuery = useQuery({
    queryKey: [UserPages.users.key],
    queryFn: () => usersApi.getUsers(),
  });

  const { selectedRows, setSelectedRows } = useSelectRows(
    "any",
    new Set<number | string>(),
  );
  const [page, setPage] = useState(1);
  const { hiddenColumns, setHiddenColumns } =
    useHiddenColumnsLocalStorage("nmae");

  const { handleSortChange, sorts } = useSorts("users");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      <Paper className="p-0">
        <UsersTable
          handleSortChange={handleSortChange}
          hiddenColumns={hiddenColumns}
          page={page}
          selectedRows={selectedRows}
          setHiddenColumns={setHiddenColumns}
          setPage={setPage}
          setSelectedRows={setSelectedRows}
          sorts={sorts}
          count={10}
          perPage={10}
          rows={usersQuery.data?.data}
        />
      </Paper>
    </div>
  );
}
