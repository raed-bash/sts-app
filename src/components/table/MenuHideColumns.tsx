import React, { memo, useCallback, useMemo, useState } from "react";
import Menu from "../menu/Menu";
import InputIcon from "../inputs/InputIcon";
import Button from "../buttons/Button";
import { ReactComponent as SearchIcon } from "src/assets/icons/search.svg";

function MenuHideColumns({
  columns,
  onReset,
  handleToggleColumns,
  hiddenColumns,
}) {
  const [searchMenuCols, setSearchMenuCols] = useState("");

  const handleSearchChange = useCallback((e) => {
    setSearchMenuCols(e.target.value);
  }, []);

  const filteredColumns = useMemo(
    () =>
      columns.filter((column) => column.headerName.includes(searchMenuCols)),
    [columns, searchMenuCols]
  );

  return (
    <Menu>
      <InputIcon
        placeholder="بحث"
        EndIcon={SearchIcon}
        inputFrameProps={{ className: "rounded-md h-10" }}
        onChange={handleSearchChange}
      />
      <div>
        {filteredColumns.length ? (
          filteredColumns.map((column) => (
            <div
              className="flex gap-3 cursor-pointer hover:bg-secondary-secondary py-1  items-center"
              key={column.name}
              onClick={handleToggleColumns(column)}
            >
              <input
                className="w-4 h-4 cursor-pointer"
                type="checkbox"
                readOnly
                checked={hiddenColumns.has(column.name)}
              />
              {column.headerName}
            </div>
          ))
        ) : (
          <p className="text-gray-400">لا أعمدة...</p>
        )}
      </div>

      <Button
        variant="outlined"
        className="h-fit  rounded-sm py-2 text-sm px-1 border-none disabled:bg-white disabled:text-black hover:text-primary-main   "
        onClick={onReset}
      >
        إعادة تعيين
      </Button>
    </Menu>
  );
}

export default memo(MenuHideColumns);
