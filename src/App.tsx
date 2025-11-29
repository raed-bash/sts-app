import Table from "./components/table/Table";
function App() {
  return (
    <Table
      columns={[
        {
          name: "id",
          headerName: "ID",
        },
        {
          name: "name",
          headerName: "Name",
          hidden: true,
          sort: true,
        },
      ]}
      rows={[
        { id: 1, name: "raed" },
        { id: 3, name: "fadel" },
      ]}
    />
  );
}

export default App;
