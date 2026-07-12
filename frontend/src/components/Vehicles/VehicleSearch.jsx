import React from "react";
import SearchBar from "../SearchBar/SearchBar";

export const VehicleSearch = ({ value, onChange, onClear, placeholder = "Search registration plate, model, brand..." }) => {
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

export default VehicleSearch;
