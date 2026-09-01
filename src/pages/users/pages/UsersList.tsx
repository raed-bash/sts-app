import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../users.api";
import { UserPages } from "../users.pages";
import useSelectRows from "src/hooks/useSelectRows";
import { useState } from "react";
import useSorts from "src/hooks/useSorts";
import UsersTable from "../components/UsersTable";
import { QueryUserDto } from "../dtos/query-user.dto";
import { UserDto } from "../dtos/user.dto";
import InputPlus from "src/components/inputs/InputPlus";
import useFilters from "src/hooks/useFilters";
import useFiltersDebounce from "src/hooks/useFiltersDebounce";
import { Card, CardContent } from "@/components/ui/card";

export default function UsersList() {
  const { filters } = useFilters("usersFilters", new QueryUserDto({}));

  const { filtersDebounce, filterDebounced, handleFiltersDebounceChange } =
    useFiltersDebounce("usersFiltersDebounce", new QueryUserDto({}));

  const { selectedRows, setSelectedRows } = useSelectRows(
    "any",
    new Set<number | string>(),
  );

  const [page, setPage] = useState(1);

  const { handleSortChange, sorts } = useSorts<keyof UserDto>("users");

  const usersQuery = useQuery({
    queryKey: [UserPages.users.key, page, sorts, filters, filterDebounced],
    queryFn: () =>
      usersApi.getUsers(
        new QueryUserDto({ ...filters, ...filterDebounced, sorts }),
      ),
  });
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <InputPlus
        type="text"
        name="username"
        title="Search:"
        onChange={handleFiltersDebounceChange}
        value={filtersDebounce.username || ""}
      />

      <Card className="pb-52">
        <CardContent>
          <UsersTable
            handleSortChange={handleSortChange}
            page={page}
            selectedRows={selectedRows}
            setPage={setPage}
            setSelectedRows={setSelectedRows}
            sorts={sorts}
            count={usersQuery.data?.meta.total || 0}
            perPage={usersQuery.data?.meta.perPage || 10}
            rows={usersQuery.data?.data}
            loading={usersQuery.isPending}
            scLoading={usersQuery.isFetching}
            handleFiltersDebounceChange={handleFiltersDebounceChange}
            filtersDebounce={filtersDebounce}
          />
        </CardContent>
      </Card>
    </div>
  );
}
