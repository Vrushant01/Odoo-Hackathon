import React from "react";
import SearchBar from "../SearchBar/SearchBar";

export const MaintenanceSearch = ({ value, onChange, onClear, placeholder = "Search record code, vehicle, mechanic, workshop..." }) => {
  return (
    <div style={{ width: "100%", maxWidth: "450px" }}>
      <SearchBar
        value={value}
        onChange={onChange}
        onClear={onClear}
        placeholder={placeholder}
      />
    </div>
  );
};

export default MaintenanceSearch;
