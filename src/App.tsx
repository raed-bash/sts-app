import { useState } from "react";
import "./App.css";
import RawSelect from "./components/inputs/select/RawSelect";
import type { UniqueValue } from "./components/inputs/select/hooks/useRawSelectUtils";
import Table, { type TableColumn } from "./components/table/Table";
const columns: TableColumn[] = [
  {
    headerName: "raed",
    name: "rad",
    getCell: (_, { name }) => {
      return "";
    },
    type: "actions",
  },
];

function App() {
  const [value, setValue] =
    useState<Map<UniqueValue, (typeof options)[number]>>();

  return (
    <div>
      <Table columns={columns} rows={[{ id: 1, name: "raed" }]} />
    </div>
  );
}

export default App;

const options: { id: number; name: string; age?: number }[] = [
  {
    id: 1,
    name: "raed",
  },
  {
    id: 2,
    name: "khaled",
  },
  {
    id: 3,
    name: "Gehad",
  },
];
