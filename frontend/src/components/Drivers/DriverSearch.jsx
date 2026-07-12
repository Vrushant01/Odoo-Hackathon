import React from "react";
import SearchBar from "../SearchBar/SearchBar";

export const DriverSearch = ({ value, onChange, onClear, placeholder = "Search driver name, license, contact..." }) => {
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

export default DriverSearch;
