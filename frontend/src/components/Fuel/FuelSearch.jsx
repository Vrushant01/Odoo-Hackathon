import React from "react";
import SearchBar from "../SearchBar/SearchBar";

export const FuelSearch = ({ value, onChange, onClear, placeholder = "Search vehicle, trip ID, driver, invoice, station..." }) => {
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

export default FuelSearch;
