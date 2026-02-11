import React, { useState } from "react";
import Menu from "../menu/Menu";
import InputIcon from "../inputs/InputIcon";
import Button from "../buttons/Button";
import SearchIcon from "src/assets/icons/search.svg?react";
import type { TableColumn } from "./Table";

export type MenuHideColumnsProps = {
  columns: TableColumn[];
  onReset: React.MouseEventHandler<HTMLButtonElement> | undefined;
  handleToggleColumns: (
    column: TableColumn,
  ) => React.MouseEventHandler<HTMLDivElement> | undefined;
  hiddenColumns: Set<TableColumn["name"]>;
};

function MenuHideColumns({
  columns,
  onReset,
  handleToggleColumns,
  hiddenColumns,
}: MenuHideColumnsProps) {
  const [searchMenuCols, setSearchMenuCols] = useState("");

  const handleSearchChange:
    | React.ChangeEventHandler<HTMLInputElement>
    | undefined = (e) => {
    setSearchMenuCols(e.target.value);
  };

  const filteredColumns = columns.filter((column) =>
    column.headerName.includes(searchMenuCols),
  );

  return (
    <Menu>
      <InputIcon
        placeholder="Search..."
        EndIcon={(props) => (
          <SearchIcon
            {...props}
            className={`dark:stroke-(--text) ${props.className}`}
          />
        )}
        inputFrameProps={{ className: "rounded-md h-8 " }}
        className="placeholder:text-xs w-30"
        onChange={handleSearchChange}
      />
      <div>
        {filteredColumns.length ? (
          filteredColumns.map((column) => (
            <div
              className="flex gap-3 cursor-pointer hover:bg-(--primary) rounded text-[13px] hover:text-(--primary-foreground) ps-2 py-1  items-center"
              key={column.name}
              onClick={handleToggleColumns(column)}
            >
              <input
                className="w-4 h-4 cursor-pointer"
                type="checkbox"
                readOnly
                checked={!hiddenColumns.has(column.name)}
              />
              {column.headerName}
            </div>
          ))
        ) : (
          <p className="text-gray-400">no columns...</p>
        )}
      </div>

      <Button
        color="primary"
        variant="outlined"
        className="py-2 px-1 text-[13px] border-none shadow-none"
        onClick={onReset}
      >
        Reset
      </Button>
    </Menu>
  );
}

export default MenuHideColumns;
