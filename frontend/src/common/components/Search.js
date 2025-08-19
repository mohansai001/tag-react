import React from 'react';
const Search = ({ value, onChange, placeholder = 'Search...' }) => (
  <input type="search" value={value} onChange={onChange} placeholder={placeholder} />
);
export default Search;
