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
import { SelectGroup, SelectItem, SelectLabel } from "@/components/ui/select";
import useCachingState from "@/hooks/useCashingState";
import type { SyntheticEvent } from "@/components/utils/events";
import {
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxValue,
} from "@/components/ui/combobox";
import { useComboboxAnchor } from "@/components/hooks/useComboboxAnchor";
import { ComboboxFieldChipsInput } from "@/components/inputs/select/ComboboxField";
import { ComboboxApiList } from "@/components/inputs/select/ComboboxApi";

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

  const [user, setUser] = useCachingState<UserDto | null>(
    "selectedUsers",
    null,
  );

  const [users, setUsers] = useState<UserDto[]>([]);

  const handleUserChange = (e: SyntheticEvent) => {
    setUser(e.target.value);
  };

  const comboboxAnchor = useComboboxAnchor();
  const handleComboboxChange = (e: SyntheticEvent) => {
    setUsers(e.target.value);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      <InputPlus
        type="comboboxApi"
        isItemEqualToValue={(item, value) => item.id === value.id}
        itemToStringLabel={(item) => item.username}

        onChange={handleComboboxChange}
        value={users}
        multiple
        queryProps={{ queryFn: usersApi.getUsers, queryKey: ["selectUserssa"] }}
        searchKey={"username" as keyof QueryUserDto}
      >
        {(data) => (
          <>
            <ComboboxChips ref={comboboxAnchor}>
              <ComboboxValue>
                {(values: UserDto[]) => (
                  <>
                    {values.map((value) => (
                      <ComboboxChip key={value.id}>
                        {value.username}
                      </ComboboxChip>
                    ))}
                    <ComboboxFieldChipsInput placeholder="Select users" />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>

            <ComboboxContent anchor={comboboxAnchor}>
              <ComboboxApiList>
                <ComboboxGroup>
                  <ComboboxLabel>Users</ComboboxLabel>
                  {data?.pages.map((page) => (
                    <ComboboxGroup key={page.meta.currentPage}>
                      <ComboboxLabel>
                        page {page.meta.currentPage}
                      </ComboboxLabel>
                      {page.data.map((item) => (
                        <ComboboxItem key={item.id} value={item}>
                          {item.username}
                        </ComboboxItem>
                      ))}
                    </ComboboxGroup>
                  ))}
                </ComboboxGroup>
              </ComboboxApiList>
            </ComboboxContent>
          </>
        )}
      </InputPlus>
      <InputPlus
        type="selectApi"
        value={user}
        onChange={handleUserChange}
        isItemEqualToValue={(item, value) => item.id === value.id}
        getLabel={(item) => item?.username}
        queryProps={{ queryFn: usersApi.getUsers, queryKey: ["selectedUser2"] }}
        placeholder="users"
      >
        {(data) => (
          <SelectGroup>
            <SelectLabel>User</SelectLabel>
            {data?.pages.map((page) =>
              page.data.map((item) => (
                <SelectItem key={item.id} value={item}>
                  {item.username}
                </SelectItem>
              )),
            )}
          </SelectGroup>
        )}
      </InputPlus>

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
            perPage={usersQuery.data?.meta.perPage}
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
