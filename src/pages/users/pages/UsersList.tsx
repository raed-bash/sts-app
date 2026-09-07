import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { usersApi } from "../users.api";
import { UserPages } from "../users.pages";
import UsersTable from "../components/UsersTable";
import { QueryUserDto } from "../dtos/query-user.dto";
import { UserDto } from "../dtos/user.dto";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "@/shared/components/ui/combobox";
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
} from "@/shared/components/ui/select";
import { useComboboxAnchor } from "@/shared/hooks";
import { ComboboxFieldChipsInput } from "@/shared/components/custom/combobox/ComboboxField";
import { ComboboxApiList } from "@/shared/components/custom/combobox/ComboboxApi";
import {
  useCachedState,
  useFilterState,
  useDebouncedFilter,
  useSelectedRows,
  useSorts,
} from "@/hooks";
import type { SyntheticEvent } from "@/shared/utils";
import InputPlus from "@/shared/components/custom/inputs/InputPlus";
import { Card, CardContent } from "@/shared/components/ui/card";

export default function UsersList() {
  const { filters } = useFilterState("usersFilters", new QueryUserDto({}));

  const { filtersDebounce, filterDebounced, handleFiltersDebounceChange } =
    useDebouncedFilter("usersFiltersDebounce", new QueryUserDto({}));

  const { selectedRows, setSelectedRows } = useSelectedRows(
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

  const [user, setUser] = useCachedState<UserDto | null>("selectedUsers", null);

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
      <Combobox<UserDto> itemToStringLabel={(item) => item.username}>
        <ComboboxInput placeholder="Select a user" />
        <ComboboxContent>
          <ComboboxList>
            <ComboboxEmpty>No items found.</ComboboxEmpty>
            {users.map((item) => (
              <ComboboxItem key={item.id} value={item}>
                {item.username}
              </ComboboxItem>
            ))}
          </ComboboxList>
        </ComboboxContent>
      </Combobox>
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
