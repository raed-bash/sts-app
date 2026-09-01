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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useSelectApi from "@/hooks/useSelectApi";
import { Spinner } from "@/components/ui/spinner";

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

  const { handleScroll, allData, infiniteQueryOptions } = useSelectApi<UserDto>(
    {
      queryKey: ["users"],
      queryFn: async (params) => {
        const data = await usersApi.getUsers({
          perPage: 10,
          page: params.pageParam,
        });

        return {
          data: data.data,
          pageParam: params.pageParam,
          count: data.meta.total,
        };
      },
    },
  );

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

      <Select value="">
        <SelectTrigger>
          <SelectValue placeholder="Theme" />
        </SelectTrigger>
        <SelectContent
          onScroll={handleScroll}
          listProps={{
            onScroll: handleScroll,
          }}
        >
          <SelectGroup>
            <SelectLabel>Theme</SelectLabel>
            {allData.map((item) => (
              <SelectItem key={item.id} value={item.id}>
                {item.username}
              </SelectItem>
            ))}
          </SelectGroup>
          <SelectItem
            disabled
            itemTextProps={{ className: "justify-center " }}
            className="pr-0"
          >
            {infiniteQueryOptions.isFetching ? (
              <Spinner className="justify-center" />
            ) : (
              "No more items"
            )}
          </SelectItem>
        </SelectContent>
      </Select>

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
