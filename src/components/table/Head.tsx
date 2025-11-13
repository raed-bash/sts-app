import React, { memo } from "react";
import Row from "./Row";
import HeaderCell from "./HeaderCell";
import SortButton from "../buttons/SortButton";
/**
 * @typedef tableProps
 * @type {import("./Table").tableProps}
 */

/**
 * @typedef headerCellProps
 * @type {import('./HeaderCell').headerCellProps}
 */

/**
 * @typedef bodyCellProps
 * @type {import("./BodyCell").bodyCellProps}
 */

/**
 * @typedef utils
 * @property {tableProps['columns']} columns
 * @property {import("./Row").rowProps} headRowProps
 * @property {boolean} selectable
 * @property {(row:any)=>(e:React.ChangeEvent<HTMLInputElement>)=>void} handleSelectRow
 * @property {headerCellProps} headerCellsProps
 * @property {headerCellProps} headerCheckboxCellProps
 * @property {headerCellProps|bodyCellProps} cellsProps
 * @property {headerCellProps|bodyCellProps} checkboxCellProps
 */

/**
 * @typedef headProps
 * @type {React.HTMLAttributes<HTMLTableSectionElement> & utils}
 */

/**
 * @param {headProps} props
 */
function Head({
  handleSortClick,
  sortStatuses,
  handleSelectRow,
  selectAll,
  columns,
  className,
  selectable,
  headRowProps = { className: "" },
  headerCellsProps = { className: "" },
  headerCheckboxCellProps = { className: "" },
  cellsProps = { className: "" },
  checkboxCellProps = { className: "" },
  ...props
}) {
  return (
    <thead {...props}>
      <Row
        {...headRowProps}
        className={"bg-primary-light " + headRowProps.className}
      >
        {selectable && (
          <HeaderCell
            {...headerCellsProps}
            {...checkboxCellProps}
            {...headerCheckboxCellProps}
            className={`w-20 ${headerCellsProps.className} ${checkboxCellProps.className} ${headerCheckboxCellProps.className} `}
          >
            <input
              type="checkbox"
              onChange={handleSelectRow()}
              name="selectAll"
              checked={Boolean(selectAll)}
              className="w-5 h-5 max-lg:w-4 max-lg:h-4"
            />
          </HeaderCell>
        )}
        {columns.map(
          ({
            headerCellProps = { className: "" },
            className = "",
            props = { className: "" },
            ...column
          }) => (
            <HeaderCell
              key={column.name}
              title={column.headerName}
              {...cellsProps}
              {...props}
              {...headerCellsProps}
              {...headerCellProps}
              className={`${className} ${cellsProps.className} ${props.className} ${headerCellsProps.className} ${headerCellProps.className}`}
            >
              <div className="flex items-center justify-center">
                {column.headerName}
                {column.sort && (
                  <SortButton
                    className="mt-0"
                    onClick={handleSortClick(column)}
                    sortStatus={sortStatuses[column.name]}
                  />
                )}
              </div>
            </HeaderCell>
          )
        )}
      </Row>
    </thead>
  );
}

export default memo(Head);
