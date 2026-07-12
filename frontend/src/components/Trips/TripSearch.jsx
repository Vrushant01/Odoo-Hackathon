import React from "react";
import SearchBar from "../SearchBar/SearchBar";

export const TripSearch = ({ value, onChange, onClear, placeholder = "Search Trip ID, driver, vehicle, origin..." }) => {
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

export default TripSearch;
