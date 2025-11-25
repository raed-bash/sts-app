import { useState } from "react";
import "./App.css";
import RawAutocomplete from "./components/inputs/select/RawAutocomplete";
import { type UniqueValue } from "./components/inputs/select/hooks/useRawSelectUtils";

function App() {
  const [value, setValue] =
    useState<Map<UniqueValue, (typeof options)[number]>>();
  console.log(value);
  return (
    <div>
      <RawAutocomplete
        value={value}
        options={options}
        multiple={true}
        getUniqueValue={(opt) => opt.id}
        getOptionLabel={(opt) => opt.name}
        getInputLabel={(opts) =>
          [...opts.values()].map((opt) => opt.name).toString()
        }
        onChange={(e) => {
          setValue(e.target.value);
        }}
      />
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
