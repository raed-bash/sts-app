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
import {
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectValue,
} from "@/components/ui/select";
import useCachingState from "@/hooks/useCashingState";
import { SelectFieldTrigger } from "@/components/inputs/select/SelectField";
import type { SyntheticEvent } from "@/components/utils/events";
import { SelectApiContent } from "@/components/inputs/select/SelectApi";
import {
  ComboboxChip,
  ComboboxChips,
  ComboboxContent,
  ComboboxGroup,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxValue,
} from "@/components/ui/combobox";
import { useSelectApi } from "@/components/hooks";
import { Spinner } from "@/components/ui/spinner";
import useDebouncedValue from "@/hooks/useDebouncedValue";
import { useComboboxAnchor } from "@/components/hooks/useComboboxAnchor";
import { ComboboxFieldChipsInput } from "@/components/inputs/select/ComboboxField";

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

  const [search, setSearch] = useState("");

  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, listBoxProps, infiniteQuery } = useSelectApi({
    queryFn: (params) =>
      usersApi.getUsers({ ...params, username: debouncedSearch }),
    queryKey: ["ComboboxselectedUser", debouncedSearch],
  });

  const comboboxAnchor = useComboboxAnchor();
  const handleComboboxChange = (e: SyntheticEvent) => {
    setUsers(e.target.value);
  };
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">Users</h1>

      <InputPlus
        type="combobox"
        isItemEqualToValue={(item, value) => item.id === value.id}
        itemToStringLabel={(item) => item.username}

        onInputValueChange={(inputValue) => {
          setSearch(inputValue);
        }}

        onChange={handleComboboxChange}
        value={users}
        multiple
      >
        <ComboboxChips ref={comboboxAnchor}>
          <ComboboxValue>
            {(values: UserDto[]) => (
              <>
                {values.map((value) => (
                  <ComboboxChip key={value.id}>{value.username}</ComboboxChip>
                ))}
                <ComboboxFieldChipsInput placeholder="Select users" />
              </>
            )}
          </ComboboxValue>
        </ComboboxChips>

        <ComboboxContent anchor={comboboxAnchor}>
          <ComboboxList {...listBoxProps}>
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

            <ComboboxItem
              disabled

              className="justify-center"

              unselectable="on"

              value={crypto.randomUUID()}
            >
              {infiniteQuery.isFetching ? (
                <Spinner className="justify-center" />
              ) : !infiniteQuery.hasNextPage &&
                (data?.pages[0].meta.total || 0) > 0 ? (
                "no more items"
              ) : (
                (data?.pages[0].meta.total || 0) === 0 && "no items found"
              )}
            </ComboboxItem>
          </ComboboxList>
        </ComboboxContent>
      </InputPlus>
      <InputPlus
        type="selectApi"
        value={user}
        onChange={handleUserChange}
        isItemEqualToValue={(item, value) => item.id === value.id}
        itemToStringLabel={(item) => item.username}
        queryProps={{ queryFn: usersApi.getUsers, queryKey: ["selectedUser2"] }}
      >
        {(data) => (
          <>
            <SelectFieldTrigger>
              <SelectValue placeholder="User" />
            </SelectFieldTrigger>
            <SelectApiContent>
              <SelectGroup>
                <SelectLabel>User</SelectLabel>
                {data?.pages?.map((page) => (
                  <SelectGroup key={page.meta.currentPage}>
                    <SelectLabel>Page: {page.meta.currentPage}</SelectLabel>
                    {page.data.map((item) => (
                      <SelectItem key={item.id} value={item}>
                        {item.username}
                      </SelectItem>
                    ))}
                  </SelectGroup>
                ))}
              </SelectGroup>
            </SelectApiContent>
          </>
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
