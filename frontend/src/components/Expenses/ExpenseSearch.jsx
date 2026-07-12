import React from "react";
import SearchBar from "../SearchBar/SearchBar";

export const ExpenseSearch = ({ value, onChange, onClear, placeholder = "Search expense ID, vehicle, trip ID, type, vendor..." }) => {
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

export default ExpenseSearch;
