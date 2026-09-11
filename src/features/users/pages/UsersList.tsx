import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../users.api";
import UsersTable from "../components/UsersTable";
import { QueryUserDto } from "../dtos/query-user.dto";
import { UserDto } from "../dtos/user.dto";
import {
  ComboboxChip,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
} from "@/shared/components/ui/combobox";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/shared/components/ui/select";
import {
  useCachedState,
  useDebouncedFilter,
  useSelectedRows,
  useSorts,
} from "@/hooks";
import type { SyntheticEvent } from "@/shared/utils";
import InputPlus from "@/shared/components/custom/inputs/InputPlus";
import { Card, CardContent } from "@/shared/components/ui/card";
import Frame from "@/shared/components/custom/frame/Frame";
import {
  type LogicalOperator,
  type FilterItem,
} from "@/shared/components/custom/table/filter";
import { getUsers, getUsersQueryOptions, useUsers } from "../api/get-users.api";
import { usersQueryKeys } from "../users.api-keys";
import { useDebouncedValue } from "@/shared/hooks";
import type { QueryClient } from "@tanstack/react-query";

export default function UsersList() {
  const [tableFilters, setTableFilters] = useCachedState<FilterItem[]>(
    "userTableFilters",
    [],
  );
  const { filters: debounceFilters, handleFiltersChange } = useDebouncedFilter(
    "usersFiltersDebounce",
    new QueryUserDto({}),
  );

  const [logicalOperator, setLogicalOperator] =
    React.useState<LogicalOperator>("AND");

  const { selectedRows, setSelectedRows } = useSelectedRows(
    "any",
    new Set<number | string>(),
  );

  const [page, setPage] = React.useState(1);

  const { handleSortChange, sorts } = useSorts<keyof UserDto>("users");

  const debounceTableFilters = useDebouncedValue(tableFilters);

  const usersQuery = useUsers({
    query: new QueryUserDto({
      ...Object.fromEntries(
        debounceTableFilters.map((item) => [item.name, item.value]),
      ),
      sorts,
      page,
    }),
  });

  const [user, setUser] = useCachedState<UserDto | null>("selectedUsers", null);

  const [selectedUsers, setSelectedUsers] = React.useState<UserDto[]>([]);

  const handleUserChange = (e: SyntheticEvent) => {
    setUser(e.target.value);
  };

  const handleUsersChange = (e: SyntheticEvent) => {
    setSelectedUsers(e.target.value);
  };

  const [users, meta] = [usersQuery.data?.data, usersQuery.data?.meta];

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <div className="flex gap-5 ">
        <Frame title="Combobox Field" className="grid grid-cols-2 gap-5 w-full">
          <InputPlus<UserDto>
            type="combobox"
            isItemEqualToValue={(item, value) => item.id === value.id}
            itemToStringLabel={(item) => item.username}
            empty={<ComboboxEmpty>No users</ComboboxEmpty>}
            placeholder="Combobox Field"
            title="Combobox Field"
            onChange={handleUserChange}
            value={user}
            items={usersQuery.data?.data}
          >
            {(item) => (
              <ComboboxItem key={item.id} value={item}>
                {item.username}
              </ComboboxItem>
            )}
          </InputPlus>
          <InputPlus
            type="combobox"
            title="Multiple Combobox Field"
            placeholder="Multiple Combobox Field"
            multiple
            value={selectedUsers}
            onChange={handleUsersChange}
            items={usersQuery.data?.data}
            autoHighlight
            getInputLabel={(items) =>
              items.map((item) => (
                <ComboboxChip key={item.id}>{item.username}</ComboboxChip>
              ))
            }
          >
            {(user) => (
              <ComboboxItem key={user.id} value={user}>
                {user.username}
              </ComboboxItem>
            )}
          </InputPlus>

          <InputPlus
            type="comboboxApi"
            isItemEqualToValue={(item, value) => item.id === value.id}
            itemToStringLabel={(item) => item.username}
            onChange={handleUserChange}
            value={user}
            queryProps={{
              queryFn: getUsers,
              queryKey: usersQueryKeys.infiniteList(),
            }}
            searchKey={"username" as keyof QueryUserDto}
            placeholder="API Combobox"
            title="API Combobox"
          >
            {(data) => (
              <ComboboxGroup>
                <ComboboxLabel>Users</ComboboxLabel>
                {data?.pages.map((page) => (
                  <ComboboxGroup key={page.meta.currentPage}>
                    <ComboboxLabel>page {page.meta.currentPage}</ComboboxLabel>
                    {page.data.map((item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.username}
                      </ComboboxItem>
                    ))}
                  </ComboboxGroup>
                ))}
              </ComboboxGroup>
            )}
          </InputPlus>

          <InputPlus
            type="comboboxApi"
            multiple
            queryProps={{
              queryFn: getUsers,
              queryKey: usersQueryKeys.infiniteList(),
            }}
            searchKey="username"
            placeholder="Multiple API Combobox"
            title="Multiple API Combobox"
            onChange={handleUsersChange}
            value={selectedUsers}
            getInputLabel={(users) =>
              users.map((user) => (
                <ComboboxChip key={user.id}>{user.username}</ComboboxChip>
              ))
            }
            isItemEqualToValue={(item, value) => item.id === value.id}
          >
            {(data) => (
              <>
                {data?.pages.map(({ data }) =>
                  data
                    .filter(
                      (user) =>
                        !selectedUsers.some(
                          (selectedUser) => user.id === selectedUser.id,
                        ),
                    )
                    .map((item) => (
                      <ComboboxItem key={item.id} value={item}>
                        {item.username}
                      </ComboboxItem>
                    )),
                )}
              </>
            )}
          </InputPlus>
        </Frame>
        <Frame title="Select Field" className="grid grid-cols-2 gap-5 w-full">
          <InputPlus
            type="select"
            title="Select Field"
            value={user}
            onChange={handleUserChange}
            getInputLabel={(item) => item?.username || "Select Field"}
          >
            <SelectGroup>
              <SelectLabel>User</SelectLabel>
              <SelectItem value={null}>Select Field</SelectItem>
              {usersQuery.data?.data?.map((item) => (
                <SelectItem key={item.id} value={item}>
                  {item.username}
                </SelectItem>
              ))}
            </SelectGroup>
          </InputPlus>
          <InputPlus
            type="select"
            title="Multiple Select Field"
            multiple
            value={selectedUsers}
            onChange={handleUsersChange}
            getInputLabel={(items) =>
              items?.length
                ? items.map((item) => item.username).join(", ")
                : "Multiple Select Field"
            }
            isItemEqualToValue={(item, value) => item.id === value.id}
          >
            <SelectGroup>
              <SelectLabel>User</SelectLabel>
              {usersQuery.data?.data?.map((item) => (
                <SelectItem key={item.id} value={item}>
                  {item.username}
                </SelectItem>
              ))}
            </SelectGroup>
          </InputPlus>
          <InputPlus
            type="selectApi"
            title="API Select"
            value={user}
            onChange={handleUserChange}
            isItemEqualToValue={(item, value) => item.id === value.id}
            getInputLabel={(item) => item?.username || "API Select"}
            queryProps={{
              queryFn: getUsers,
              queryKey: usersQueryKeys.infiniteList(),
            }}
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
          <InputPlus
            type="selectApi"
            title="Multiple API Select"
            multiple
            value={selectedUsers}
            onChange={handleUsersChange}
            isItemEqualToValue={(item, value) => item.id === value.id}
            getInputLabel={(items) =>
              items.length
                ? items.map((item) => item.username).join(", ")
                : "Multiple API Select"
            }
            queryProps={{
              queryFn: getUsers,
              queryKey: usersQueryKeys.infiniteList(),
            }}
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
        </Frame>
      </div>

      <Card className="pb-52">
        <CardContent>
          <UsersTable
            logicalOperator={logicalOperator}
            setLogicalOperator={setLogicalOperator}
            onSortChange={handleSortChange}
            page={page}
            selectedRows={selectedRows}
            setPage={setPage}
            setSelectedRows={setSelectedRows}
            sorts={sorts}
            count={meta?.total || 0}
            perPage={meta?.perPage}
            rows={users}
            loading={usersQuery.isPending}
            scLoading={usersQuery.isFetching}
            handleFiltersChange={handleFiltersChange}
            debounceFilters={debounceFilters}
            filters={tableFilters}
            setFilters={(newFilters) => {
              if (typeof newFilters === "object") {
                setTableFilters(newFilters);
              } else {
                return setTableFilters(newFilters(tableFilters));
              }
            }}
          />
        </CardContent>
      </Card>
    </div>
  );
}
