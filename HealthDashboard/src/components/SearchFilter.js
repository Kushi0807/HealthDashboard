import React, { useContext, useState } from "react";
import { PatientContext } from "../context/patientContext";
import { useDebounce } from "../hooks/useDebounce";

const SearchFilter = () => {
  const { dispatch } = useContext(PatientContext);
  const [search, setSearch] = useState("");
  const debouncedSearch = useDebounce(search, 500);

  React.useEffect(() => {
    dispatch({ type: "SET_SEARCH", payload: debouncedSearch });
  }, [debouncedSearch, dispatch]);

  const filterStyle = { margin: "1rem 0", display: "flex", gap: "0.5rem" };

  return (
    <div style={filterStyle}>
      <input placeholder="Search by name..." value={search} onChange={e => setSearch(e.target.value)} />
      <select onChange={e => dispatch({ type: "SET_FILTER", payload: e.target.value })}>
        <option>All</option>
        <option>Normal</option>
        <option>High</option>
      </select>
    </div>
  );
};

export default SearchFilter;
