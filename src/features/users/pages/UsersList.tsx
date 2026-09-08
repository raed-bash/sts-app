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
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
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
import Frame from "@/shared/components/custom/frame/Frame";
import { useComboboxAnchor } from "@/shared/components/custom/combobox/useComboboxAnchor";

export default function UsersList() {
  const { filters } = useFilterState("usersFilters", new QueryUserDto({}));

  const {
    filters: debounceFilters,
    filterDebounced,
    handleFiltersChange,
  } = useDebouncedFilter("usersFiltersDebounce", new QueryUserDto({}));

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

  const handleUsersChange = (e: SyntheticEvent) => {
    setUsers(e.target.value);
  };
  const comboboxAnchor = useComboboxAnchor();

  return (
    <div className="flex flex-col gap-5">
      <h1 className="text-3xl font-bold mb-4">Users</h1>
      <div className="flex gap-5 ">
        <Frame title="Combobox Field" className="grid grid-cols-2 gap-5 w-full">
          <InputPlus<UserDto>
            type="combobox"
            items={usersQuery.data?.data}
            isItemEqualToValue={(item, value) => item.id === value.id}
            itemToStringLabel={(item) => item.username}
            empty={<ComboboxEmpty>No users</ComboboxEmpty>}
            placeholder="Combobox Field"
            title="Combobox Field"
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
            value={users}
            onChange={handleUsersChange}
            items={usersQuery.data?.data}
            isItemEqualToValue={(item, value) => item.id === value.id}
            itemToStringLabel={(item) => item.username}
            getInputLabel={(items) =>
              items.map((item) => (
                <ComboboxChip key={item.id}>{item.username}</ComboboxChip>
              ))
            }
          >
            <ComboboxGroup>
              <ComboboxLabel>Users</ComboboxLabel>

              {usersQuery.data?.data?.map((user) => (
                <ComboboxItem key={user.id} value={user}>
                  {user.username}
                </ComboboxItem>
              ))}
            </ComboboxGroup>
          </InputPlus>

          <InputPlus
            type="comboboxApi"
            isItemEqualToValue={(item, value) => item.id === value.id}
            itemToStringLabel={(item) => item.username}
            onChange={handleUsersChange}
            value={user}
            queryProps={{
              queryFn: usersApi.getUsers,
              queryKey: ["selectUserssa"],
            }}
            searchKey={"username" as keyof QueryUserDto}
            placeholder="API Combobox"
            title="API Combobox"
          >
            {(data) => (
              <>
                <ComboboxEmpty>No users</ComboboxEmpty>
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
              </>
            )}
          </InputPlus>

          <Combobox
            isItemEqualToValue={(item, value) => item.id === value.id}
            itemToStringLabel={(item) => item.username}
            value={users}
            multiple

            onValueChange={(values) =>
              handleUsersChange({ target: { name: "", value: values } })
            }
          >
            <ComboboxChips ref={comboboxAnchor}>
              <ComboboxValue>
                {(values: UserDto[]) => (
                  <>
                    {values.map((value) => (
                      <ComboboxChip key={value.id}>
                        {value.username}
                      </ComboboxChip>
                    ))}
                    <ComboboxChipsInput placeholder="Select users" />
                  </>
                )}
              </ComboboxValue>
            </ComboboxChips>

            <ComboboxContent anchor={comboboxAnchor}>
              <ComboboxList>
                <ComboboxGroup>
                  <ComboboxLabel>Users</ComboboxLabel>
                  {/* {data?.pages.map((page) => (
                  <ComboboxGroup key={page.meta.currentPage}>
                    <ComboboxLabel>page {page.meta.currentPage}</ComboboxLabel> */}
                  {usersQuery.data?.data.map((item) => (
                    <ComboboxItem key={item.id} value={item}>
                      {item.username}
                    </ComboboxItem>
                  ))}
                  {/* </ComboboxGroup>
                ))} */}
                </ComboboxGroup>
              </ComboboxList>
            </ComboboxContent>
          </Combobox>
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
            value={users}
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
              queryFn: usersApi.getUsers,
              queryKey: ["selectedUser2"],
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
            value={users}
            onChange={handleUsersChange}
            isItemEqualToValue={(item, value) => item.id === value.id}
            getInputLabel={(items) =>
              items.length
                ? items.map((item) => item.username).join(", ")
                : "Multiple API Select"
            }
            queryProps={{
              queryFn: usersApi.getUsers,
              queryKey: ["selectedUser2"],
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
            onSortChange={handleSortChange}
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
            handleFiltersChange={handleFiltersChange}
            debounceFilters={debounceFilters}
          />
        </CardContent>
      </Card>
    </div>
  );
}
